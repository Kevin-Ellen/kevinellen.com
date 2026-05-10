// tests/src/cli/interactive/flows/photo/homepage-strip-rebuild.photo.flow.interactive.cli.test.ts

import { runPhotoHomepageStripRebuildFlow } from "@content-cli/cli/interactive/flows/photo/homepage-strip-rebuild.photo.flow.interactive.cli";
import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";
import { confirm, isCancel, cancel } from "@clack/prompts";

jest.mock("@clack/prompts", () => ({
  confirm: jest.fn(),
  isCancel: jest.fn(),
  cancel: jest.fn(),
}));

jest.mock("@content-cli/cli/interactive/command.interactive.cli", () => ({
  runInteractiveContentCommand: jest.fn(),
}));

describe("runPhotoHomepageStripRebuildFlow", () => {
  const mockState = { env: "prod" } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("cancels if confirm is cancelled", async () => {
    (confirm as unknown as jest.Mock).mockResolvedValueOnce(true);
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(true);

    await runPhotoHomepageStripRebuildFlow(mockState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("does nothing if user declines", async () => {
    (confirm as unknown as jest.Mock).mockResolvedValueOnce(false);
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(false);

    await runPhotoHomepageStripRebuildFlow(mockState);

    expect(cancel).not.toHaveBeenCalled();
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("runs homepageStripRebuild if user confirms", async () => {
    (confirm as unknown as jest.Mock).mockResolvedValueOnce(true);
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(false);

    await runPhotoHomepageStripRebuildFlow(mockState);

    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "prod",
      entity: "photo",
      action: "homepageStripRebuild",
    });
  });
});
