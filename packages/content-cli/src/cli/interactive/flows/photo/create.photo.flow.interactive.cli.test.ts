// tests/src/cli/interactive/flows/photo/create.photo.flow.interactive.cli.test.ts

import { runPhotoCreateFlow } from "@content-cli/cli/interactive/flows/photo/create.photo.flow.interactive.cli";
import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";
import { cancel, isCancel, select, spinner } from "@clack/prompts";

jest.mock("@clack/prompts", () => ({
  cancel: jest.fn(),
  isCancel: jest.fn(),
  select: jest.fn(),
  spinner: jest.fn(),
}));

jest.mock("@content-cli/cli/interactive/command.interactive.cli", () => ({
  runInteractiveContentCommand: jest.fn(),
}));

describe("runPhotoCreateFlow", () => {
  const mockState = { env: "dev" } as any;

  const mockSpinnerStart = jest.fn();
  const mockSpinnerStop = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (spinner as unknown as jest.Mock).mockReturnValue({
      start: mockSpinnerStart,
      stop: mockSpinnerStop,
    });
  });

  it("runs creation and stops spinner", async () => {
    (select as unknown as jest.Mock).mockResolvedValue("back");
    (isCancel as unknown as jest.Mock).mockReturnValue(false);

    await runPhotoCreateFlow(mockState);

    expect(mockSpinnerStart).toHaveBeenCalledWith("Creating photo workspace");
    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "photo",
      action: "create",
    });
    expect(mockSpinnerStop).toHaveBeenCalledWith("✅ Photo workspace created");
  });

  it("handles cancel after select", async () => {
    (select as unknown as jest.Mock).mockResolvedValue("back");
    (isCancel as unknown as jest.Mock).mockReturnValue(true);

    await runPhotoCreateFlow(mockState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
  });

  it("runs generate if selected", async () => {
    (select as unknown as jest.Mock).mockResolvedValue("generate");
    (isCancel as unknown as jest.Mock).mockReturnValue(false);

    await runPhotoCreateFlow(mockState);

    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "photo",
      action: "generate",
    });
  });

  it("exits if exit is selected", async () => {
    (select as unknown as jest.Mock).mockResolvedValue("exit");
    (isCancel as unknown as jest.Mock).mockReturnValue(false);

    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    await expect(runPhotoCreateFlow(mockState)).rejects.toThrow(
      "process.exit called",
    );

    mockExit.mockRestore();
  });
});
