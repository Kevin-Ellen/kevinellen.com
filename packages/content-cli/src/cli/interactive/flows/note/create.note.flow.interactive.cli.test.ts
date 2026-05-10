// packages/content-cli/src/cli/interactive/flows/note/create.note.flow.interactive.cli.test.ts

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";
import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";

import { cancel, isCancel, note, select, spinner } from "@clack/prompts";

import { runNoteCreateFlow } from "@content-cli/cli/interactive/flows/note/create.note.flow.interactive.cli";
import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";
import { isNoteCreateCommandResult } from "@content-cli/cli/interactive/results.interactive.cli";
import { safeRunInteractiveStep } from "@content-cli/cli/interactive/safe-run.interactive.cli";

jest.mock("@content-cli/cli/interactive/command.interactive.cli", () => ({
  runInteractiveContentCommand: jest.fn(),
}));

jest.mock("@content-cli/cli/interactive/results.interactive.cli", () => ({
  isNoteCreateCommandResult: jest.fn(),
}));

jest.mock("@content-cli/cli/interactive/safe-run.interactive.cli", () => ({
  safeRunInteractiveStep: jest.fn(),
}));

jest.mock("@clack/prompts", () => ({
  cancel: jest.fn(),
  isCancel: jest.fn(),
  note: jest.fn(),
  select: jest.fn(),
  spinner: jest.fn(),
}));

describe("runNoteCreateFlow", () => {
  const mockSpinner = {
    start: jest.fn(),
    stop: jest.fn(),
  };

  let mockState: InteractiveCliState;

  beforeEach(() => {
    mockState = { env: "dev" as ContentCliEnvironment };

    jest.clearAllMocks();

    (spinner as unknown as jest.Mock).mockReturnValue(mockSpinner);

    (safeRunInteractiveStep as jest.Mock).mockImplementation(
      async (_label: string, callback: () => Promise<void>) => {
        await callback();
        return true;
      },
    );

    (isCancel as unknown as jest.Mock).mockReturnValue(false);
  });

  it("creates a note workspace and generates a draft when selected", async () => {
    (runInteractiveContentCommand as jest.Mock).mockResolvedValueOnce({
      ok: true,
      entity: "note",
      action: "create",
      workspaceId: "my-note",
      workspacePath: "/tmp/note",
    });

    (isNoteCreateCommandResult as unknown as jest.Mock).mockReturnValue(true);
    (select as unknown as jest.Mock).mockResolvedValueOnce("generate");

    await runNoteCreateFlow(mockState);

    expect(mockSpinner.start).toHaveBeenCalledWith("Creating note workspace");
    expect(mockSpinner.stop).toHaveBeenCalledWith("✅ Note workspace created");

    expect(runInteractiveContentCommand).toHaveBeenNthCalledWith(1, {
      env: "dev",
      entity: "note",
      action: "create",
    });

    expect(runInteractiveContentCommand).toHaveBeenNthCalledWith(2, {
      env: "dev",
      entity: "note",
      action: "generate",
      slug: "my-note",
    });
  });

  it("stops when note creation fails", async () => {
    (safeRunInteractiveStep as jest.Mock).mockResolvedValueOnce(false);

    await runNoteCreateFlow(mockState);

    expect(mockSpinner.stop).toHaveBeenCalledWith("⚠ Note create failed");
    expect(select).not.toHaveBeenCalled();
  });

  it("shows a note when result data is missing", async () => {
    (runInteractiveContentCommand as jest.Mock).mockResolvedValueOnce({
      ok: true,
    });

    (isNoteCreateCommandResult as unknown as jest.Mock).mockReturnValue(false);

    await runNoteCreateFlow(mockState);

    expect(note).toHaveBeenCalledWith(
      "Note workspace was created, but no workspace ID was returned.",
      "⚠ Missing result data",
    );

    expect(select).not.toHaveBeenCalled();
  });

  it("handles cancelled next action", async () => {
    (runInteractiveContentCommand as jest.Mock).mockResolvedValueOnce({
      ok: true,
      entity: "note",
      action: "create",
      workspaceId: "my-note",
      workspacePath: "/tmp/note",
    });

    (isNoteCreateCommandResult as unknown as jest.Mock).mockReturnValue(true);
    (select as unknown as jest.Mock).mockResolvedValueOnce("back");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(true);

    await runNoteCreateFlow(mockState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
  });

  it("exits when selected", async () => {
    const mockExit = jest
      .spyOn(process, "exit")
      .mockImplementation((() => undefined) as never);

    (runInteractiveContentCommand as jest.Mock).mockResolvedValueOnce({
      ok: true,
      entity: "note",
      action: "create",
      workspaceId: "my-note",
      workspacePath: "/tmp/note",
    });

    (isNoteCreateCommandResult as unknown as jest.Mock).mockReturnValue(true);
    (select as unknown as jest.Mock).mockResolvedValueOnce("exit");

    await runNoteCreateFlow(mockState);

    expect(mockExit).toHaveBeenCalledWith(0);

    mockExit.mockRestore();
  });
});
