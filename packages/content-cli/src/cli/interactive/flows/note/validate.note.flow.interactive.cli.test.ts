// packages/content-cli/src/cli/interactive/flows/note/validate.note.flow.interactive.cli.test.ts

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

import { cancel, isCancel, text } from "@clack/prompts";

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";
import { runNoteValidateFlow } from "@content-cli/cli/interactive/flows/note/validate.note.flow.interactive.cli";

jest.mock("@content-cli/cli/interactive/command.interactive.cli", () => ({
  runInteractiveContentCommand: jest.fn(),
}));

jest.mock("@clack/prompts", () => ({
  cancel: jest.fn(),
  isCancel: jest.fn(),
  text: jest.fn(),
}));

describe("runNoteValidateFlow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (isCancel as unknown as jest.Mock).mockReturnValue(false);
  });

  it("runs note validate for the provided slug", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("my-note");

    await runNoteValidateFlow({ env: "dev" } as InteractiveCliState);

    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "note",
      action: "validate",
      slug: "my-note",
    });
  });

  it("handles cancelled input", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("my-note");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(true);

    await runNoteValidateFlow({ env: "dev" } as InteractiveCliState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });
});
