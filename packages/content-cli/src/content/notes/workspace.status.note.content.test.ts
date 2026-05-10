// packages/content-cli/src/content/notes/workspace.status.note.content.test.ts

import fs from "node:fs/promises";
import path from "node:path";

import { getNoteWorkspaceStatus } from "@content-cli/content/notes/workspace.status.note.content";
import { NOTE_WORKSPACE_ROOT } from "@content-cli/config/paths.config.content-cli";

jest.mock("node:fs/promises", () => ({
  readdir: jest.fn(),
}));

describe("getNoteWorkspaceStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns workspace status for all buckets", async () => {
    jest.mocked(fs.readdir).mockResolvedValue([
      { name: "b-note", isDirectory: () => true },
      { name: "file.txt", isDirectory: () => false },
      { name: "a-note", isDirectory: () => true },
    ] as never);

    const result = await getNoteWorkspaceStatus("dev");

    expect(result).toEqual([
      {
        bucket: "drafts",
        env: "dev",
        path: path.join(NOTE_WORKSPACE_ROOT, "drafts", "dev"),
        count: 2,
        workspaceIds: ["a-note", "b-note"],
      },
      {
        bucket: "edits",
        env: "dev",
        path: path.join(NOTE_WORKSPACE_ROOT, "edits", "dev"),
        count: 2,
        workspaceIds: ["a-note", "b-note"],
      },
      {
        bucket: "uploaded",
        env: "dev",
        path: path.join(NOTE_WORKSPACE_ROOT, "uploaded", "dev"),
        count: 2,
        workspaceIds: ["a-note", "b-note"],
      },
    ]);
  });

  it("returns empty workspace IDs when a bucket cannot be read", async () => {
    jest.mocked(fs.readdir).mockRejectedValue(new Error("missing"));

    const result = await getNoteWorkspaceStatus("dev");

    expect(result).toEqual([
      {
        bucket: "drafts",
        env: "dev",
        path: path.join(NOTE_WORKSPACE_ROOT, "drafts", "dev"),
        count: 0,
        workspaceIds: [],
      },
      {
        bucket: "edits",
        env: "dev",
        path: path.join(NOTE_WORKSPACE_ROOT, "edits", "dev"),
        count: 0,
        workspaceIds: [],
      },
      {
        bucket: "uploaded",
        env: "dev",
        path: path.join(NOTE_WORKSPACE_ROOT, "uploaded", "dev"),
        count: 0,
        workspaceIds: [],
      },
    ]);
  });
});
