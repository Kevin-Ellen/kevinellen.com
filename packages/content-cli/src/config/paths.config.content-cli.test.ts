// packages/content-cli/src/config/paths.config.content-cli.test.ts

import path from "node:path";
import {
  CONTENT_WORKSPACE_ROOT,
  JOURNAL_WORKSPACE_ROOT,
  PHOTO_WORKSPACE_ROOT,
} from "@content-cli/config/paths.config.content-cli";

describe("paths.config.content-cli", () => {
  it("defines CONTENT_WORKSPACE_ROOT correctly", () => {
    expect(CONTENT_WORKSPACE_ROOT).toBe(
      path.resolve(process.cwd(), "content-pipeline"),
    );
  });

  it("defines JOURNAL_WORKSPACE_ROOT correctly", () => {
    expect(JOURNAL_WORKSPACE_ROOT).toBe(
      path.join(CONTENT_WORKSPACE_ROOT, "journal"),
    );
  });

  it("defines PHOTO_WORKSPACE_ROOT correctly", () => {
    expect(PHOTO_WORKSPACE_ROOT).toBe(
      path.join(CONTENT_WORKSPACE_ROOT, "photo"),
    );
  });
});
