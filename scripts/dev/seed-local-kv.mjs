// scripts/dev/seed-local-kv.mjs


import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const bindings = ["CONTENT_KV", "PHOTO_KV"];

const runWrangler = (args) =>
  execFileSync("npx", ["wrangler", ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });

const runJson = (args) => JSON.parse(runWrangler(args));

const seedBinding = (binding, tempDir) => {
  console.log(`\nSeeding ${binding}...`);

  // Read the complete published remote key list.
  const remoteKeys = runJson([
    "kv",
    "key",
    "list",
    "--binding",
    binding,
    "--remote",
  ]).map(({ name }) => name);

  console.log(`Found ${remoteKeys.length} remote records.`);

  // Identify existing local records.
  const localKeys = runJson([
    "kv",
    "key",
    "list",
    "--binding",
    binding,
    "--local",
  ]).map(({ name }) => name);

  // Remove local records so the result is an exact snapshot.
  if (localKeys.length > 0) {
    const deleteFile = path.join(tempDir, `${binding}-delete.json`);

    writeFileSync(deleteFile, JSON.stringify(localKeys));

    runWrangler([
      "kv",
      "bulk",
      "delete",
      deleteFile,
      "--binding",
      binding,
      "--local",
    ]);
  }

  if (remoteKeys.length === 0) {
    console.log(`${binding}: no remote records.`);
    return;
  }

  // Download remote values.
  const keysFile = path.join(tempDir, `${binding}-keys.json`);

  writeFileSync(keysFile, JSON.stringify(remoteKeys));

  const downloaded = runJson([
    "kv",
    "bulk",
    "get",
    keysFile,
    "--binding",
    binding,
    "--remote",
  ]);

  // Convert the returned key/value object into bulk-put format.
  const records = Object.entries(downloaded).map(([key, value]) => ({
    key,
    value,
  }));

  if (records.length !== remoteKeys.length) {
    throw new Error(
      `${binding}: expected ${remoteKeys.length} records, received ${records.length}.`,
    );
  }

  const importFile = path.join(tempDir, `${binding}-import.json`);

  writeFileSync(importFile, JSON.stringify(records));

  // Import exclusively into local KV.
  runWrangler([
    "kv",
    "bulk",
    "put",
    importFile,
    "--binding",
    binding,
    "--local",
  ]);

  console.log(`Seeded ${records.length} records into local ${binding}.`);
};

const main = () => {
  const tempDir = mkdtempSync(path.join(tmpdir(), "kevinellen-kv-"));

  try {
    for (const binding of bindings) {
      seedBinding(binding, tempDir);
    }

    console.log("\nLocal KV snapshot refreshed successfully.");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
};

main();
