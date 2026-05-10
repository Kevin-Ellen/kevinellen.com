// packages/content-cli/src/content/notes/path.note.content.test.ts

import path from "node:path";

import {
  getNoteBucketPath,
  getNoteFilePath,
  getNoteWorkspacePath,
} from "@content-cli/content/notes/path.note.content";
import { NOTE_WORKSPACE_ROOT } from "@content-cli/config/paths.config.content-cli";

describe("note paths", () => {
  it("returns the note bucket path", () => {
    expect(getNoteBucketPath("dev", "drafts")).toBe(
      path.join(NOTE_WORKSPACE_ROOT, "drafts", "dev"),
    );
  });

  it("returns the note workspace path", () => {
    expect(getNoteWorkspacePath("dev", "drafts", "my-note")).toBe(
      path.join(NOTE_WORKSPACE_ROOT, "drafts", "dev", "my-note"),
    );
  });

  it.each([
    ["drafts", "note.draft.ts"],
    ["edits", "note.edit.ts"],
    ["uploaded", "note.uploaded.ts"],
  ] as const)("returns the note file path for %s", (bucket, fileName) => {
    expect(getNoteFilePath("dev", bucket, "my-note")).toBe(
      path.join(NOTE_WORKSPACE_ROOT, bucket, "dev", "my-note", fileName),
    );
  });
});
