// audits/run-h08-audit.cjs

const ts = require("typescript");
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");

const root = process.cwd();
const srcRoot = path.resolve(root, "src");
const reportPath = path.resolve(root, "audits/H08-performance-worker-runtime-hygiene.txt");
const configPath = ts.findConfigFile(root, ts.sys.fileExists, "tsconfig.json");
if (!configPath) throw new Error("tsconfig.json not found");
const config = ts.readConfigFile(configPath, ts.sys.readFile);
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, "\n"));
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(configPath));
if (parsed.errors.length) throw new Error(ts.formatDiagnostics(parsed.errors, {
  getCanonicalFileName: (file) => file,
  getCurrentDirectory: () => root,
  getNewLine: () => "\n",
}));

const program = ts.createProgram(parsed.fileNames, parsed.options);
const slash = (value) => value.split(path.sep).join("/");
const relative = (file) => slash(path.relative(root, file));
const within = (file, directory) => file === directory || file.startsWith(`${directory}${path.sep}`);
const isTest = (file) => /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(file);
const normalise = (value) => value.replace(/\s+/g, " ").trim();
const preview = (node, sf) => normalise(node.getText(sf)).slice(0, 160);
const findings = [];
const observations = [];
const counts = new Map();
const count = (name) => counts.set(name, (counts.get(name) || 0) + 1);
const add = (list, category, sf, node, detail) => {
  const pos = sf.getLineAndCharacterOfPosition(node.getStart(sf));
  const file = relative(sf.fileName);
  const item = {
    category, file, line: pos.line + 1, column: pos.character + 1,
    detail: normalise(detail).slice(0, 160),
  };
  item.id = createHash("sha256")
    .update(`${category}\0${file}\0${item.detail}`)
    .digest("hex").slice(0, 16);
  list.push(item);
};
const expressionName = (expr, sf) => expr.getText(sf);
const nameEnds = (text, name) => text === name || text.endsWith(`.${name}`);
const callIs = (node, sf, name) => ts.isCallExpression(node) && nameEnds(expressionName(node.expression, sf), name);
const isLoop = (node) => ts.isForStatement(node) || ts.isForInStatement(node) ||
  ts.isForOfStatement(node) || ts.isWhileStatement(node) || ts.isDoStatement(node);
const inLoop = (node) => {
  let current = node.parent;
  while (current) {
    if (isLoop(current)) return true;
    if (ts.isFunctionLike(current)) return false;
    current = current.parent;
  }
  return false;
};
const isPublishing = (file) => /\/tools\/authored-content-generator\//.test(slash(file));
const isRendering = (file) => /\/life-cycle\/(?:app-render|app-render-context)\//.test(slash(file));
const isWorkerRelevant = (file) => /\/app\//.test(slash(file)) || /\/shared\//.test(slash(file));
const sourceFiles = new Map();
for (const sf of program.getSourceFiles()) {
  const file = path.resolve(sf.fileName);
  if (!within(file, srcRoot) || sf.isDeclarationFile || isTest(file)) continue;
  sourceFiles.set(file, sf);
}

// Resolve only first-party value imports. Type-only dependencies do not add code to a Worker bundle.
const resolveLocal = (from, specifier) => {
  if (!specifier.startsWith(".")) return null;
  const base = path.resolve(path.dirname(from), specifier);
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, `${base}.js`,
    path.join(base, "index.ts"), path.join(base, "index.tsx")]) {
    if (sourceFiles.has(candidate)) return candidate;
  }
  return null;
};
const edges = new Map();
const imports = new Map();
for (const [file, sf] of sourceFiles) {
  const next = new Set();
  const records = [];
  sf.forEachChild((node) => {
    if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) return;
    const clause = node.importClause;
    const isEntirelyTypeOnly = !!clause?.isTypeOnly ||
      (!!clause?.namedBindings && ts.isNamedImports(clause.namedBindings) &&
        !clause.name && clause.namedBindings.elements.length > 0 &&
        clause.namedBindings.elements.every((element) => element.isTypeOnly));
    if (isEntirelyTypeOnly) return;
    const specifier = node.moduleSpecifier.text;
    const target = resolveLocal(file, specifier);
    records.push({ node, specifier, target });
    if (target) next.add(target);
  });
  edges.set(file, next);
  imports.set(file, records);
}

