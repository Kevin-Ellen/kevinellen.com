// audits/run-h06-audit.cjs

const ts = require("typescript");
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");

const root = process.cwd();
const srcRoot = path.resolve(root, "src");
const reportPath = path.resolve(root, "audits/H06-resolver-registry-consistency.txt");
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
const checker = program.getTypeChecker();
const findings = [];
const observations = [];
const counters = new Map();
const slash = (value) => value.split(path.sep).join("/");
const relative = (file) => slash(path.relative(root, file));
const within = (file, directory) => file === directory || file.startsWith(`${directory}${path.sep}`);
const isTest = (file) => /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(file);
const normalise = (value) => value.replace(/\s+/g, " ").trim();
const snippet = (node, source) => normalise(node.getText(source)).slice(0, 190);
const isResolverFile = (name) => /(?:resolver|registry|getter|app-resolve|app-render-context)/.test(name);
const isRegistryFile = (name) => /registry|registries/.test(name);
const knownDiscriminator = (name) => /^(?:kind|type|source|pageType|moduleType|componentType|variant|status)$/i.test(name);
const location = (source, node) => {
  const pos = source.getLineAndCharacterOfPosition(node.getStart(source));
  return { file: relative(source.fileName), line: pos.line + 1, column: pos.character + 1 };
};
const add = (list, category, source, node, detail) => {
  const position = location(source, node);
  const entry = { category, ...position, detail: normalise(detail).slice(0, 190) };
  entry.id = createHash("sha256")
    .update(`${category}\0${entry.file}\0${entry.detail}`)
    .digest("hex").slice(0, 16);
  list.push(entry);
};
const propertyName = (node) => {
  if (!node) return null;
  if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text;
  if (ts.isComputedPropertyName(node) && ts.isStringLiteral(node.expression)) return node.expression.text;
  return null;
};
const propertyAccess = (node) => {
  if (ts.isPropertyAccessExpression(node)) return node.name.text;
  if (ts.isElementAccessExpression(node) && node.argumentExpression && ts.isStringLiteral(node.argumentExpression)) {
    return node.argumentExpression.text;
  }
  return null;
};
const isLiteral = (node) => !!node && (
  ts.isStringLiteral(node) || ts.isNumericLiteral(node) ||
  node.kind === ts.SyntaxKind.TrueKeyword || node.kind === ts.SyntaxKind.FalseKeyword ||
  node.kind === ts.SyntaxKind.NullKeyword
);
const literalValue = (node) => {
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text;
  return node.kind === ts.SyntaxKind.TrueKeyword ? "true" : node.kind === ts.SyntaxKind.FalseKeyword ? "false" : "null";
};
const isDispatchTableType = (node) => {
  if (!node) return false;
  if (ts.isTypeReferenceNode(node) && ["Record", "Readonly"].includes(node.typeName.getText())) return true;
  if (ts.isMappedTypeNode(node)) return true;
  return false;
};
const isThrow = (node) => {
  let found = false;
  const visit = (n) => {
    if (ts.isThrowStatement(n)) found = true;
    // A throw in a nested callback does not establish the outer branch's behaviour.
    if (n !== node && ts.isFunctionLike(n)) return;
    ts.forEachChild(n, visit);
  };
  visit(node);
  return found;
};
const containsReturn = (node) => {
  let found = false;
  const visit = (n) => {
    if (ts.isReturnStatement(n)) found = true;
    if (n !== node && ts.isFunctionLike(n)) return;
    ts.forEachChild(n, visit);
  };
  visit(node);
  return found;
};
const isExplicitTerminator = (statements) => {
  const last = statements.at(-1);
  return !!last && (ts.isReturnStatement(last) || ts.isThrowStatement(last) ||
    ts.isBreakStatement(last) || ts.isContinueStatement(last));
};
const getTypeSummary = (expression) => {
  try {
    return checker.typeToString(checker.getTypeAtLocation(expression)).slice(0, 90);
  } catch {
    return "unavailable";
  }
};

