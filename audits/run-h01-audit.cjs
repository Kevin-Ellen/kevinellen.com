// audits/run-h01-audit.cjs

const ts = require("typescript");
const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const srcRoot = path.join(root, "src");
const lifecycleRoot = path.join(srcRoot, "app/life-cycle");
const sharedRoot = path.join(srcRoot, "shared");

const stages = [
  "app-init",
  "app-resolve",
  "app-render-context",
  "app-render",
];

const findings = [];
const edges = new Map();
const cycleEdges = new Map();

const relative = (file) => path.relative(root, file);

const isWithin = (file, directory) =>
  file === directory || file.startsWith(`${directory}${path.sep}`);

const isTest = (file) =>
  /\.(test|spec)\.[cm]?[jt]sx?$/.test(file);

const getStage = (file) => {
  if (!isWithin(file, lifecycleRoot)) return null;

  const stage = path.relative(lifecycleRoot, file).split(path.sep)[0];

  return stages.includes(stage) ? stage : null;
};

const addFinding = (category, from, to, detail) => {
  findings.push({
    category,
    from: relative(from),
    to: to ? relative(to) : "",
    detail,
  });
};

const configPath = ts.findConfigFile(
  root,
  ts.sys.fileExists,
  "tsconfig.json",
);

if (!configPath) throw new Error("tsconfig.json not found");

const config = ts.readConfigFile(configPath, ts.sys.readFile);

if (config.error) {
  throw new Error(
    ts.flattenDiagnosticMessageText(config.error.messageText, "\n"),
  );
}

const parsed = ts.parseJsonConfigFileContent(
  config.config,
  ts.sys,
  path.dirname(configPath),
);

const program = ts.createProgram(parsed.fileNames, parsed.options);

let importCount = 0;
let runtimeCount = 0;
let typeOnlyCount = 0;
let unresolvedCount = 0;

const localModules = (source) => {
  const modules = [];

  for (const statement of source.statements) {
    if (
      ts.isImportDeclaration(statement) ||
      ts.isExportDeclaration(statement)
    ) {
      if (!statement.moduleSpecifier) continue;
      if (!ts.isStringLiteral(statement.moduleSpecifier)) continue;

      const typeOnly =
        statement.isTypeOnly ||
        (ts.isImportDeclaration(statement) &&
          statement.importClause?.isTypeOnly === true);

      modules.push({
        specifier: statement.moduleSpecifier.text,
        typeOnly,
      });
    }

    if (
      ts.isCallExpression(statement) &&
      statement.expression.kind === ts.SyntaxKind.ImportKeyword
    ) {
      const argument = statement.arguments[0];

      if (argument && ts.isStringLiteral(argument)) {
        modules.push({
          specifier: argument.text,
          typeOnly: false,
        });
      }
    }
  }

  return modules;
};

