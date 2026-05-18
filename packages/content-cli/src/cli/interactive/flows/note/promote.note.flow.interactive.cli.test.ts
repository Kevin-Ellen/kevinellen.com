// packages/content-cli/src/cli/interactive/flows/note/promote.note.flow.interactive.cli.test.ts

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

import { cancel, isCancel, text } from "@clack/prompts";

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";
import { runNotePromoteFlow } from "@content-cli/cli/interactive/flows/note/promote.note.flow.interactive.cli";

jest.mock("@content-cli/cli/interactive/command.interactive.cli", () => ({
  runInteractiveContentCommand: jest.fn(),
}));

jest.mock("@clack/prompts", () => ({
  cancel: jest.fn(),
  isCancel: jest.fn(),
  text: jest.fn(),
}));

describe("runNotePromoteFlow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (isCancel as unknown as jest.Mock).mockReturnValue(false);
  });

  it("promotes a note between non-prod environments", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("my-note");

    await runNotePromoteFlow(
      { env: "dev" } as InteractiveCliState,
      "dev",
      "stg",
    );

    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "note",
      action: "promote",
      slug: "my-note",
      from: "dev",
      to: "stg",
    });
  });

  it("handles cancelled slug input", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("my-note");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(true);

    await runNotePromoteFlow(
      { env: "dev" } as InteractiveCliState,
      "dev",
      "stg",
    );

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("cancels prod promotion when confirmation is not PROMOTE", async () => {
    (text as unknown as jest.Mock)
      .mockResolvedValueOnce("my-note")
      .mockResolvedValueOnce("NOPE");

    await runNotePromoteFlow(
      { env: "dev" } as InteractiveCliState,
      "stg",
      "prod",
    );

    expect(cancel).toHaveBeenCalledWith("Promotion cancelled.");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("promotes to prod when confirmation is PROMOTE", async () => {
    (text as unknown as jest.Mock)
      .mockResolvedValueOnce("my-note")
      .mockResolvedValueOnce("PROMOTE");

    await runNotePromoteFlow(
      { env: "dev" } as InteractiveCliState,
      "stg",
      "prod",
    );

    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "note",
      action: "promote",
      slug: "my-note",
      from: "stg",
      to: "prod",
    });
  });

  it("trims slug input before promoting", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("  my-note  ");

    await runNotePromoteFlow(
      { env: "dev" } as InteractiveCliState,
      "dev",
      "stg",
    );

    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "note",
      action: "promote",
      slug: "my-note",
      from: "dev",
      to: "stg",
    });
  });

  it("cancels when slug input is empty after trimming", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("   ");

    await runNotePromoteFlow(
      { env: "dev" } as InteractiveCliState,
      "dev",
      "stg",
    );

    expect(cancel).toHaveBeenCalledWith(
      "Promotion cancelled. Note slug is required.",
    );
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });
});
