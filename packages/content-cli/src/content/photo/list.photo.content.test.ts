// packages/content-cli/src/content/photo/list.photo.content.test.ts

import { runListPhotoCommand } from "@content-cli/content/photo/list.photo.content";
import { getPhotoWorkspaceStatus } from "@content-cli/content/photo/workspace.status.photo.content";

import type { ParsedPhotoSimpleArgs } from "@content-cli/types/parse-args.cli.types";

jest.mock("@content-cli/content/photo/workspace.status.photo.content");

const mockedGetPhotoWorkspaceStatus = jest.mocked(getPhotoWorkspaceStatus);

const createArgs = (
  overrides: Partial<ParsedPhotoSimpleArgs> = {},
): ParsedPhotoSimpleArgs => ({
  mode: "direct",
  env: "dev",
  entity: "photo",
  action: "list",
  bucket: "drafts",
  ...overrides,
});

describe("runListPhotoCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("lists workspace ids for the selected bucket", async () => {
    mockedGetPhotoWorkspaceStatus.mockResolvedValue([
      {
        bucket: "drafts",
        env: "dev",
        path: "/drafts",
        count: 2,
        workspaceIds: ["birds", "macro"],
      },
      {
        bucket: "uploaded",
        env: "dev",
        path: "/uploaded",
        count: 0,
        workspaceIds: [],
      },
    ]);

    const result = await runListPhotoCommand(createArgs());

    expect(mockedGetPhotoWorkspaceStatus).toHaveBeenCalledWith("dev");

    expect(console.log).toHaveBeenCalledWith("\nPhoto drafts\n");
    expect(console.log).toHaveBeenCalledWith("  • birds");
    expect(console.log).toHaveBeenCalledWith("  • macro");

    expect(result).toEqual({ ok: true });
  });

  it("prints none when the bucket is empty", async () => {
    mockedGetPhotoWorkspaceStatus.mockResolvedValue([
      {
        bucket: "drafts",
        env: "dev",
        path: "/drafts",
        count: 0,
        workspaceIds: [],
      },
    ]);

    const result = await runListPhotoCommand(createArgs());

    expect(console.log).toHaveBeenCalledWith("  none\n");

    expect(result).toEqual({ ok: true });
  });

  it("throws when the bucket does not exist", async () => {
    mockedGetPhotoWorkspaceStatus.mockResolvedValue([]);

    await expect(runListPhotoCommand(createArgs())).rejects.toThrow(
      "Unknown photo bucket: drafts",
    );
  });
});
