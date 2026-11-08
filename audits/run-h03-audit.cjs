// audits/run-h03-audit.cjs

const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const root = process.cwd();
const checksDirectory = path.join(root, "audits");
const reportPath = path.join(checksDirectory, "H03-import-hygiene-audit.txt");
const relative = (file) => path.relative(root, file).split(path.sep).join("/");

const readText = (file) =>
  fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;

const packagePath = path.join(root, "package.json");
const packageText = readText(packagePath);
const packageJson = packageText ? JSON.parse(packageText) : null;
const configPath = ts.findConfigFile(root, ts.sys.fileExists, "tsconfig.json");

if (!configPath) {
  throw new Error("H03: tsconfig.json not found");
}

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
    parsed.errors
      .map((error) => ts.flattenDiagnosticMessageText(error.messageText, "\n"))
      .join("\n"),
  );
}

const eslintPath = path.join(root, "eslint.config.mjs");
const eslintSource = readText(eslintPath);
const relevantRules = [
  "consistent-type-imports",
  "no-unused-vars",
  "no-restricted-imports",
  "no-duplicate-imports",
  "import/no-cycle",
  "import/no-duplicates",
  "import/no-unused-modules",
];

const sourceFiles = parsed.fileNames.filter((file) => {
  const absolute = path.resolve(file);
  return (
    absolute.startsWith(`${path.join(root, "src")}${path.sep}`) &&
    !file.endsWith(".d.ts") &&
    !/\.(test|spec)\.[cm]?[jt]sx?$/.test(file)
  );
});

const candidates = [];

const stats = {
  importDeclarations: 0,
  typeOnlyImports: 0,
  valueImports: 0,
  exportDeclarations: 0,
  reExports: 0,
  namedExportDeclarations: 0,
  defaultExportDeclarations: 0,
  exportAssignments: 0,
  exportedStatements: 0,
  exportedTypeStatements: 0,
  exportedRuntimeStatements: 0,
  files: 0,
};

for (const filename of sourceFiles) {
  const source = ts.createSourceFile(
    filename,
    fs.readFileSync(filename, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    filename.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  stats.files++;

  const importPaths = new Map();
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const specifier = statement.moduleSpecifier;
    if (!ts.isStringLiteral(specifier)) continue;
    const locations = importPaths.get(specifier.text) ?? [];
    locations.push(source.getLineAndCharacterOfPosition(statement.getStart(source)).line + 1);
    importPaths.set(specifier.text, locations);
  }

  for (const [specifier, lines] of importPaths) {
    if (lines.length > 1) {
      candidates.push({
        category: "REPEATED_IMPORT_SOURCE",
        file: relative(filename),
        line: lines[0],
        detail: `${specifier} (lines ${lines.join(", ")})`,
      });
    }
  }

  const inspectNode = (node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "require") {
      candidates.push({
        category: "COMMONJS_REQUIRE_CALL",
        file: relative(filename),
        line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1,
        detail: node.getText(source).slice(0, 160),
      });
    }
    if (ts.isBinaryExpression(node) && ts.isPropertyAccessExpression(node.left) &&
      ts.isIdentifier(node.left.expression) && node.left.expression.text === "module" &&
      node.left.name.text === "exports") {
      candidates.push({
        category: "COMMONJS_MODULE_EXPORTS",
        file: relative(filename),
        line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1,
        detail: node.left.getText(source),
      });
    }
    ts.forEachChild(node, inspectNode);
  };
  ts.forEachChild(source, inspectNode);

  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement)) {
      stats.importDeclarations++;
      if (statement.importClause?.isTypeOnly) {
        stats.typeOnlyImports++;
      } else {
        stats.valueImports++;
      }
    } else if (ts.isExportDeclaration(statement)) {
      stats.exportDeclarations++;
      if (statement.moduleSpecifier) stats.reExports++;
      else stats.namedExportDeclarations++;
    }

    if (ts.isExportAssignment(statement)) {
      stats.exportAssignments++;
    }

    if (ts.canHaveModifiers(statement)) {
      const modifiers = ts.getModifiers(statement) ?? [];
      if (modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
        stats.exportedStatements++;
        if (modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword)) {
          stats.defaultExportDeclarations++;
        }
        if (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) {
          stats.exportedTypeStatements++;
        } else {
          stats.exportedRuntimeStatements++;
        }
      }
    }
  }
}

