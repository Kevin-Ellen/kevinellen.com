// packages/content-cli/src/cli/interactive/flows/note/generate.note.flow.interactive.cli.test.ts

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";
import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";

import { cancel, isCancel, text } from "@clack/prompts";

import { runNoteGenerateFlow } from "@content-cli/cli/interactive/flows/note/generate.note.flow.interactive.cli";
import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";

jest.mock("@content-cli/cli/interactive/command.interactive.cli", () => ({
  runInteractiveContentCommand: jest.fn(),
}));

jest.mock("@clack/prompts", () => ({
  cancel: jest.fn(),
  isCancel: jest.fn(),
  text: jest.fn(),
}));

describe("runNoteGenerateFlow", () => {
  let mockState: InteractiveCliState;

  beforeEach(() => {
    mockState = { env: "dev" as ContentCliEnvironment };

    jest.clearAllMocks();

    (isCancel as unknown as jest.Mock).mockReturnValue(false);
  });

  it("generates a note draft for the provided slug", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("my-note");

    await runNoteGenerateFlow(mockState);

    expect(text).toHaveBeenCalledWith({
      message: "Note slug",
      placeholder: "cloudflare-workers-typed-boundaries",
    });

    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "note",
      action: "generate",
      slug: "my-note",
    });
  });

  it("handles cancelled input", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("my-note");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(true);

    await runNoteGenerateFlow(mockState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });
});