for (const source of program.getSourceFiles()) {
  const from = path.resolve(source.fileName);

  if (!isWithin(from, srcRoot)) continue;
  if (source.isDeclarationFile || isTest(from)) continue;

  const imports = localModules(source);
  const outgoing = [];
  const runtimeOutgoing = [];

  for (const entry of imports) {
    importCount++;

    if (entry.typeOnly) typeOnlyCount++;
    else runtimeCount++;

    // Bundler queries (for example, "main.css?raw") are not filesystem
    // path segments and are not understood by TypeScript module resolution.
    const specifier = entry.specifier.split("?")[0];
    const resolved = ts.resolveModuleName(
      specifier,
      from,
      parsed.options,
      ts.sys,
    ).resolvedModule;

    if (!resolved) {
      if (entry.specifier.startsWith(".")) {
        // A relative non-TS asset is valid only if its actual file exists.
        // Do not silently suppress missing assets or unresolved TS modules.
        const assetPath = path.resolve(path.dirname(from), specifier);
        const isAsset = !/\.[cm]?[jt]sx?$/.test(specifier);

        if (
          isAsset &&
          fs.existsSync(assetPath) &&
          fs.statSync(assetPath).isFile()
        ) {
          continue;
        }

        unresolvedCount++;

        addFinding(
          "UNRESOLVED_RELATIVE_IMPORT",
          from,
          null,
          entry.specifier,
        );
      }

      continue;
    }

    const to = path.resolve(resolved.resolvedFileName);

    if (!isWithin(to, srcRoot)) continue;

    outgoing.push(to);

    if (!entry.typeOnly) {
      runtimeOutgoing.push(to);
    }

    const fromStage = getStage(from);
    const toStage = getStage(to);

    if (
      fromStage &&
      toStage &&
      fromStage !== toStage &&
      stages.indexOf(toStage) > stages.indexOf(fromStage)
    ) {
      addFinding(
        entry.typeOnly
          ? "REVERSE_LIFECYCLE_TYPE"
          : "REVERSE_LIFECYCLE_RUNTIME",
        from,
        to,
        `${fromStage} -> ${toStage}`,
      );
    }

    if (isWithin(from, sharedRoot) && isWithin(to, lifecycleRoot)) {
      addFinding(
        entry.typeOnly
          ? "SHARED_TO_LIFECYCLE_TYPE"
          : "SHARED_TO_LIFECYCLE_RUNTIME",
        from,
        to,
        entry.specifier,
      );
    }

    if (
      isWithin(from, sharedRoot) &&
      isWithin(to, path.join(srcRoot, "cli"))
    ) {
      addFinding(
        "SHARED_TO_CLI",
        from,
        to,
        entry.specifier,
      );
    }
  }

  edges.set(from, outgoing);
  cycleEdges.set(from, runtimeOutgoing);
}

const detectCycles = (graph) => {
  const visited = new Set();
  const active = new Set();
  const stack = [];
  const cycles = new Map();

  const visit = (node) => {
    if (active.has(node)) {
      const index = stack.indexOf(node);
      const cycle = [...stack.slice(index), node];
      const members = cycle.slice(0, -1).sort().join("|");

      if (!cycles.has(members)) {
        cycles.set(members, cycle);
      }

      return;
    }

    if (visited.has(node)) return;

    visited.add(node);
    active.add(node);
    stack.push(node);

    for (const next of graph.get(node) ?? []) {
      visit(next);
    }

    stack.pop();
    active.delete(node);
  };

  for (const node of graph.keys()) visit(node);

  return [...cycles.values()];
};

const runtimeCycles = detectCycles(cycleEdges);

for (const cycle of runtimeCycles) {
  addFinding(
    "RUNTIME_CYCLE",
    cycle[0],
    cycle[1],
    cycle.map(relative).join(" -> "),
  );
}

const counts = Object.groupBy
  ? Object.groupBy(findings, (finding) => finding.category)
  : findings.reduce((result, finding) => {
    (result[finding.category] ??= []).push(finding);
    return result;
  }, {});

const output = [
  "=== H01 ARCHITECTURAL DEPENDENCY AUDIT ===",
  "",
  `Source modules examined: ${edges.size}`,
  `Import/export declarations examined: ${importCount}`,
  `Runtime dependencies: ${runtimeCount}`,
  `Type-only dependencies: ${typeOnlyCount}`,
  `Unresolved relative imports: ${unresolvedCount}`,
  `Runtime circular dependencies: ${runtimeCycles.length}`,
  "",
  "=== FINDING COUNTS ===",
  ...Object.entries(counts).map(
    ([category, items]) => `${category}: ${items.length}`,
  ),
  "",
  "=== FINDINGS ===",
  ...findings.flatMap((finding) => [
    `[${finding.category}]`,
    `  From: ${finding.from}`,
    `  To: ${finding.to}`,
    `  Detail: ${finding.detail}`,
    "",
  ]),
];

fs.writeFileSync(
  path.join(root, "audits/H01-dependency-audit.txt"),
  `${output.join("\n")}\n`,
);

console.log(output.slice(0, 15).join("\n"));
console.log();
console.log(`Total findings: ${findings.length}`);

if (findings.length > 0) process.exitCode = 1;
