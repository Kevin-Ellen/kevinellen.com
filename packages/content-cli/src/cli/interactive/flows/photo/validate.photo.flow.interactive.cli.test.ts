// tests/src/cli/interactive/flows/photo/validate.photo.flow.interactive.cli.test.ts

import { runPhotoValidateFlow } from "@content-cli/cli/interactive/flows/photo/validate.photo.flow.interactive.cli";
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

describe("runPhotoValidateFlow", () => {
  const mockState = { env: "dev" } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("cancels if workspaceId input is cancelled", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("workspace-id");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(true);

    await runPhotoValidateFlow(mockState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("cancels if workspaceId is empty after trim", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("   ");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(false);

    await runPhotoValidateFlow(mockState);

    expect(cancel).toHaveBeenCalledWith(
      "Photo validate requires a workspace ID.",
    );
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("calls runInteractiveContentCommand with valid slug", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce(" my-workspace ");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(false);

    await runPhotoValidateFlow(mockState);

    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "photo",
      action: "validate",
      slug: "my-workspace",
    });
  });
});
