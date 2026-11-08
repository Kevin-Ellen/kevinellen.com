// scripts/build/update-compatibility.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { parse, modify, applyEdits } from "jsonc-parser";

const packagePath = "package.json";
const wranglerPath = "wrangler.jsonc";

const packageSource = readFileSync(packagePath, "utf8");
const wranglerSource = readFileSync(wranglerPath, "utf8");

const packageConfig = JSON.parse(packageSource);
const wranglerConfig = parse(wranglerSource);

const latest = new Date().toISOString().slice(0, 10);
const current = packageConfig["cf-config"]["compatibility-date"];

if (current !== latest) {
  const updatedPackage = packageSource.replace(
    /("compatibility-date"\s*:\s*")[^"]+(")/,
    `$1${latest}$2`,
  );

  writeFileSync(packagePath, updatedPackage);
  console.log(`Compatibility date updated: ${current} → ${latest}`);
}

if (wranglerConfig.compatibility_date !== latest) {
  const edits = modify(
    wranglerSource,
    ["compatibility_date"],
    latest,
    {},
  );

  writeFileSync(wranglerPath, applyEdits(wranglerSource, edits));
  console.log(`Wrangler compatibility date synchronized: ${latest}`);
}
