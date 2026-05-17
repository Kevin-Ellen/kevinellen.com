// tests/src/cli/interactive/flows/journal/validate.journal.flow.interactive.cli.test.ts

import { runJournalValidateFlow } from "@content-cli/cli/interactive/flows/journal/validate.journal.flow.interactive.cli";
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

describe("runJournalValidateFlow", () => {
  const mockState = { env: "dev" } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("cancels if slug input is cancelled", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("slug");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(true);

    await runJournalValidateFlow(mockState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("calls runInteractiveContentCommand in normal flow", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("my-journal-slug");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(false);

    await runJournalValidateFlow(mockState);

    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "journal",
      action: "validate",
      slug: "my-journal-slug",
    });
  });
});
