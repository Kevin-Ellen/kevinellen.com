// tests/src/cli/interactive/flows/photo/read.photo.flow.interactive.cli.test.ts

import { runPhotoReadFlow } from "@content-cli/cli/interactive/flows/photo/read.photo.flow.interactive.cli";
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

describe("runPhotoReadFlow", () => {
  const mockState = { env: "dev" } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("cancels if input is cancelled", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("photo-id");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(true);

    await runPhotoReadFlow(mockState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("calls runInteractiveContentCommand in normal flow", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("photo-123");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(false);

    await runPhotoReadFlow(mockState);

    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "photo",
      action: "read",
      photoId: "photo-123",
    });
  });
});
