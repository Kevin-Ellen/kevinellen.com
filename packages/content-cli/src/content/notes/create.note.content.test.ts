// packages/content-cli/src/content/notes/create.note.content.test.ts

import fs from "node:fs/promises";

import { runCreateNoteCommand } from "@content-cli/content/notes/create.note.content";
import { getNoteWorkspacePath } from "@content-cli/content/notes/path.note.content";
import { formatLocalDateTimeWithOffset } from "@content-cli/utils/format.local.date.time.with.offset.util";

jest.mock("node:fs/promises", () => ({
  mkdir: jest.fn(),
}));

jest.mock("@content-cli/content/notes/path.note.content", () => ({
  getNoteWorkspacePath: jest.fn(),
}));

jest.mock("@content-cli/utils/format.local.date.time.with.offset.util", () => ({
  formatLocalDateTimeWithOffset: jest.fn(),
}));

describe("runCreateNoteCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest
      .mocked(formatLocalDateTimeWithOffset)
      .mockReturnValue("2026-05-10T23:03:37+01:00");

    jest
      .mocked(getNoteWorkspacePath)
      .mockReturnValue("/workspace/note/drafts/dev/workspace-id");
  });

  it("creates a note draft workspace using the provided slug", async () => {
    const result = await runCreateNoteCommand({
      mode: "direct",
      env: "dev",
      entity: "note",
      action: "create",
      bucket: "drafts",
      slug: "my-note",
    });

    expect(getNoteWorkspacePath).toHaveBeenCalledWith(
      "dev",
      "drafts",
      "my-note",
    );

    expect(fs.mkdir).toHaveBeenCalledWith(
      "/workspace/note/drafts/dev/workspace-id",
      { recursive: true },
    );

    expect(result).toEqual({
      ok: true,
      entity: "note",
      action: "create",
      workspaceId: "my-note",
      workspacePath: "/workspace/note/drafts/dev/workspace-id",
    });
  });

  it("creates a timestamp workspace ID when slug is missing", async () => {
    const result = await runCreateNoteCommand({
      mode: "direct",
      env: "dev",
      entity: "note",
      action: "create",
      bucket: "drafts",
    });

    expect(formatLocalDateTimeWithOffset).toHaveBeenCalledWith(
      expect.any(Date),
    );

    expect(getNoteWorkspacePath).toHaveBeenCalledWith(
      "dev",
      "drafts",
      "2026-05-10T23-03-37+01-00",
    );

    expect(result.workspaceId).toBe("2026-05-10T23-03-37+01-00");
  });
});
