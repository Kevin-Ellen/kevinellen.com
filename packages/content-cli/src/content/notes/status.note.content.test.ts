// packages/content-cli/src/content/notes/status.note.content.test.ts

import { runStatusNoteCommand } from "@content-cli/content/notes/status.note.content";
import { getNoteWorkspaceStatus } from "@content-cli/content/notes/workspace.status.note.content";

jest.mock("@content-cli/content/notes/workspace.status.note.content", () => ({
  getNoteWorkspaceStatus: jest.fn(),
}));

describe("runStatusNoteCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("prints note workspace status", async () => {
    jest.mocked(getNoteWorkspaceStatus).mockResolvedValue([
      {
        bucket: "drafts",
        env: "dev",
        path: "/drafts",
        count: 2,
        workspaceIds: ["a-note", "b-note"],
      },
      {
        bucket: "edits",
        env: "dev",
        path: "/edits",
        count: 0,
        workspaceIds: [],
      },
    ]);

    const result = await runStatusNoteCommand({
      mode: "direct",
      env: "dev",
      entity: "note",
      action: "status",
      bucket: "drafts",
    });

    expect(getNoteWorkspaceStatus).toHaveBeenCalledWith("dev");
    expect(result).toEqual({ ok: true });
  });
});
