// audits/run-h05-audit.cjs

const ts = require("typescript");
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");

const root = process.cwd();
const srcRoot = path.resolve(root, "src");
const reportPath = path.resolve(root, "audits/H05-content-storage-ownership.txt");
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
const findings = [];
const observations = [];
const fileCounts = new Map();

const relative = (file) => path.relative(root, file).split(path.sep).join("/");
const isWithin = (file, directory) =>
  file === directory || file.startsWith(`${directory}${path.sep}`);
const isTest = (file) => /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(file);
const normalise = (value) => value.replace(/\s+/g, " ").trim();
const snippet = (node, source) => normalise(node.getText(source)).slice(0, 180);

const roleOf = (file) => {
  const name = relative(file);
  if (name.startsWith("src/tools/")) return "PUBLISHING_TOOLING";
  if (name.startsWith("src/tests/") || isTest(name)) return "TEST_INFRASTRUCTURE";
  if (name.includes("/app-render-context/")) return "APP_RENDER_CONTEXT";
  if (name.includes("/app-render/")) return "APP_RENDER";
  if (name.includes("/app-resolve/")) return "APP_RESOLVE";
  if (name.includes("/routing/")) return "ROUTING";
  if (name.startsWith("src/content-schema/")) return "CONTENT_SCHEMA";
  if (name.startsWith("src/shared/")) return "SHARED";
  return "OTHER_RUNTIME";
};

const add = (list, category, source, node, detail) => {
  const { line, character } = source.getLineAndCharacterOfPosition(
    node.getStart(source),
  );
  const item = {
    category,
    role: roleOf(source.fileName),
    file: relative(source.fileName),
    line: line + 1,
    column: character + 1,
    detail: normalise(detail).slice(0, 180),
  };
  item.id = createHash("sha256")
    .update(`${item.category}\0${item.file}\0${item.detail}`)
    .digest("hex")
    .slice(0, 16);
  list.push(item);
};

const isPresentation = (role) =>
  role === "APP_RENDER" || role === "APP_RENDER_CONTEXT";
const isRender = (role) => role === "APP_RENDER";
const isStorageBinding = (name) =>
  name === "CONTENT_KV" || name === "PHOTO_KV";
const storageBindingIn = (node) => {
  if (ts.isPropertyAccessExpression(node) && isStorageBinding(node.name.text)) {
    return true;
  }
  if (
    ts.isElementAccessExpression(node) &&
    node.argumentExpression &&
    ts.isStringLiteral(node.argumentExpression) &&
    isStorageBinding(node.argumentExpression.text)
  ) {
    return true;
  }
  return false;
};
const isStorageBindingAccess = (node) =>
  storageBindingIn(node) ||
  (ts.isPropertyAccessExpression(node) && storageBindingIn(node.expression));
const isCloudflareImageUrl = (text) =>
  /api\.cloudflare\.com\/client\/v4\/accounts\/.*\/images\/|imagedelivery\.net\//i.test(text);
const importsModule = (source, node) =>
  (ts.isImportDeclaration(node) && node.moduleSpecifier &&
    ts.isStringLiteral(node.moduleSpecifier)) ||
  (ts.isExportDeclaration(node) && node.moduleSpecifier &&
    ts.isStringLiteral(node.moduleSpecifier));
const isTypeOnlyImport = (node) =>
  ts.isImportDeclaration(node) && node.importClause?.isTypeOnly === true;
const isTypeOnlyExport = (node) =>
  ts.isExportDeclaration(node) && node.isTypeOnly === true;

