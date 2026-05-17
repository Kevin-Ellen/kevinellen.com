// packages/content-cli/src/cli/interactive/flows/note/status.note.flow.interactive.cli.test.ts

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";
import { runNoteStatusFlow } from "@content-cli/cli/interactive/flows/note/status.note.flow.interactive.cli";

jest.mock("@content-cli/cli/interactive/command.interactive.cli", () => ({
  runInteractiveContentCommand: jest.fn(),
}));

describe("runNoteStatusFlow", () => {
  it("runs note status", async () => {
    await runNoteStatusFlow({ env: "dev" } as InteractiveCliState);

    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "note",
      action: "status",
    });
  });
});
