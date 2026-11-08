// src/tools/authored-content-generator/prepare/import-photo-draft.journal.prepare.test.ts

import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

import { importPhotoDraft } from "./import-photo-draft.journal.prepare";

describe("Journal photo draft importer", () => {
  let temporaryDirectory: string;

  beforeAll(async () => {
    temporaryDirectory = await mkdtemp(resolve(tmpdir(), "photo-draft-test-"));
  });

  afterAll(async () => {
    await rm(temporaryDirectory, {
      recursive: true,
      force: true,
    });
  });

  it("imports the photo exported by a draft module", async () => {
    const filePath = resolve(temporaryDirectory, "epping-forest-fox.ts");

    await writeFile(
      filePath,
      [
        "export const photo = {",
        '  id: "epping-forest-fox",',
        '  sourceFileName: "epping-forest-fox.jpg",',
        "};",
      ].join("\n"),
      "utf8",
    );

    const result = await importPhotoDraft(filePath);

    expect(result).toEqual({
      id: "epping-forest-fox",
      sourceFileName: "epping-forest-fox.jpg",
    });
  });

  it.each([
    ["missing photo export", "export const other = {};"],
    ["null photo export", "export const photo = null;"],
    ["undefined photo export", "export const photo = undefined;"],
    ["string photo export", 'export const photo = "invalid";'],
    ["array photo export", "export const photo = [];"],
  ])("rejects %s", async (scenario, moduleSource) => {
    const filePath = resolve(
      temporaryDirectory,
      `invalid-${scenario.replace(/\s+/g, "-")}.ts`,
    );

    await writeFile(filePath, moduleSource, "utf8");

    await expect(importPhotoDraft(filePath)).rejects.toThrow(
      `Invalid photo draft module: ${filePath}`,
    );
  });

  it("propagates dynamic import failures", async () => {
    const filePath = resolve(temporaryDirectory, "missing-photo-draft.ts");

    await expect(importPhotoDraft(filePath)).rejects.toThrow();
  });
});
