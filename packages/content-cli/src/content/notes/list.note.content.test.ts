// packages/content-cli/src/content/notes/list.note.content.test.ts

import { runListNoteCommand } from "@content-cli/content/notes/list.note.content";
import { getNoteWorkspaceStatus } from "@content-cli/content/notes/workspace.status.note.content";

jest.mock("@content-cli/content/notes/workspace.status.note.content", () => ({
  getNoteWorkspaceStatus: jest.fn(),
}));

describe("runListNoteCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lists note workspaces for a bucket", async () => {
    jest.mocked(getNoteWorkspaceStatus).mockResolvedValue([
      {
        bucket: "drafts",
        env: "dev",
        path: "/drafts",
        count: 2,
        workspaceIds: ["a", "b"],
      },
    ]);

    const result = await runListNoteCommand({
      mode: "direct",
      env: "dev",
      entity: "note",
      action: "list",
      bucket: "drafts",
    });

    expect(result).toEqual({
      ok: true,
      entity: "note",
      action: "list",
      env: "dev",
      bucket: "drafts",
      workspaceIds: ["a", "b"],
    });
  });

  it("returns an empty list when bucket has no workspaces", async () => {
    jest.mocked(getNoteWorkspaceStatus).mockResolvedValue([
      {
        bucket: "drafts",
        env: "dev",
        path: "/drafts",
        count: 0,
        workspaceIds: [],
      },
    ]);

    const result = await runListNoteCommand({
      mode: "direct",
      env: "dev",
      entity: "note",
      action: "list",
      bucket: "drafts",
    });

    expect(result.workspaceIds).toEqual([]);
  });

  it("throws for unknown bucket", async () => {
    jest.mocked(getNoteWorkspaceStatus).mockResolvedValue([]);

    await expect(
      runListNoteCommand({
        mode: "direct",
        env: "dev",
        entity: "note",
        action: "list",
        bucket: "drafts",
      }),
    ).rejects.toThrow("Unknown note bucket: drafts");
  });
});
