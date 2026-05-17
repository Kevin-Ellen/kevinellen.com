// packages/content-cli/src/content/journal/path.journal.content.test.ts

import path from "node:path";

import {
  getJournalBucketPath,
  getJournalFilePath,
  getJournalWorkspacePath,
} from "@content-cli/content/journal/path.journal.content";
import { JOURNAL_WORKSPACE_ROOT } from "@content-cli/config/paths.config.content-cli";

describe("journal paths", () => {
  it("builds the journal bucket path", () => {
    expect(getJournalBucketPath("dev", "drafts")).toBe(
      path.join(JOURNAL_WORKSPACE_ROOT, "drafts", "dev"),
    );
  });

  it("builds the journal workspace path", () => {
    expect(getJournalWorkspacePath("prod", "uploaded", "mallorca")).toBe(
      path.join(JOURNAL_WORKSPACE_ROOT, "uploaded", "prod", "mallorca"),
    );
  });

  it.each([
    ["drafts", "journal.draft.ts"],
    ["edits", "journal.edit.ts"],
    ["uploaded", "journal.uploaded.ts"],
  ] as const)("builds the %s journal file path", (bucket, fileName) => {
    expect(getJournalFilePath("dev", bucket, "rye-house")).toBe(
      path.join(JOURNAL_WORKSPACE_ROOT, bucket, "dev", "rye-house", fileName),
    );
  });
});
