// tests/src/cli/interactive/flows/journal/generate.journal.flow.interactive.cli.test.ts

import { runJournalGenerateFlow } from "@content-cli/cli/interactive/flows/journal/generate.journal.flow.interactive.cli";
import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";
import { cancel, isCancel, text } from "@clack/prompts";

jest.mock("@clack/prompts", () => ({
  cancel: jest.fn(),
  isCancel: jest.fn(),
  text: jest.fn(),
}));

jest.mock("@content-cli/cli/interactive/command.interactive.cli", () => ({
  runInteractiveContentCommand: jest.fn(),
}));

describe("runJournalGenerateFlow", () => {
  const mockState = { env: "dev" } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls runInteractiveContentCommand with user input", async () => {
    (text as jest.Mock).mockResolvedValue("my-journal-slug");
    (isCancel as unknown as jest.Mock).mockReturnValue(false);

    await runJournalGenerateFlow(mockState);

    expect(text).toHaveBeenCalledWith({
      message: "Journal slug",
      placeholder: "unexpected-encounters-salbufera-mallorca",
    });

    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "journal",
      action: "generate",
      slug: "my-journal-slug",
    });
  });

  it("handles cancel input gracefully", async () => {
    (text as jest.Mock).mockResolvedValue("something");
    (isCancel as unknown as jest.Mock).mockReturnValue(true);

    await runJournalGenerateFlow(mockState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });
});
