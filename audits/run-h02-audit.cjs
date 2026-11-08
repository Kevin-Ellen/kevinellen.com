// audits/run-h02-audit.cjs

const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".cjs", ".mjs"]);

const excludedDirectories = new Set([
  ".git",
  ".next",
  ".terraform",
  ".wrangler",
  "build",
  "coverage",
  "dist",
  "node_modules",
]);

const excludedPaths = new Set([
  "authored-content/uploaded",
  "src/app/assets/scripts/generated",
]);

const excludedFiles = new Set(["worker-configuration.d.ts"]);

const filepathHeader = /^\s*\/\/\s*(?:\.?\.?\/)?(?:[\w.-]+\/)*[\w.-]+\.(?:ts|tsx|js|jsx|cjs|mjs)\s*$/;

const isExcludedPath = (relativePath) =>
  [...excludedPaths].some(
    (excluded) =>
      relativePath === excluded || relativePath.startsWith(`${excluded}/`),
  );

const isGeneratedFile = (relativePath) =>
  /\.generated\.(?:ts|tsx|js|jsx|cjs|mjs)$/.test(relativePath);

const findings = [];
let inspected = 0;
let excluded = 0;

const inspect = (absolutePath, relativePath) => {
  const content = fs.readFileSync(absolutePath, "utf8").replace(/^\uFEFF/, "");
  const lines = content.split(/\r?\n/);
  const expected = `// ${relativePath}`;
  const actual = lines[0] ?? "";

  inspected += 1;

  if (actual !== expected) {
    findings.push({
      category: "MISSING_OR_INCORRECT_HEADER",
      file: relativePath,
      detail: `Actual: ${actual || "(empty)"}\n  Expected: ${expected}`,
    });
  }

  const duplicateLines = [];
  for (let index = 1; index < lines.length; index += 1) {
    if (filepathHeader.test(lines[index])) {
      duplicateLines.push(index + 1);
    }
  }

  if (duplicateLines.length > 0) {
    findings.push({
      category: "DUPLICATE_FILEPATH_HEADER",
      file: relativePath,
      detail: `Additional filepath comments on lines: ${duplicateLines.join(", ")}`,
    });
  }
};

const walk = (directory) => {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = path.relative(root, absolutePath).split(path.sep).join("/");

    if (entry.isDirectory()) {
      if (excludedDirectories.has(entry.name) || isExcludedPath(relativePath)) {
        continue;
      }
      walk(absolutePath);
      continue;
    }

    if (!entry.isFile() || !extensions.has(path.extname(entry.name))) {
      continue;
    }

    if (
      isExcludedPath(relativePath) ||
      excludedFiles.has(relativePath) ||
      isGeneratedFile(relativePath)
    ) {
      excluded += 1;
      continue;
    }

    inspect(absolutePath, relativePath);
  }
};

walk(root);
findings.sort((a, b) => a.file.localeCompare(b.file) || a.category.localeCompare(b.category));

const categoryCounts = new Map();
for (const finding of findings) {
  categoryCounts.set(finding.category, (categoryCounts.get(finding.category) ?? 0) + 1);
}

const output = [
  "=== H02 FILEPATH HEADER AUDIT ===",
  "",
  `Files inspected: ${inspected}`,
  `Files explicitly excluded: ${excluded}`,
  `Findings: ${findings.length}`,
  "",
  "=== FINDING COUNTS ===",
  ...[...categoryCounts].map(([category, count]) => `${category}: ${count}`),
  "",
  "=== FINDINGS ===",
  ...findings.flatMap(({ category, file, detail }) => [
    `[${category}]`,
    `  File: ${file}`,
    `  ${detail}`,
    "",
  ]),
  findings.length === 0
    ? "PASS: All non-generated filepath headers match their locations."
    : "FAIL: Filepath header inconsistencies detected.",
];

const reportPath = path.join(root, "audits", "H02-filepath-audit.txt");
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${output.join("\n")}\n`, "utf8");
console.log(output.join("\n"));

if (findings.length > 0) process.exitCode = 1;
