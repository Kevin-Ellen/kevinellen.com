// packages/content-cli/src/cli/interactive/flows/note/publish.note.flow.interactive.cli.test.ts

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

import { cancel, confirm, isCancel, text } from "@clack/prompts";

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";
import { runNotePublishFlow } from "@content-cli/cli/interactive/flows/note/publish.note.flow.interactive.cli";

jest.mock("@content-cli/cli/interactive/command.interactive.cli", () => ({
  runInteractiveContentCommand: jest.fn(),
}));

jest.mock("@clack/prompts", () => ({
  cancel: jest.fn(),
  confirm: jest.fn(),
  isCancel: jest.fn(),
  text: jest.fn(),
}));

describe("runNotePublishFlow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (isCancel as unknown as jest.Mock).mockReturnValue(false);
  });

  it("validates then publishes a note", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("my-note");

    await runNotePublishFlow({ env: "dev" } as InteractiveCliState);

    expect(runInteractiveContentCommand).toHaveBeenNthCalledWith(1, {
      env: "dev",
      entity: "note",
      action: "validate",
      slug: "my-note",
    });

    expect(runInteractiveContentCommand).toHaveBeenNthCalledWith(2, {
      env: "dev",
      entity: "note",
      action: "publish",
      slug: "my-note",
    });
  });

  it("handles cancelled slug input", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("my-note");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(true);

    await runNotePublishFlow({ env: "dev" } as InteractiveCliState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("cancels prod publish when confirmation is declined", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("my-note");
    (confirm as unknown as jest.Mock).mockResolvedValueOnce(false);

    await runNotePublishFlow({ env: "prod" } as InteractiveCliState);

    expect(cancel).toHaveBeenCalledWith("Publish cancelled.");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("publishes to prod when confirmed", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("my-note");
    (confirm as unknown as jest.Mock).mockResolvedValueOnce(true);

    await runNotePublishFlow({ env: "prod" } as InteractiveCliState);

    expect(runInteractiveContentCommand).toHaveBeenNthCalledWith(1, {
      env: "prod",
      entity: "note",
      action: "validate",
      slug: "my-note",
    });

    expect(runInteractiveContentCommand).toHaveBeenNthCalledWith(2, {
      env: "prod",
      entity: "note",
      action: "publish",
      slug: "my-note",
    });
  });
});
