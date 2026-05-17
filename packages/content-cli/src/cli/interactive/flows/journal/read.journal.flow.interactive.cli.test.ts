// tests/src/cli/interactive/flows/journal/read.journal.flow.interactive.cli.test.ts

import { runJournalReadFlow } from "@content-cli/cli/interactive/flows/journal/read.journal.flow.interactive.cli";
import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";
import { safeRunInteractiveStep } from "@content-cli/cli/interactive/safe-run.interactive.cli";
import { cancel, isCancel, text } from "@clack/prompts";

jest.mock("@clack/prompts", () => ({
  cancel: jest.fn(),
  isCancel: jest.fn(),
  text: jest.fn(),
}));

jest.mock("@content-cli/cli/interactive/command.interactive.cli", () => ({
  runInteractiveContentCommand: jest.fn(),
}));

jest.mock("@content-cli/cli/interactive/safe-run.interactive.cli", () => ({
  safeRunInteractiveStep: jest.fn(),
}));

describe("runJournalReadFlow", () => {
  const mockState = { env: "dev" } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("cancels if slug input is cancelled", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("slug");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(true);

    await runJournalReadFlow(mockState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
    expect(safeRunInteractiveStep).not.toHaveBeenCalled();
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("runs safeRunInteractiveStep when slug is valid", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("slug");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(false);

    const mockStep = jest.fn();
    (safeRunInteractiveStep as unknown as jest.Mock).mockImplementation(
      async (_name, fn) => {
        await fn();
        return true;
      },
    );

    await runJournalReadFlow(mockState);

    expect(safeRunInteractiveStep).toHaveBeenCalledWith(
      "Journal read",
      expect.any(Function),
    );

    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "journal",
      action: "read",
      slug: "slug",
    });
  });
});
