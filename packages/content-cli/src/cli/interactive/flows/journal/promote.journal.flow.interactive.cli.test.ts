// tests/src/cli/interactive/flows/journal/promote.journal.flow.interactive.cli.test.ts

import { runJournalPromoteFlow } from "@content-cli/cli/interactive/flows/journal/promote.journal.flow.interactive.cli";
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

describe("runJournalPromoteFlow", () => {
  const mockState = { env: "dev" } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("promotes normally when not cancelled and confirmation correct", async () => {
    (text as unknown as jest.Mock)
      .mockResolvedValueOnce("my-journal-slug") // slug input
      .mockResolvedValueOnce("PROMOTE"); // PROD confirmation
    (isCancel as unknown as jest.Mock).mockReturnValue(false);

    await runJournalPromoteFlow(mockState, "stg", "prod");

    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "journal",
      action: "promote",
      slug: "my-journal-slug",
      from: "stg",
      to: "prod",
    });
  });

  it("cancels if first prompt is cancelled", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("slug");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(true);

    await runJournalPromoteFlow(mockState, "dev", "stg");

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("cancels if PROD confirmation is wrong", async () => {
    (text as unknown as jest.Mock)
      .mockResolvedValueOnce("slug") // first prompt
      .mockResolvedValueOnce("WRONG"); // PROD confirmation
    (isCancel as unknown as jest.Mock).mockReturnValue(false);

    await runJournalPromoteFlow(mockState, "stg", "prod");

    expect(cancel).toHaveBeenCalledWith("Promotion cancelled.");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("cancels if PROD confirmation is cancelled", async () => {
    (text as unknown as jest.Mock)
      .mockResolvedValueOnce("slug") // first prompt
      .mockResolvedValueOnce("PROMOTE"); // PROD confirmation
    (isCancel as unknown as jest.Mock)
      .mockReturnValueOnce(false) // first prompt
      .mockReturnValueOnce(true); // PROD confirmation cancelled

    await runJournalPromoteFlow(mockState, "stg", "prod");

    expect(cancel).toHaveBeenCalledWith("Promotion cancelled.");
    expect(runInteractiveContentCommand).not.toHaveBeenCalled();
  });

  it("promotes without confirmation when 'to' is not PROD", async () => {
    (text as unknown as jest.Mock).mockResolvedValueOnce("my-journal-slug"); // slug input
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(false);

    await runJournalPromoteFlow(mockState, "stg", "dev"); // to !== "prod"

    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "journal",
      action: "promote",
      slug: "my-journal-slug",
      from: "stg",
      to: "dev",
    });
  });
});
