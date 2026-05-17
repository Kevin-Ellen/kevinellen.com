// tests/src/cli/interactive/flows/photo/publish.photo.flow.interactive.cli.test.ts

import { runPhotoPublishFlow } from "@content-cli/cli/interactive/flows/photo/publish.photo.flow.interactive.cli";
import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";
import { cancel, confirm, isCancel, text } from "@clack/prompts";

jest.mock("@clack/prompts", () => ({
  cancel: jest.fn(),
  isCancel: jest.fn(),
  text: jest.fn(),
  confirm: jest.fn(),
}));

jest.mock("@content-cli/cli/interactive/command.interactive.cli", () => ({
  runInteractiveContentCommand: jest.fn(),
}));

describe("runPhotoPublishFlow", () => {
  const devState = { env: "dev" } as any;
  const prodState = { env: "prod" } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("cancels if workspaceId input is cancelled", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("workspace");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(true);

    await runPhotoPublishFlow(devState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("cancels if workspaceId is empty after trim", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("   ");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(false);

    await runPhotoPublishFlow(devState);

    expect(cancel).toHaveBeenCalledWith(
      "Photo publish requires a workspace ID.",
    );
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("cancels if PROD confirmation is cancelled", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("workspace-id");
    (isCancel as unknown as jest.Mock)
      .mockReturnValueOnce(false) // workspace input not cancelled
      .mockReturnValueOnce(true); // confirm cancelled
    (confirm as unknown as jest.Mock).mockResolvedValueOnce(true);

    await runPhotoPublishFlow(prodState);

    expect(cancel).toHaveBeenCalledWith("Publish cancelled.");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("cancels if PROD confirmation declined", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("workspace-id");
    (isCancel as unknown as jest.Mock).mockReturnValue(false);
    (confirm as unknown as jest.Mock).mockResolvedValueOnce(false);

    await runPhotoPublishFlow(prodState);

    expect(cancel).toHaveBeenCalledWith("Publish cancelled.");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("runs validate and publish for non-PROD", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce(" workspace ");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(false);

    await runPhotoPublishFlow(devState);

    expect(runInteractiveContentCommand).toHaveBeenCalledTimes(2);
    expect(runInteractiveContentCommand).toHaveBeenNthCalledWith(1, {
      env: "dev",
      entity: "photo",
      action: "validate",
      photoId: "workspace",
    });
    expect(runInteractiveContentCommand).toHaveBeenNthCalledWith(2, {
      env: "dev",
      entity: "photo",
      action: "publish",
      photoId: "workspace",
    });
  });

  it("runs validate and publish for PROD when confirmed", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce(" workspace ");
    (isCancel as unknown as jest.Mock).mockReturnValue(false);
    (confirm as unknown as jest.Mock).mockResolvedValueOnce(true);

    await runPhotoPublishFlow(prodState);

    expect(runInteractiveContentCommand).toHaveBeenCalledTimes(2);
    expect(runInteractiveContentCommand).toHaveBeenNthCalledWith(1, {
      env: "prod",
      entity: "photo",
      action: "validate",
      photoId: "workspace",
    });
    expect(runInteractiveContentCommand).toHaveBeenNthCalledWith(2, {
      env: "prod",
      entity: "photo",
      action: "publish",
      photoId: "workspace",
    });
  });
});
