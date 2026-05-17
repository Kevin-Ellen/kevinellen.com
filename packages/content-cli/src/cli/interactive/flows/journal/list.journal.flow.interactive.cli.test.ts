// tests/src/cli/interactive/flows/journal/list.journal.flow.interactive.cli.test.ts

import { runJournalListFlow } from "@content-cli/cli/interactive/flows/journal/list.journal.flow.interactive.cli";
import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";

jest.mock("@content-cli/cli/interactive/command.interactive.cli", () => ({
  runInteractiveContentCommand: jest.fn(),
}));

describe("runJournalListFlow", () => {
  const mockState = { env: "dev" } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls runInteractiveContentCommand with correct parameters", async () => {
    await runJournalListFlow(mockState);

    expect(runInteractiveContentCommand).toHaveBeenCalledTimes(1);
    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "journal",
      action: "list",
    });
  });
});
