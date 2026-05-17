// packages/content-cli/src/content/photo/status.photo.content.test.ts

import { runStatusPhotoCommand } from "@content-cli/content/photo/status.photo.content";
import { getPhotoWorkspaceStatus } from "@content-cli/content/photo/workspace.status.photo.content";

jest.mock("@content-cli/content/photo/workspace.status.photo.content");

const mockedGetPhotoWorkspaceStatus = jest.mocked(getPhotoWorkspaceStatus);

describe("runStatusPhotoCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("prints workspace status for all buckets", async () => {
    mockedGetPhotoWorkspaceStatus.mockResolvedValue([
      {
        bucket: "drafts",
        env: "dev",
        path: "/drafts",
        count: 2,
        workspaceIds: ["robin", "owl"],
      },
      {
        bucket: "uploaded",
        env: "dev",
        path: "/uploaded",
        count: 1,
        workspaceIds: ["fox"],
      },
    ]);

    const result = await runStatusPhotoCommand({
      mode: "direct",
      env: "dev",
      entity: "photo",
      action: "status",
      bucket: "drafts",
    });

    expect(mockedGetPhotoWorkspaceStatus).toHaveBeenCalledWith("dev");

    expect(console.log).toHaveBeenCalledWith("\nPhoto status\n");

    expect(console.log).toHaveBeenCalledWith("drafts: 2");
    expect(console.log).toHaveBeenCalledWith("  • robin");
    expect(console.log).toHaveBeenCalledWith("  • owl");

    expect(console.log).toHaveBeenCalledWith("uploaded: 1");
    expect(console.log).toHaveBeenCalledWith("  • fox");

    expect(result).toEqual({ ok: true });
  });

  it("prints none when a bucket is empty", async () => {
    mockedGetPhotoWorkspaceStatus.mockResolvedValue([
      {
        bucket: "drafts",
        env: "dev",
        path: "/drafts",
        count: 0,
        workspaceIds: [],
      },
    ]);

    await runStatusPhotoCommand({
      mode: "direct",
      env: "dev",
      entity: "photo",
      action: "status",
      bucket: "drafts",
    });

    expect(console.log).toHaveBeenCalledWith("drafts: 0");
    expect(console.log).toHaveBeenCalledWith("  none");
  });
});
