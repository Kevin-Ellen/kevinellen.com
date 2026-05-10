// packages/content-cli/src/cli/interactive/flows/note/list.note.flow.interactive.cli.test.ts

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";
import { runNoteListFlow } from "@content-cli/cli/interactive/flows/note/list.note.flow.interactive.cli";

jest.mock("@content-cli/cli/interactive/command.interactive.cli", () => ({
  runInteractiveContentCommand: jest.fn(),
}));

describe("runNoteListFlow", () => {
  it("runs note list", async () => {
    await runNoteListFlow({ env: "dev" } as InteractiveCliState);

    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "note",
      action: "list",
    });
  });
});