const optionNames = [
  "strict",
  "verbatimModuleSyntax",
  "noUnusedLocals",
  "noUnusedParameters",
  "isolatedModules",
  "moduleResolution",
  "module",
];

const formatOption = (name) => {
  const value = parsed.options[name];
  if (value === undefined) return "not explicitly enabled";
  if (name === "moduleResolution") return ts.ModuleResolutionKind[value] ?? String(value);
  if (name === "module") return ts.ModuleKind[value] ?? String(value);
  return String(value);
};

const report = [
  "=== H03 IMPORT AND MODULE HYGIENE AUDIT ===",
  "",
  "Scope: src/ production modules (excluding tests and declaration files)",
  `Files inspected: ${stats.files}`,
  `Import declarations: ${stats.importDeclarations}`,
  `Type-only import declarations: ${stats.typeOnlyImports}`,
  `Value/mixed import declarations: ${stats.valueImports}`,
  `Exported declarations (export const/type/interface/class/etc.): ${stats.exportedStatements}`,
  `  Type declarations: ${stats.exportedTypeStatements}`,
  `  Other declarations: ${stats.exportedRuntimeStatements}`,
  `  Default exported declarations (subset): ${stats.defaultExportDeclarations}`,
  `Export statements (export { ... } / export *): ${stats.exportDeclarations}`,
  `  Re-exports from other modules: ${stats.reExports}`,
  `  Local named export statements: ${stats.namedExportDeclarations}`,
  `Export assignments (export default expression / export =): ${stats.exportAssignments}`,
  "",
  "=== TYPESCRIPT OPTIONS ===",
  ...optionNames.map((name) => `${name}: ${formatOption(name)}`),
  "",
  "=== ESLINT RULE REFERENCES ===",
  `Config: ${eslintSource ? relative(eslintPath) : "not found"}`,
  ...relevantRules.map((rule) => {
    if (!eslintSource) return `${rule}: config unavailable`;
    return `${rule}: ${eslintSource.includes(rule) ? "referenced in config" : "not found in config text"}`;
  }),
  "Note: Config text references do not prove a rule is active for every file. Confirm with ESLint's resolved config if needed.",
  "",
  "=== PACKAGE SCRIPTS ===",
  ...Object.entries(packageJson?.scripts ?? {})
    .filter(([name]) => /lint|type|check|test|build/i.test(name))
    .map(([name, command]) => `${name}: ${command}`),
  "",
  "=== H03 IMPORT AND MODULE HYGIENE FINDINGS ===",
  `Findings: ${candidates.length}`,
  ...[...new Set(candidates.map((candidate) => candidate.category))].sort().map(
    (category) => `${category}: ${candidates.filter((candidate) => candidate.category === category).length}`,
  ),
  "",
  ...candidates.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line).flatMap(
    (candidate) => [
      `[${candidate.category}] ${candidate.file}:${candidate.line}`,
      `  ${candidate.detail}`,
    ],
  ),
  "",
  "=== INTERPRETATION ===",
  "Repeated imports and CommonJS usage in production source are treated as H03 violations.",
  "Existing ESLint and TypeScript checks remain authoritative for their configured rules.",
  "Unused exports require entry-point and dynamic-consumer classification before removal.",
  "Unused exports remain outside the enforced H03 checks.",
  "No source files were changed.",
  "",
  candidates.length === 0
    ? "PASS: No import/module hygiene violations detected."
    : "FAIL: Import/module hygiene violations detected.",
  "",
];

fs.mkdirSync(checksDirectory, { recursive: true });
fs.writeFileSync(reportPath, report.join("\n"), "utf8");
console.log(report.join("\n"));
console.log(`Report: ${relative(reportPath)}`);

if (candidates.length > 0) {
  process.exitCode = 1;
}
