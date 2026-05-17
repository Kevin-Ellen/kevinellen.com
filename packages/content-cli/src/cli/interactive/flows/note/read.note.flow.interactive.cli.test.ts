// packages/content-cli/src/cli/interactive/flows/note/read.note.flow.interactive.cli.test.ts

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

import { cancel, isCancel, text } from "@clack/prompts";

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";
import { safeRunInteractiveStep } from "@content-cli/cli/interactive/safe-run.interactive.cli";
import { runNoteReadFlow } from "@content-cli/cli/interactive/flows/note/read.note.flow.interactive.cli";

jest.mock("@content-cli/cli/interactive/command.interactive.cli", () => ({
  runInteractiveContentCommand: jest.fn(),
}));

jest.mock("@content-cli/cli/interactive/safe-run.interactive.cli", () => ({
  safeRunInteractiveStep: jest.fn(),
}));

jest.mock("@clack/prompts", () => ({
  cancel: jest.fn(),
  isCancel: jest.fn(),
  text: jest.fn(),
}));

describe("runNoteReadFlow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (isCancel as unknown as jest.Mock).mockReturnValue(false);
    (safeRunInteractiveStep as jest.Mock).mockImplementation(
      async (_label: string, callback: () => Promise<void>) => callback(),
    );
  });

  it("runs note read inside a safe step", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("my-note");

    await runNoteReadFlow({ env: "dev" } as InteractiveCliState);

    expect(safeRunInteractiveStep).toHaveBeenCalledWith(
      "Note read",
      expect.any(Function),
    );

    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "note",
      action: "read",
      slug: "my-note",
    });
  });

  it("handles cancelled input", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("my-note");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(true);

    await runNoteReadFlow({ env: "dev" } as InteractiveCliState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
    expect(safeRunInteractiveStep).not.toHaveBeenCalled();
  });
});
