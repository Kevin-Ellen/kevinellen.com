// packages/content-cli/src/content/photo/workspace.status.photo.content.test.ts

import fs from "node:fs/promises";
import type { Dirent } from "node:fs";

import { getPhotoWorkspaceStatus } from "@content-cli/content/photo/workspace.status.photo.content";

jest.mock("node:fs/promises");

const mockedFs = fs as jest.Mocked<typeof fs>;

const createDirent = (name: string, isDirectory = true) =>
  ({
    name,
    isDirectory: () => isDirectory,
  }) as Dirent;

describe("getPhotoWorkspaceStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns workspace status for all buckets", async () => {
    mockedFs.readdir
      .mockResolvedValueOnce([
        createDirent("birds"),
        createDirent("mallorca"),
      ] as any)
      .mockResolvedValueOnce([createDirent("editing")] as any)
      .mockResolvedValueOnce([] as any);

    const result = await getPhotoWorkspaceStatus("dev");

    expect(result).toEqual([
      {
        bucket: "drafts",
        env: "dev",
        path: expect.stringContaining("drafts"),
        count: 2,
        workspaceIds: ["birds", "mallorca"],
      },
      {
        bucket: "edits",
        env: "dev",
        path: expect.stringContaining("edits"),
        count: 1,
        workspaceIds: ["editing"],
      },
      {
        bucket: "uploaded",
        env: "dev",
        path: expect.stringContaining("uploaded"),
        count: 0,
        workspaceIds: [],
      },
    ]);
  });

  it("filters out non-directory entries", async () => {
    mockedFs.readdir
      .mockResolvedValueOnce([
        createDirent("birds"),
        createDirent("notes.txt", false),
      ] as any)
      .mockResolvedValueOnce([] as any)
      .mockResolvedValueOnce([] as any);

    const result = await getPhotoWorkspaceStatus("dev");

    expect(result[0].workspaceIds).toEqual(["birds"]);
  });

  it("sorts workspace ids alphabetically", async () => {
    mockedFs.readdir
      .mockResolvedValueOnce([
        createDirent("zebra"),
        createDirent("alpha"),
        createDirent("mountain"),
      ] as any)
      .mockResolvedValueOnce([] as any)
      .mockResolvedValueOnce([] as any);

    const result = await getPhotoWorkspaceStatus("dev");

    expect(result[0].workspaceIds).toEqual(["alpha", "mountain", "zebra"]);
  });

  it("returns empty arrays when directories do not exist", async () => {
    mockedFs.readdir.mockRejectedValue(new Error("missing"));

    const result = await getPhotoWorkspaceStatus("dev");

    expect(result).toEqual([
      {
        bucket: "drafts",
        env: "dev",
        path: expect.any(String),
        count: 0,
        workspaceIds: [],
      },
      {
        bucket: "edits",
        env: "dev",
        path: expect.any(String),
        count: 0,
        workspaceIds: [],
      },
      {
        bucket: "uploaded",
        env: "dev",
        path: expect.any(String),
        count: 0,
        workspaceIds: [],
      },
    ]);
  });
});
