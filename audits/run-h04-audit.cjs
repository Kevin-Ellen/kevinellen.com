// audits/run-h04-audit.cjs

const ts = require("typescript");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = process.cwd();
const srcRoot = path.join(root, "src");
const auditsRoot = path.join(root, "audits");
const reportPath = path.join(auditsRoot, "H04-type-safety-audit.txt");
const reviewPath = path.join(auditsRoot, "H04-type-safety-reviews.json");
const configPath = ts.findConfigFile(root, ts.sys.fileExists, "tsconfig.json");

if (!configPath) throw new Error("tsconfig.json not found");

const config = ts.readConfigFile(configPath, ts.sys.readFile);
if (config.error) {
  throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, "\n"));
}

const parsed = ts.parseJsonConfigFileContent(
  config.config,
  ts.sys,
  path.dirname(configPath),
);
if (parsed.errors.length > 0) {
  throw new Error(
    ts.formatDiagnosticsWithColorAndContext(parsed.errors, {
      getCanonicalFileName: (file) => file,
      getCurrentDirectory: () => root,
      getNewLine: () => "\n",
    }),
  );
}

const program = ts.createProgram(parsed.fileNames, parsed.options);
const checker = program.getTypeChecker();
const findings = [];
const externalBoundary = [];
const exhaustiveGuards = [];

const isWithin = (file, directory) =>
  file === directory || file.startsWith(`${directory}${path.sep}`);
const relative = (file) => path.relative(root, file).split(path.sep).join("/");
const isTest = (file) => /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(file);
const classifyScope = (file) => {
  if (file.startsWith("src/tests/")) return "TEST_INFRASTRUCTURE";
  if (file.startsWith("src/tools/")) return "PUBLISHING_TOOLING";
  return "WORKER_RUNTIME";
};
const normalise = (value) => value.replace(/\s+/g, " ").trim();
const snippet = (node, source) => normalise(node.getText(source)).slice(0, 180);
const fingerprint = (category, file, detail) =>
  crypto
    .createHash("sha256")
    .update(`${category}\n${file}\n${detail}`)
    .digest("hex")
    .slice(0, 16);

const add = (category, source, node, detail) => {
  const { line, character } = source.getLineAndCharacterOfPosition(
    node.getStart(source),
  );
  const file = relative(source.fileName);
  const description = normalise(detail);
  findings.push({
    id: fingerprint(category, file, description),
    category,
    scope: classifyScope(file),
    file,
    line: line + 1,
    column: character + 1,
    detail: description.slice(0, 180),
  });
};
const addObservation = (list, category, source, node, detail) => {
  const { line } = source.getLineAndCharacterOfPosition(node.getStart(source));
  const file = relative(source.fileName);
  list.push({
    category,
    scope: classifyScope(file),
    file,
    line: line + 1,
    detail: detail.slice(0, 180),
  });
};
const hasTypeFlag = (type, flag) => (type.flags & flag) !== 0;
const isAny = (type) => hasTypeFlag(type, ts.TypeFlags.Any);
const containsAny = (type) =>
  isAny(type) || (type.isUnionOrIntersection() && type.types.some(containsAny));
const isUnknown = (type) => hasTypeFlag(type, ts.TypeFlags.Unknown);
const unwrap = (expression) => {
  let current = expression;
  while (
    ts.isParenthesizedExpression(current) ||
    ts.isAsExpression(current) ||
    ts.isTypeAssertionExpression(current) ||
    ts.isNonNullExpression(current) ||
    ts.isSatisfiesExpression(current)
  ) {
    current = current.expression;
  }
  return current;
};

