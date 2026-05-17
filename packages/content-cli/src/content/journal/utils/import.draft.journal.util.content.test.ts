// packages/content-cli/src/content/journal/utils/import.draft.journal.util.content.test.ts

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { importJournalDraft } from "@content-cli/content/journal/utils/import.draft.journal.util.content";

describe("importJournalDraft", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "journal-draft-"));
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
    jest.restoreAllMocks();
  });

  it("imports the page export from a journal draft", async () => {
    const draftPath = path.join(tempDir, "journal.draft.cjs");

    await fs.writeFile(
      draftPath,
      `
        exports.page = {
          id: "journal-one",
          kind: "journal",
          slug: "/journal/journal-one",
          label: "Journal One"
        };
      `,
    );

    const result = await importJournalDraft(draftPath);

    expect(result).toEqual({
      id: "journal-one",
      kind: "journal",
      slug: "/journal/journal-one",
      label: "Journal One",
    });
  });

  it("imports using an absolute file URL with a cache-busting timestamp", async () => {
    const draftPath = path.join(tempDir, "journal.draft.cjs");

    jest.spyOn(Date, "now").mockReturnValue(123);

    await fs.writeFile(
      draftPath,
      `
      exports.page = {
        id: "journal-one",
        kind: "journal",
        slug: "/journal/one",
        label: "Journal One"
      };
    `,
    );

    const result = await importJournalDraft(draftPath);

    expect(result.id).toBe("journal-one");
  });

  it("throws when the draft does not export page", async () => {
    const draftPath = path.join(tempDir, "journal.draft.cjs");

    await fs.writeFile(
      draftPath,
      `
        exports.draft = {
          id: "not-page"
        };
      `,
    );

    await expect(importJournalDraft(draftPath)).rejects.toThrow(
      `Journal draft does not export page: ${draftPath}`,
    );
  });
});