let inspected = 0;
let resolverModules = 0;
for (const source of program.getSourceFiles()) {
  const file = path.resolve(source.fileName);
  if (!within(file, srcRoot) || source.isDeclarationFile || isTest(file)) continue;
  inspected++;
  const name = relative(file);
  if (!isResolverFile(name)) continue;
  resolverModules++;

  const visit = (node) => {
    if (ts.isSwitchStatement(node)) {
      counters.set("Switch dispatches", (counters.get("Switch dispatches") || 0) + 1);
      const discriminator = propertyAccess(node.expression);
      const clauses = node.caseBlock.clauses;
      const defaults = clauses.filter(ts.isDefaultClause);
      const cases = clauses.filter(ts.isCaseClause);
      const values = cases.filter((c) => isLiteral(c.expression)).map((c) => literalValue(c.expression));
      if (discriminator && knownDiscriminator(discriminator)) {
        add(observations, "DISCRIMINANT_SWITCH", source, node, `switch ${snippet(node.expression, source)}; type: ${getTypeSummary(node.expression)}`);
        if (defaults.length === 0) {
          add(observations, "SWITCH_WITHOUT_DEFAULT_REVIEW", source, node, `switch ${snippet(node.expression, source)}; case count: ${cases.length}`);
        } else if (defaults.length === 1 && !isThrow(defaults[0]) && !containsReturn(defaults[0])) {
          add(observations, "DEFAULT_BEHAVIOUR_REVIEW", source, defaults[0], snippet(defaults[0], source));
        }
      }
      if (defaults.length > 1) add(findings, "DUPLICATE_DEFAULT", source, node, snippet(node.expression, source));
      const seen = new Set();
      for (const value of values) {
        if (seen.has(value)) add(findings, "DUPLICATE_CASE_VALUE", source, node, `${snippet(node.expression, source)}: ${value}`);
        seen.add(value);
      }
      for (let i = 0; i < clauses.length - 1; i++) {
        const clause = clauses[i];
        if (clause.statements.length && !isExplicitTerminator(clause.statements)) {
          add(observations, "SWITCH_FALLTHROUGH_REVIEW", source, clause, snippet(clause, source));
        }
      }
    }

    if (ts.isVariableDeclaration(node) && node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
      const object = node.initializer;
      const nameText = node.name.getText(source);
      const looksDispatch = /(?:resolver|registry|dispatch|getter|handler|library|mapping|map)$/i.test(nameText) ||
        /(?:^|_)(?:resolver|registry|dispatch|getter|handler)(?:_|$)/i.test(nameText);
      const typedRecord = isDispatchTableType(node.type);
      const fnValues = object.properties.filter((p) =>
        ts.isMethodDeclaration(p) || (ts.isPropertyAssignment(p) &&
          (ts.isArrowFunction(p.initializer) || ts.isFunctionExpression(p.initializer))));
      if ((looksDispatch || typedRecord) && fnValues.length >= 2) {
        counters.set("Dispatch tables", (counters.get("Dispatch tables") || 0) + 1);
        add(observations, "DISPATCH_TABLE", source, node,
          `${nameText}: keys ${object.properties.map((p) => propertyName(p.name) || "[computed]").join(", ")}; ${typedRecord ? "typed Record-like" : "type mapping review"}`);
        if (!node.type && !object.properties.some((p) => ts.isSpreadAssignment(p))) {
          add(observations, "DISPATCH_TABLE_TYPE_REVIEW", source, node, `${nameText}: no explicit Record/mapped type annotation`);
        }
      }
      if (isRegistryFile(name)) {
        const seen = new Set();
        for (const prop of object.properties) {
          if (!("name" in prop)) continue;
          const key = propertyName(prop.name);
          if (!key) continue;
          if (seen.has(key)) add(findings, "DUPLICATE_REGISTRY_OBJECT_KEY", source, prop, `${nameText}.${key}`);
          seen.add(key);
        }
      }
    }

    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
      const method = node.expression.name.text;
      if (method === "sort" && node.arguments.length === 0) {
        add(observations, "IMPLICIT_SORT_ORDER_REVIEW", source, node, snippet(node, source));
      }
      if ((method === "values" || method === "entries" || method === "keys") &&
        node.expression.expression.getText(source) === "Object") {
        const parent = node.parent;
        // Inventory for order-sensitive registry construction; lexical ordering is not proof of nondeterminism.
        if (isRegistryFile(name) || /(?:journal-list|topic-list|listing|registry)/.test(name)) {
          add(observations, "OBJECT_ENUMERATION_ORDER_REVIEW", source, node, snippet(parent, source));
        }
      }
    }

    if (ts.isForOfStatement(node) && isRegistryFile(name)) {
      const input = node.expression.getText(source);
      if (/Object\.(?:entries|values|keys)\(/.test(input)) {
        add(observations, "REGISTRY_ITERATION_ORDER_REVIEW", source, node, snippet(node.expression, source));
      }
    }

    if (ts.isIfStatement(node) && ts.isBinaryExpression(node.expression)) {
      const expr = node.expression;
      const op = expr.operatorToken.kind;
      if (op === ts.SyntaxKind.EqualsEqualsEqualsToken || op === ts.SyntaxKind.ExclamationEqualsEqualsToken) {
        const left = propertyAccess(expr.left);
        const right = propertyAccess(expr.right);
        if ((left && knownDiscriminator(left) && isLiteral(expr.right)) ||
          (right && knownDiscriminator(right) && isLiteral(expr.left))) {
          counters.set("Discriminant comparisons", (counters.get("Discriminant comparisons") || 0) + 1);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

const sorter = (a, b) => a.file.localeCompare(b.file) || a.line - b.line ||
  a.column - b.column || a.category.localeCompare(b.category);
const unique = (items) => [...new Map(items.map((item) => [
  `${item.category}\0${item.file}\0${item.line}\0${item.column}\0${item.detail}`, item,
])).values()].sort(sorter);
const candidateList = unique(findings);
const observationList = unique(observations);
const categories = (items) => {
  const counts = new Map();
  for (const item of items) counts.set(item.category, (counts.get(item.category) || 0) + 1);
  return [...counts].sort(([a], [b]) => a.localeCompare(b)).map(([name, count]) => `${name}: ${count}`);
};
const render = (items) => items.flatMap((item) => [
  `[${item.category}] ${item.file}:${item.line}:${item.column} (id: ${item.id})`,
  `  ${item.detail}`,
]);
const report = [
  "=== H06 RESOLVER AND REGISTRY CONSISTENCY AUDIT ===",
  "",
  "Scope: src/ non-declaration, non-test resolver/getter/registry/lifecycle modules",
  `All source modules inspected: ${inspected}`,
  `Resolver-related modules examined: ${resolverModules}`,
  "Mode: read-only baseline; potential issues require source review",
  "",
  "=== DISPATCH INVENTORY ===",
  ...[...counters].sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}: ${value}`),
  "",
  "=== STATIC CANDIDATES ===",
  `Candidates: ${candidateList.length}`,
  ...categories(candidateList),
  "",
  ...render(candidateList),
  "",
  "=== REVIEW OBSERVATIONS ===",
  `Observations: ${observationList.length}`,
  ...categories(observationList),
  "",
  ...render(observationList),
  "",
  "=== TARGETED MANUAL REVIEW ===",
  "[ ] Resolver selectors use canonical discriminants and typed dispatch tables where appropriate",
  "[ ] Unknown variants follow deliberate throw/fallback/never paths; no accidental undefined output",
  "[ ] All registry entries are resolved via the same contract for equivalent inputs",
  "[ ] Duplicate or colliding registry keys are rejected or intentionally resolved",
  "[ ] Registry iteration order cannot alter output for identical published input",
  "[ ] Lists have explicit and stable ordering, including deterministic tie-breakers",
  "[ ] Any fallback/merge precedence is intentional and covered by targeted tests",
  "[ ] Same input, different resolution path produces equivalent canonical output",
  "[ ] Exceptions have evidence and rationale; no broad refactoring without a verified issue",
  "",
  "=== LIMITATIONS ===",
  "The checker identifies syntax patterns; it does not prove runtime equivalence or exhaustiveness.",
  "Switch default presence alone does not prove a safe unknown-variant behaviour.",
  "A typed Record dispatch table may still have an invalid runtime key; test unknown inputs explicitly.",
  "Object enumeration is deterministic by JS rules, but relying on insertion order for semantic output can be fragile.",
  "Only resolver-related files are analysed for dispatch/order candidates; cross-module paths require manual tracing.",
  "No application source files were changed.",
  "",
  "BASELINE: Classify observations and review representative dispatch/registry paths before H06 verdict.",
];
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${report.join("\n")}\n`, "utf8");
console.log(report.slice(0, 19).join("\n"));
console.log(`\nReport: ${relative(reportPath)}`);