let inspected = 0;
for (const source of program.getSourceFiles()) {
  const from = path.resolve(source.fileName);
  if (!isWithin(from, srcRoot) || source.isDeclarationFile || isTest(from)) continue;
  inspected++;

  const visit = (node) => {
    if (node.kind === ts.SyntaxKind.AnyKeyword) {
      add("EXPLICIT_ANY", source, node, snippet(node.parent, source));
    }
    if (ts.isAsExpression(node) || ts.isTypeAssertionExpression(node)) {
      const targetType = checker.getTypeFromTypeNode(node.type);
      const sourceType = checker.getTypeAtLocation(node.expression);
      if (isAny(targetType)) {
        add("CAST_TO_ANY", source, node, snippet(node, source));
      } else if (isUnknown(targetType)) {
        if (
          node.parent &&
          (ts.isAsExpression(node.parent) || ts.isTypeAssertionExpression(node.parent))
        ) {
          add(
            "DOUBLE_ASSERTION_CANDIDATE",
            source,
            node.parent,
            snippet(node.parent, source),
          );
        }
      } else if (containsAny(sourceType)) {
        add("ASSERTION_FROM_ANY", source, node, snippet(node, source));
      }
    }
    if (ts.isNonNullExpression(node)) {
      add("NON_NULL_ASSERTION", source, node, snippet(node, source));
    }
    if (ts.isCallExpression(node)) {
      const expr = unwrap(node.expression);
      if (ts.isPropertyAccessExpression(expr) && expr.name.text === "parse") {
        const owner = unwrap(expr.expression);
        if (ts.isIdentifier(owner) && owner.text === "JSON") {
          addObservation(
            externalBoundary,
            "JSON_PARSE",
            source,
            node,
            snippet(node, source),
          );
        }
      }
      if (ts.isPropertyAccessExpression(expr) && expr.name.text === "json") {
        addObservation(
          externalBoundary,
          "JSON_METHOD",
          source,
          node,
          snippet(node, source),
        );
      }
      if (
        ts.isIdentifier(expr) &&
        /^(?:assertNever|assertUnreachable)$/.test(expr.text)
      ) {
        addObservation(
          exhaustiveGuards,
          "EXHAUSTIVENESS_HELPER",
          source,
          node,
          snippet(node, source),
        );
      }
    }
    if (ts.isSwitchStatement(node)) {
      const type = checker.getTypeAtLocation(node.expression);
      const constituentTypes = type.isUnion() ? type.types : [];
      const literals = constituentTypes.filter(
        (part) =>
          part.isLiteral() || hasTypeFlag(part, ts.TypeFlags.BooleanLiteral),
      );
      if (literals.length >= 2 && literals.length === constituentTypes.length) {
        const cases = node.caseBlock.clauses.filter(ts.isCaseClause);
        const hasDefault = node.caseBlock.clauses.some(ts.isDefaultClause);
        const remaining = literals.filter(
          (part) =>
            !cases.some((clause) => {
              const value = checker.getTypeAtLocation(clause.expression);
              return checker.isTypeAssignableTo(part, value);
            }),
        );
        if (remaining.length > 0 && !hasDefault) {
          add(
            "UNHANDLED_LITERAL_UNION_SWITCH",
            source,
            node,
            `Missing case(s): ${remaining
              .map((part) => checker.typeToString(part))
              .join(", ")}`,
          );
        } else if (hasDefault) {
          addObservation(
            exhaustiveGuards,
            "SWITCH_WITH_DEFAULT",
            source,
            node,
            snippet(node.expression, source),
          );
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

const sortByLocation = (a, b) =>
  a.file.localeCompare(b.file) || a.line - b.line || (a.column || 0) - (b.column || 0);
findings.sort(sortByLocation);
externalBoundary.sort(sortByLocation);
exhaustiveGuards.sort(sortByLocation);

// A review entry must be explicit and supported by a reason. Unknown findings
// remain OPEN. Old reviewed entries are shown as STALE, never silently reused.
const loadReviews = () => {
  if (!fs.existsSync(reviewPath)) return [];
  const data = JSON.parse(fs.readFileSync(reviewPath, "utf8"));
  if (
    !data ||
    data.version !== 1 ||
    !Array.isArray(data.reviews) ||
    !data.reviews.every(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.category === "string" &&
        typeof item.file === "string" &&
        item.status === "ACCEPTED" &&
        typeof item.reason === "string" &&
        item.reason.trim().length > 0,
    )
  ) {
    throw new Error(`Invalid H04 review manifest: ${relative(reviewPath)}`);
  }
  const ids = data.reviews.map((item) => item.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error(`Duplicate IDs in H04 review manifest: ${relative(reviewPath)}`);
  }
  return data.reviews;
};

const reviews = loadReviews();
const reviewById = new Map(reviews.map((entry) => [entry.id, entry]));
const matched = new Set();
const classified = findings.map((finding) => {
  const review = reviewById.get(finding.id);
  if (!review || review.category !== finding.category || review.file !== finding.file) {
    return { ...finding, status: "OPEN" };
  }
  matched.add(finding.id);
  return { ...finding, status: "ACCEPTED", reason: review.reason };
});
const stale = reviews.filter((review) => !matched.has(review.id));
const open = classified.filter((finding) => finding.status === "OPEN");
const accepted = classified.filter((finding) => finding.status === "ACCEPTED");

const scopes = ["WORKER_RUNTIME", "PUBLISHING_TOOLING", "TEST_INFRASTRUCTURE"];
const countBy = (items, property, value) =>
  items.filter((item) => item[property] === value).length;
const grouped = findings.reduce((result, finding) => {
  result[finding.category] = (result[finding.category] || 0) + 1;
  return result;
}, {});
const render = (items) =>
  items.flatMap(({ category, file, line, column, detail }) => [
    `[${category}] ${file}:${line}${column ? `:${column}` : ""}`,
    `  ${detail}`,
  ]);
const renderFinding = (item) => [
  `[${item.status}] [${item.scope}] [${item.category}] ${item.file}:${item.line}:${item.column} (id: ${item.id})`,
  `  ${item.detail}`,
  ...(item.reason ? [`  Reason: ${item.reason}`] : []),
];
const kvRelated = externalBoundary.filter((item) =>
  /(?:kv|content|publish|registry|journal|photo|asset)/i.test(item.file),
);
const verdict = open.length === 0 && stale.length === 0 ? "PASS" : "REVIEW REQUIRED";

const output = [
  "=== H04 TYPE SAFETY AUDIT ===",
  "",
  "Scope: src/ modules excluding declaration files and *.test/*.spec files; includes CLI tooling and integration fixtures",
  `Files inspected: ${inspected}`,
  `Strict mode: ${String(parsed.options.strict === true)}`,
  `noUncheckedIndexedAccess: ${String(parsed.options.noUncheckedIndexedAccess === true)}`,
  `exactOptionalPropertyTypes: ${String(parsed.options.exactOptionalPropertyTypes === true)}`,
  "",
  "=== VERDICT ===",
  `Result: ${verdict}`,
  `Open candidates: ${open.length}`,
  `Accepted exceptions: ${accepted.length}`,
  `Stale reviews: ${stale.length}`,
  `Review manifest: ${relative(reviewPath)}${fs.existsSync(reviewPath) ? "" : " (not created)"}`,
  "",
  "=== CANDIDATES BY RESPONSIBILITY ===",
  ...scopes.map(
    (scope) =>
      `${scope}: ${countBy(classified, "scope", scope)} (${countBy(open, "scope", scope)} open, ${countBy(accepted, "scope", scope)} accepted)`,
  ),
  "",
  "=== STATIC REVIEW CANDIDATES ===",
  `Candidates: ${findings.length}`,
  ...Object.entries(grouped).map(([category, count]) => `${category}: ${count}`),
  "",
  ...classified.flatMap(renderFinding),
  "",
  "=== STALE REVIEWS (PREVIOUS FINDINGS NO LONGER MATCHING) ===",
  `Count: ${stale.length}`,
  ...stale.flatMap((review) => [
    `[STALE] [${review.category}] ${review.file} (id: ${review.id})`,
    `  Reason: ${review.reason}`,
  ]),
  "",
  "=== EXTERNAL DATA BOUNDARY INVENTORY ===",
  `JSON parse / .json() call sites: ${externalBoundary.length}`,
  `Content-related call sites: ${kvRelated.length}`,
  ...render(externalBoundary),
  "",
  "=== EXHAUSTIVENESS OBSERVATIONS ===",
  `Observed guards/defaults: ${exhaustiveGuards.length}`,
  ...render(exhaustiveGuards),
  "",
  "=== RUNTIME KV BOUNDARY REVIEW ===",
  "Journal ledger: src/app/life-cycle/routing/ledger/ledger.routing.ts",
  "Published content: src/app/life-cycle/app-resolve/getters/content/kv/kv.content.getter.app-resolve.ts",
  "Photo metadata: src/app/life-cycle/app-resolve/getters/photo-kv/photo-kv.getter.app-resolve.ts",
  "These are manually reviewed locations, not automatically verified by this script.",
  "Run their Jest suites and integration tests separately; this audit does not prove runtime coverage.",
  "",
  "=== REVIEW NOTES ===",
  "An ACCEPTED exception requires a matching fingerprint, file, category and non-empty reason.",
  "New or modified assertions are OPEN until reviewed; stale entries must be reconciled.",
  "A PASS means no unreviewed static candidates, not proof of complete runtime type safety.",
  "A default switch branch is not proof of exhaustiveness.",
  "JSON boundary inventory is syntactic, not proof of payload validation.",
  "No source files were changed.",
];

fs.mkdirSync(auditsRoot, { recursive: true });
fs.writeFileSync(reportPath, `${output.join("\n")}\n`);
console.log(output.slice(0, 23).join("\n"));
console.log();
console.log(`Report: ${relative(reportPath)}`);

// Don't use a non-zero exit for findings during review: it remains a useful
// interactive audit. Use --check in CI when all exceptions have been classified.
if (process.argv.includes("--check") && verdict !== "PASS") {
  process.exitCode = 1;
}