const workerEntry = path.resolve(srcRoot, "app/entry.ts");
const reachable = new Set();
const queue = sourceFiles.has(workerEntry) ? [workerEntry] : [];
while (queue.length) {
  const file = queue.shift();
  if (reachable.has(file)) continue;
  reachable.add(file);
  for (const next of edges.get(file) || []) if (!reachable.has(next)) queue.push(next);
}

for (const [file, sf] of sourceFiles) {
  const isRuntimeReachable = reachable.has(file);
  const isRuntime = isWorkerRelevant(file) && !isPublishing(file);
  const seenKvOperations = new Map();

  for (const item of imports.get(file) || []) {
    if (!isRuntimeReachable) continue;
    if (item.target && isPublishing(item.target)) {
      add(findings, "WORKER_IMPORTS_PUBLISHING_TOOLING", sf, item.node, item.specifier);
    }
    if (/^(?:node:|(?:fs|path|child_process|process|util|crypto|os|stream|net|tls|worker_threads)(?:\/|$))/.test(item.specifier)) {
      add(observations, "NODE_API_IN_WORKER_GRAPH_REVIEW", sf, item.node, item.specifier);
    }
  }

  const visit = (node) => {
    if (ts.isCallExpression(node)) {
      const name = expressionName(node.expression, sf);
      if (/\.(?:get|put|delete|list)$/.test(name) && /(?:^|\.)(?:CONTENT_KV|PHOTO_KV|kv|namespace)(?:\.|$)/i.test(name)) {
        count("Direct KV operation signals");
        add(observations, "KV_OPERATION_INVENTORY", sf, node, preview(node, sf));
        const operation = name.split(".").at(-1);
        const literal = node.arguments[0];
        if (isRuntime && operation === "get" && literal && ts.isStringLiteralLike(literal)) {
          const scope = (() => {
            let parent = node.parent;
            while (parent && !ts.isFunctionLike(parent)) parent = parent.parent;
            return parent || sf;
          })();
          const key = `${scope.pos}:${name}:${literal.text}`;
          const earlier = seenKvOperations.get(key);
          if (earlier) add(observations, "REPEATED_LITERAL_KV_GET_REVIEW", sf, node, `${name}(${JSON.stringify(literal.text)}); prior occurrence ${earlier}`);
          else seenKvOperations.set(key, sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1);
        }
      }
      if (/^(?:caches\.default\.(?:match|put|delete)|cache\.(?:match|put|delete))$/.test(name)) {
        count("Cache API operation signals");
        add(observations, "CACHE_OPERATION_INVENTORY", sf, node, preview(node, sf));
      }
      if (callIs(node, sf, "fetch") && isRuntime) {
        count("Runtime fetch calls");
        add(observations, "RUNTIME_FETCH_INVENTORY", sf, node, preview(node, sf));
      }
      if (callIs(node, sf, "renderToString") || callIs(node, sf, "renderToReadableStream")) {
        count("SSR calls");
        add(observations, "SSR_ENTRY_INVENTORY", sf, node, preview(node, sf));
      }
      if (isRendering(file) && /(?:\.sort|JSON\.stringify|JSON\.parse|Object\.entries|Object\.keys|\.map|\.filter|\.reduce)$/.test(name)) {
        count("Render transformation signals");
        if (inLoop(node)) add(observations, "RENDER_TRANSFORM_IN_LOOP_REVIEW", sf, node, preview(node, sf));
      }
      if (isRuntime && inLoop(node) && /(?:\.get|\.put)$/.test(name) && /(?:kv|CONTENT_KV|PHOTO_KV)/i.test(name)) {
        add(observations, "KV_IN_LOOP_REVIEW", sf, node, preview(node, sf));
      }
    }
    if (ts.isNewExpression(node) && node.expression.getText(sf) === "URL" && isRuntime) {
      count("Runtime URL constructions");
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

// Sort stable to keep reports reviewable across runs.
const sortItems = (items) => items.sort((a, b) => a.file.localeCompare(b.file) ||
  a.line - b.line || a.column - b.column || a.category.localeCompare(b.category));
sortItems(findings);
sortItems(observations);
const histogram = (items) => {
  const result = new Map();
  for (const item of items) result.set(item.category, (result.get(item.category) || 0) + 1);
  return [...result].sort(([a], [b]) => a.localeCompare(b));
};
const lines = [
  "=== H08 PERFORMANCE AND WORKER RUNTIME HYGIENE AUDIT ===",
  "",
  "Scope: src/ non-test, non-declaration TypeScript modules",
  `Modules inspected: ${sourceFiles.size}`,
  `Worker entry: ${sourceFiles.has(workerEntry) ? relative(workerEntry) : "NOT FOUND"}`,
  `Value-import reachable modules from entry: ${reachable.size}`,
  "Mode: read-only static baseline; not a performance benchmark or compliance verdict",
  "",
  "=== REQUEST-PATH INVENTORY ===",
  ...[...counts].sort(([a], [b]) => a.localeCompare(b)).map(([name, amount]) => `${name}: ${amount}`),
  "",
  "=== STATIC CANDIDATES ===",
  `Candidates: ${findings.length}`,
  ...histogram(findings).map(([category, amount]) => `${category}: ${amount}`),
  "",
  ...findings.map((item) => `[${item.category}] ${item.file}:${item.line}:${item.column} (id: ${item.id})\n  ${item.detail}`),
  "",
  "=== REVIEW OBSERVATIONS ===",
  `Observations: ${observations.length}`,
  ...histogram(observations).map(([category, amount]) => `${category}: ${amount}`),
  "",
  ...observations.map((item) => `[${item.category}] ${item.file}:${item.line}:${item.column} (id: ${item.id})\n  ${item.detail}`),
  "",
  "=== TARGETED MANUAL REVIEW ===",
  "[ ] Trace one homepage request and one journal request; count KV reads by key and check for duplicate retrieval",
  "[ ] Check whether AppInit construction, registries and content transformation repeat unnecessarily per request",
  "[ ] Confirm no direct KV access or async I/O inside ARC and React SSR",
  "[ ] Confirm photo metadata retrieval strategy is proportionate to visible photos (no accidental duplicate reads)",
  "[ ] Review public HTML/XML caching policy and KV freshness expectations, including publishing propagation",
  "[ ] Review media cache key dimensions: photo ID, size, format, origin, query normalisation",
  "[ ] Verify best-effort cache failures do not fail normal media delivery; errors are not cached accidentally",
  "[ ] Confirm runtime bundle excludes CLI, Node-only dependencies and authored-content fixtures",
  "[ ] Inspect output bundle/build configuration and size using actual build tooling; AST import graph is only a proxy",
  "[ ] Identify performance work only where request traces, bundle evidence or correctness risk justify it",
  "",
  "=== LIMITATIONS ===",
  "Static scanner does not measure CPU, latency, KV billing, cold starts, bundle bytes or production cache hit rate.",
  "Import graph tracks static relative value imports only; aliases, re-exports, require() and dynamic imports may evade it.",
  "Node builtins in Workers may be polyfilled or supported under configured compatibility flags: review, do not auto-fail.",
  "KV call detection is syntax-based and misses aliases/wrappers; duplicate calls are flagged only for obvious literal keys.",
  "Cache and transformation inventories are evidence to inspect, not proof of inefficiency.",
  "No application source files were changed.",
  "",
  "BASELINE: Review observations and actual request/build paths before H08 pass/fail.",
  "",
];
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, lines.join("\n"));
console.log(lines.slice(0, lines.indexOf("=== TARGETED MANUAL REVIEW ===")).filter((line) => !line.startsWith("[")).slice(0, 45).join("\n"));
console.log(`Report: ${relative(reportPath)}`);
