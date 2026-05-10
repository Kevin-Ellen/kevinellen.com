// tests/src/cli/interactive/flows/journal/create.journal.flow.interactive.cli.test.ts

import { runJournalCreateFlow } from "@content-cli/cli/interactive/flows/journal/create.journal.flow.interactive.cli";
import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";
import { safeRunInteractiveStep } from "@content-cli/cli/interactive/safe-run.interactive.cli";
import { spinner, select, isCancel, cancel, note } from "@clack/prompts";
import { isJournalCreateCommandResult } from "@content-cli/cli/interactive/results.interactive.cli";

jest.mock("@content-cli/cli/interactive/command.interactive.cli");
jest.mock("@content-cli/cli/interactive/safe-run.interactive.cli");
jest.mock("@content-cli/cli/interactive/results.interactive.cli");

jest.mock("@clack/prompts", () => ({
  cancel: jest.fn(),
  isCancel: jest.fn(),
  note: jest.fn(),
  select: jest.fn(),
  spinner: jest.fn().mockReturnValue({
    start: jest.fn(),
    stop: jest.fn(),
  }),
}));

describe("runJournalCreateFlow", () => {
  const mockState = { env: "dev" } as any;

  const mockSpinnerStart = jest.fn();
  const mockSpinnerStop = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (spinner as jest.Mock).mockReturnValue({
      start: mockSpinnerStart,
      stop: mockSpinnerStop,
    });
  });

  it("stops spinner and returns early if creation fails", async () => {
    (safeRunInteractiveStep as jest.Mock).mockResolvedValue(false);

    await runJournalCreateFlow(mockState);

    expect(mockSpinnerStart).toHaveBeenCalledWith("Creating journal workspace");
    expect(mockSpinnerStop).toHaveBeenCalledWith("⚠ Journal create failed");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("shows note if result is not a journal create result", async () => {
    (safeRunInteractiveStep as jest.Mock).mockImplementation(
      async (name, fn) => {
        await fn();
        return true;
      },
    );
    (runInteractiveContentCommand as jest.Mock).mockResolvedValue({ ok: true });
    (isJournalCreateCommandResult as unknown as jest.Mock).mockReturnValue(
      false,
    );

    await runJournalCreateFlow(mockState);

    expect(note).toHaveBeenCalledWith(
      "Journal workspace was created, but no workspace ID was returned.",
      "⚠ Missing result data",
    );
  });

  it("runs generate step when user selects generate", async () => {
    (safeRunInteractiveStep as jest.Mock).mockImplementation(
      async (name, fn) => {
        await fn();
        return true;
      },
    );
    (runInteractiveContentCommand as jest.Mock).mockResolvedValue({
      workspaceId: "abc123",
    });
    (isJournalCreateCommandResult as unknown as jest.Mock).mockReturnValue(
      true,
    );
    (select as jest.Mock).mockResolvedValue("generate");

    await runJournalCreateFlow(mockState);

    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "journal",
      action: "generate",
      slug: "abc123",
    });
  });

  it("exits process when user selects exit", async () => {
    (safeRunInteractiveStep as jest.Mock).mockImplementation(
      async (name, fn) => {
        await fn();
        return true;
      },
    );
    (runInteractiveContentCommand as jest.Mock).mockResolvedValue({
      workspaceId: "abc123",
    });
    (isJournalCreateCommandResult as unknown as jest.Mock).mockReturnValue(
      true,
    );
    (select as jest.Mock).mockResolvedValue("exit");

    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    await expect(runJournalCreateFlow(mockState)).rejects.toThrow(
      "process.exit called",
    );

    mockExit.mockRestore();
  });

  it("handles cancel selection", async () => {
    (safeRunInteractiveStep as jest.Mock).mockImplementation(
      async (name, fn) => {
        await fn();
        return true;
      },
    );
    (runInteractiveContentCommand as jest.Mock).mockResolvedValue({
      workspaceId: "abc123",
    });
    (isJournalCreateCommandResult as unknown as jest.Mock).mockReturnValue(
      true,
    );
    (select as jest.Mock).mockResolvedValue("back");
    (isCancel as unknown as jest.Mock).mockReturnValue(true);

    await runJournalCreateFlow(mockState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
  });
});
