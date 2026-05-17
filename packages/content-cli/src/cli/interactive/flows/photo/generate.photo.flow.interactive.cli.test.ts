// tests/src/cli/interactive/flows/photo/generate.photo.flow.interactive.cli.test.ts

import { runPhotoGenerateFlow } from "@content-cli/cli/interactive/flows/photo/generate.photo.flow.interactive.cli";
import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";
import { cancel, isCancel, text } from "@clack/prompts";

jest.mock("@clack/prompts", () => ({
  cancel: jest.fn(),
  isCancel: jest.fn(),
  text: jest.fn(),
}));

jest.mock("@content-cli/cli/interactive/command.interactive.cli", () => ({
  runInteractiveContentCommand: jest.fn(),
}));

describe("runPhotoGenerateFlow", () => {
  const mockState = { env: "dev" } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("cancels if text input is cancelled", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("workspace-id");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(true);

    await runPhotoGenerateFlow(mockState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("cancels if workspaceId is empty after trim", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("   ");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(false);

    await runPhotoGenerateFlow(mockState);

    expect(cancel).toHaveBeenCalledWith(
      "Photo generate requires a workspace ID.",
    );
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("calls runInteractiveContentCommand with valid photoId", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce(" my-workspace ");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(false);

    await runPhotoGenerateFlow(mockState);

    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "photo",
      action: "generate",
      photoId: "my-workspace",
    });
  });
});