let inspected = 0;
for (const source of program.getSourceFiles()) {
  const file = path.resolve(source.fileName);
  if (!isWithin(file, srcRoot) || source.isDeclarationFile || isTest(file)) {
    continue;
  }

  inspected++;
  const role = roleOf(file);
  fileCounts.set(role, (fileCounts.get(role) || 0) + 1);

  const visit = (node) => {
    if (importsModule(source, node)) {
      const specifier = node.moduleSpecifier.text;
      const typeOnly = isTypeOnlyImport(node) || isTypeOnlyExport(node);
      const isToolsImport = /(?:^|\/)tools\//.test(specifier);
      const isStorageSdk = /^(?:@cloudflare\/|cloudflare$|@aws-sdk\/client-|wrangler$)/.test(specifier);
      const isGetterImport = /(?:^|\/)(?:getters|kv)(?:\/|$)/.test(specifier);

      if (isPresentation(role) && !typeOnly && (isToolsImport || isStorageSdk)) {
        add(findings, "PRESENTATION_STORAGE_OR_TOOL_IMPORT", source, node, specifier);
      }
      if (isPresentation(role) && !typeOnly && isGetterImport) {
        add(findings, "PRESENTATION_GETTER_IMPORT_CANDIDATE", source, node, specifier);
      }
      if (isRender(role) && !typeOnly && /app-resolve|app-render-context/.test(specifier)) {
        add(observations, "RENDER_LIFECYCLE_IMPORT_REVIEW", source, node, specifier);
      }
    }

    if (
      (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) &&
      storageBindingIn(node) &&
      isPresentation(role)
    ) {
      add(findings, "PRESENTATION_KV_BINDING_ACCESS", source, node, snippet(node, source));
    }

    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
      const call = node.expression;
      const method = call.name.text;
      if (
        ["get", "put", "delete", "list", "getWithMetadata"].includes(method) &&
        isStorageBindingAccess(call.expression)
      ) {
        add(
          isPresentation(role) ? findings : observations,
          isPresentation(role) ? "PRESENTATION_DIRECT_KV_OPERATION" : "DIRECT_KV_OPERATION_INVENTORY",
          source,
          node,
          snippet(node, source),
        );
      }
    }

    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isTemplateExpression(node)) {
      const value = ts.isTemplateExpression(node) ? node.head.text : node.text;
      if (isCloudflareImageUrl(value)) {
        add(
          isPresentation(role) ? findings : observations,
          isPresentation(role) ? "PRESENTATION_IMAGES_API_OR_DELIVERY_REFERENCE" : "IMAGES_REFERENCE_INVENTORY",
          source,
          node,
          snippet(node, source),
        );
      }
    }

    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === "append" &&
      node.arguments.length >= 2 &&
      ts.isStringLiteral(node.arguments[0]) &&
      node.arguments[0].text === "metadata"
    ) {
      add(observations, "IMAGES_UPLOAD_METADATA_REVIEW", source, node, snippet(node, source));
    }

    ts.forEachChild(node, visit);
  };
  visit(source);
}

const ordering = (a, b) =>
  a.file.localeCompare(b.file) || a.line - b.line || a.column - b.column ||
  a.category.localeCompare(b.category);
findings.sort(ordering);
observations.sort(ordering);

const countCategories = (items) => {
  const counts = new Map();
  for (const item of items) counts.set(item.category, (counts.get(item.category) || 0) + 1);
  return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
};
const render = (items) => items.flatMap((item) => [
  `[${item.category}] [${item.role}] ${item.file}:${item.line}:${item.column} (id: ${item.id})`,
  `  ${item.detail}`,
]);

const output = [
  "=== H05 CONTENT AND STORAGE OWNERSHIP AUDIT ===",
  "",
  "Scope: src/ modules excluding declaration files and *.test/*.spec files",
  `Files inspected: ${inspected}`,
  "Mode: read-only static baseline; not an architectural compliance verdict",
  "",
  "=== MODULES BY RESPONSIBILITY ===",
  ...[...fileCounts.entries()].sort(([a], [b]) => a.localeCompare(b))
    .map(([role, count]) => `${role}: ${count}`),
  "",
  "=== STATIC OWNERSHIP CANDIDATES ===",
  `Candidates: ${findings.length}`,
  ...countCategories(findings).map(([category, count]) => `${category}: ${count}`),
  "",
  ...render(findings),
  "",
  "=== INVENTORY AND REVIEW SIGNALS ===",
  `Observations: ${observations.length}`,
  ...countCategories(observations).map(([category, count]) => `${category}: ${count}`),
  "",
  ...render(observations),
  "",
  "=== MANUAL ARCHITECTURAL REVIEW ===",
  "[ ] Homepage: request-composed, not bundled static content",
  "[ ] Journal / topic / gallery pages: KV-backed published structured content",
  "[ ] Bundled static pages: evergreen and deploy-coupled only",
  "[ ] KV: editorial photo metadata; no image binaries or CMS-like editorial workflow",
  "[ ] Cloudflare Images: binary assets, image IDs, variants, upload traceability",
  "[ ] Images upload metadata is not used as an authoritative editorial store",
  "[ ] App-Resolve: request-time KV retrieval and content composition",
  "[ ] App-Render-Context: deterministic preparation; no hidden storage reads",
  "[ ] App-Render / React: presentation and SSR; no direct storage reads",
  "[ ] Publishing CLI: validates generated artifacts before publishing",
  "[ ] Any exceptions: documented with owner, rationale, and evidence",
  "",
  "=== LIMITATIONS ===",
  "This is an AST-based candidate detector, not a dependency-flow proof.",
  "Aliased KV handles, computed accesses, wrapper functions and runtime wiring can evade detection.",
  "Import-name and URL heuristics can produce false positives; review candidates manually.",
  "Type-only imports are excluded from runtime import candidates.",
  "An image delivery URL in SSR can be legitimate; it does not prove ownership leakage.",
  "The absence of static candidates is not an H05 pass without manual review.",
  "No application source files were changed.",
  "",
  "BASELINE: Manual architectural classification required before H05 pass/fail.",
];

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${output.join("\n")}\n`, "utf8");
console.log(output.slice(0, 19).join("\n"));
console.log(`\nReport: ${relative(reportPath)}`);
