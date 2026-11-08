// audits/run-h07-audit.cjs

const ts = require("typescript");
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");

const root = process.cwd();
const sourceRoot = path.resolve(root, "src");
const reportPath = path.resolve(root, "audits/H07-error-handling-observability.txt");
const configPath = ts.findConfigFile(root, ts.sys.fileExists, "tsconfig.json");
if (!configPath) throw new Error("tsconfig.json not found");
const config = ts.readConfigFile(configPath, ts.sys.readFile);
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, "\n"));
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(configPath));
if (parsed.errors.length) {
  throw new Error(ts.formatDiagnostics(parsed.errors, {
    getCanonicalFileName: (file) => file,
    getCurrentDirectory: () => root,
    getNewLine: () => "\n",
  }));
}

const program = ts.createProgram(parsed.fileNames, parsed.options);
const findings = [];
const observations = [];
const counts = new Map();
const slash = (value) => value.split(path.sep).join("/");
const relative = (file) => slash(path.relative(root, file));
const within = (file, directory) => file === directory || file.startsWith(`${directory}${path.sep}`);
const isTest = (file) => /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(file);
const normalise = (value) => value.replace(/\s+/g, " ").trim();
const preview = (node, source) => normalise(node.getText(source)).slice(0, 180);
const count = (key) => counts.set(key, (counts.get(key) || 0) + 1);
const role = (file) => {
  if (/\/tools\/authored-content-generator\//.test(file)) return "PUBLISHING_TOOLING";
  if (/\/life-cycle\/routing\//.test(file)) return "ROUTING";
  if (/\/life-cycle\/app-resolve\//.test(file)) return "APP_RESOLVE";
  if (/\/life-cycle\/app-render-context\//.test(file)) return "APP_RENDER_CONTEXT";
  if (/\/life-cycle\/app-render\//.test(file)) return "APP_RENDER";
  if (/\/life-cycle\/system\//.test(file)) return "SYSTEM";
  return "OTHER";
};
const add = (list, category, source, node, detail) => {
  const { line, character } = source.getLineAndCharacterOfPosition(node.getStart(source));
  const file = relative(source.fileName);
  const item = { category, role: role(file), file, line: line + 1, column: character + 1, detail: normalise(detail).slice(0, 180) };
  item.id = createHash("sha256").update(`${category}\0${file}\0${item.detail}`).digest("hex").slice(0, 16);
  list.push(item);
};
const isName = (node, value) => ts.isIdentifier(node) && node.text === value;
const callName = (node, source) => {
  const expr = node.expression;
  if (ts.isIdentifier(expr)) return expr.text;
  if (ts.isPropertyAccessExpression(expr)) return `${expr.expression.getText(source)}.${expr.name.text}`;
  return expr.getText(source).slice(0, 100);
};
const isResponseConstruction = (node) => ts.isNewExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "Response";
const isErrorSignal = (text) => /(?:\berror\b|\.stack\b|\.message\b|\bstack\b|\bexception\b)/i.test(text);
const sensitive = (text) => /(?:authorization|cookie|api[_-]?token|api[_-]?key|secret|password|process\.env|request\.headers|request\.url|\.stack\b)/i.test(text);
const hasNested = (node, predicate) => {
  let found = false;
  const visit = (child) => {
    if (found) return;
    if (predicate(child)) { found = true; return; }
    if (child !== node && ts.isFunctionLike(child)) return;
    ts.forEachChild(child, visit);
  };
  visit(node);
  return found;
};
const hasReturnOrThrow = (node) => hasNested(node, (child) => ts.isReturnStatement(child) || ts.isThrowStatement(child));
const isLogCall = (node, source) => /^console\.(?:log|info|warn|error|debug|trace)$/.test(callName(node, source));
const responseStatus = (node, source) => {
  const options = node.arguments && node.arguments[1];
  if (!options || !ts.isObjectLiteralExpression(options)) return "implicit";
  const status = options.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText(source) === "status");
  return status ? preview(status.initializer, source) : "implicit";
};

let inspected = 0;
for (const source of program.getSourceFiles()) {
  const file = path.resolve(source.fileName);
  if (!within(file, sourceRoot) || source.isDeclarationFile || isTest(file)) continue;
  inspected++;
  const visit = (node) => {
    if (ts.isCatchClause(node)) {
      count("Catch clauses");
      const block = node.block;
      if (block.statements.length === 0) {
        add(findings, "EMPTY_CATCH", source, node, preview(node, source));
      } else if (!hasReturnOrThrow(block)) {
        add(observations, "CATCH_WITHOUT_RETURN_OR_THROW", source, node, preview(node, source));
      }
      if (hasNested(block, (child) => ts.isThrowStatement(child) && !!child.expression && ts.isNewExpression(child.expression))) {
        add(observations, "ERROR_REWRAP_REVIEW", source, node, preview(node, source));
      }
    }
    if (ts.isThrowStatement(node)) {
      count("Throw statements");
      const text = node.expression ? preview(node.expression, source) : "throw";
      if (/\bnew\s+Error\s*\(/.test(text)) {
        add(observations, "THROW_ERROR_INVENTORY", source, node, text);
      }
    }
    if (isResponseConstruction(node)) {
      count("Response constructors");
      const body = node.arguments && node.arguments[0];
      const bodyText = body ? preview(body, source) : "";
      const status = responseStatus(node, source);
      if (isErrorSignal(bodyText) && /(?:\.stack\b|\bstack\b)/i.test(bodyText)) {
        add(findings, "STACK_IN_HTTP_RESPONSE", source, node, `status=${status}; body=${bodyText}`);
      } else if (isErrorSignal(bodyText) && /(?:error\.message|String\(error\)|JSON\.stringify\(error\)|\$\{error\})/i.test(bodyText)) {
        add(observations, "RAW_ERROR_HTTP_RESPONSE_REVIEW", source, node, `status=${status}; body=${bodyText}`);
      }
      if (/^["'`]?(?:Internal Server Error|Not Found|Error|Invalid)/i.test(bodyText) || /^\d{3}$/.test(status)) {
        add(observations, "HTTP_ERROR_RESPONSE_INVENTORY", source, node, `status=${status}; body=${bodyText}`);
      }
    }
    if (ts.isCallExpression(node)) {
      const name = callName(node, source);
      if (isLogCall(node, source)) {
        count("Console calls");
        const args = node.arguments.map((arg) => preview(arg, source)).join(", ");
        if (sensitive(args)) {
          add(observations, "SENSITIVE_LOG_ARGUMENT_REVIEW", source, node, `${name}(${args})`);
        } else if (/\berror\b|\bexception\b/i.test(args)) {
          add(observations, "ERROR_LOGGING_INVENTORY", source, node, `${name}(${args})`);
        }
      }
      if (/^(?:JSON\.stringify)$/.test(name) && node.arguments.some((arg) => /(?:error|request|headers|process\.env)/i.test(preview(arg, source)))) {
        add(observations, "SENSITIVE_SERIALIZATION_REVIEW", source, node, preview(node, source));
      }
      if (/^process\.exit$/.test(name)) {
        add(observations, "CLI_TERMINATION_REVIEW", source, node, preview(node, source));
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

const sorter = (a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.column - b.column || a.category.localeCompare(b.category);
const unique = (items) => [...new Map(items.map((item) => [`${item.category}\0${item.file}\0${item.line}\0${item.column}`, item])).values()].sort(sorter);
const staticCandidates = unique(findings);
const reviewSignals = unique(observations);
const byCategory = (items) => {
  const tally = new Map();
  for (const item of items) tally.set(item.category, (tally.get(item.category) || 0) + 1);
  return [...tally].sort(([a], [b]) => a.localeCompare(b)).map(([category, total]) => `${category}: ${total}`);
};
const render = (items) => items.flatMap((item) => [
  `[${item.category}] [${item.role}] ${item.file}:${item.line}:${item.column} (id: ${item.id})`,
  `  ${item.detail}`,
]);
const report = [
  "=== H07 ERROR HANDLING AND OBSERVABILITY AUDIT ===", "",
  "Scope: src/ TypeScript modules excluding declarations and test/spec files",
  `Modules inspected: ${inspected}`,
  "Mode: read-only static baseline; manual classification required", "",
  "=== OPERATIONAL INVENTORY ===",
  ...[...counts].sort(([a], [b]) => a.localeCompare(b)).map(([name, total]) => `${name}: ${total}`), "",
  "=== STATIC CANDIDATES ===", `Candidates: ${staticCandidates.length}`,
  ...byCategory(staticCandidates), "", ...render(staticCandidates), "",
  "=== REVIEW OBSERVATIONS ===", `Observations: ${reviewSignals.length}`,
  ...byCategory(reviewSignals), "", ...render(reviewSignals), "",
  "=== ERROR-HANDLING CONTRACT TO VERIFY ===",
  "[ ] Missing public resource / unmatched route -> deliberate 404, stable public response",
  "[ ] Missing required published KV infrastructure -> operational failure, not silently converted into 404",
  "[ ] Malformed published KV payload -> operational failure with sanitized client response",
  "[ ] Unexpected failure -> centralized final HTTP handling; no stack or raw internal message in response",
  "[ ] Error diagnostics preserve layer, operation and non-sensitive identifiers without payloads/tokens/cookies",
  "[ ] Exceptions propagate to the appropriate boundary; catch only when recovering or adding useful context",
  "[ ] CLI validation/upload/write/verify failure aborts downstream publication and reports a meaningful error",
  "[ ] CLI exits non-zero on failure; remote workspace is not archived on partial publication",
  "[ ] Expected not-found behaviour and unexpected failures have targeted tests", "",
  "=== LIMITATIONS ===",
  "This AST scan cannot establish complete error classification or response sanitization across wrappers.",
  "Some exceptions are intentionally swallowed for best-effort cache operations; review by responsibility.",
  "Throw and logging inventories are observations, not errors. A catch without return/throw may legitimately recover.",
  "Sensitive-log detection is lexical; safe logging and hidden secret propagation both require manual review.",
  "Generated report does not imply PASS even with zero candidates.",
  "No application source files were changed.", "",
  "BASELINE: Review entry/response boundary, KV failure propagation, media proxy, and publishing CLI error path.",
];
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${report.join("\n")}\n`, "utf8");
console.log(report.slice(0, 20).join("\n"));
console.log(`\nReport: ${relative(reportPath)}`);
