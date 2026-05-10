// tests/src/cli/interactive/flows/journal/status.journal.flow.interactive.cli.test.ts

import { runJournalStatusFlow } from "@content-cli/cli/interactive/flows/journal/status.journal.flow.interactive.cli";
import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";

jest.mock("@content-cli/cli/interactive/command.interactive.cli", () => ({
  runInteractiveContentCommand: jest.fn(),
}));

describe("runJournalStatusFlow", () => {
  const mockState = { env: "dev" } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls runInteractiveContentCommand with correct parameters", async () => {
    await runJournalStatusFlow(mockState);

    expect(runInteractiveContentCommand).toHaveBeenCalledTimes(1);
    expect(runInteractiveContentCommand).toHaveBeenCalledWith({
      env: "dev",
      entity: "journal",
      action: "status",
    });
  });
});
