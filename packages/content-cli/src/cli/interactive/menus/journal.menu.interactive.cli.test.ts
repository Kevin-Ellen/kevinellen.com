// tests/src/cli/interactive/menus/journal.menu.interactive.cli.test.ts

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";
import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";

import { cancel, isCancel, select } from "@clack/prompts";

import { runJournalInteractiveMenu } from "@content-cli/cli/interactive/menus/journal.menu.interactive.cli";
import { runJournalCreateFlow } from "@content-cli/cli/interactive/flows/journal/create.journal.flow.interactive.cli";
import { runJournalGenerateFlow } from "@content-cli/cli/interactive/flows/journal/generate.journal.flow.interactive.cli";
import { runJournalValidateFlow } from "@content-cli/cli/interactive/flows/journal/validate.journal.flow.interactive.cli";
import { runJournalPublishFlow } from "@content-cli/cli/interactive/flows/journal/publish.journal.flow.interactive.cli";
import { runJournalReadFlow } from "@content-cli/cli/interactive/flows/journal/read.journal.flow.interactive.cli";
import { runJournalListFlow } from "@content-cli/cli/interactive/flows/journal/list.journal.flow.interactive.cli";
import { runJournalStatusFlow } from "@content-cli/cli/interactive/flows/journal/status.journal.flow.interactive.cli";

jest.mock(
  "@content-cli/cli/interactive/flows/journal/create.journal.flow.interactive.cli",
  () => ({ runJournalCreateFlow: jest.fn() }),
);
jest.mock(
  "@content-cli/cli/interactive/flows/journal/generate.journal.flow.interactive.cli",
  () => ({ runJournalGenerateFlow: jest.fn() }),
);
jest.mock(
  "@content-cli/cli/interactive/flows/journal/validate.journal.flow.interactive.cli",
  () => ({ runJournalValidateFlow: jest.fn() }),
);
jest.mock(
  "@content-cli/cli/interactive/flows/journal/publish.journal.flow.interactive.cli",
  () => ({ runJournalPublishFlow: jest.fn() }),
);
jest.mock(
  "@content-cli/cli/interactive/flows/journal/read.journal.flow.interactive.cli",
  () => ({ runJournalReadFlow: jest.fn() }),
);
jest.mock(
  "@content-cli/cli/interactive/flows/journal/list.journal.flow.interactive.cli",
  () => ({ runJournalListFlow: jest.fn() }),
);
jest.mock(
  "@content-cli/cli/interactive/flows/journal/status.journal.flow.interactive.cli",
  () => ({ runJournalStatusFlow: jest.fn() }),
);

jest.mock("@clack/prompts", () => ({
  cancel: jest.fn(),
  isCancel: jest.fn(),
  select: jest.fn(),
}));

describe("runJournalInteractiveMenu", () => {
  let mockState: InteractiveCliState;

  beforeEach(() => {
    mockState = { env: "dev" as ContentCliEnvironment }; // fully type-safe
    jest.clearAllMocks();
  });

  it("calls each flow in order for user selections and exits on back", async () => {
    const choices = [
      "create",
      "generate",
      "validate",
      "publish",
      "read",
      "list",
      "status",
      "back",
    ];
    let callIndex = 0;

    // Simulate user selecting each option in sequence
    (select as unknown as jest.Mock).mockImplementation(
      async () => choices[callIndex++],
    );
    (isCancel as unknown as jest.Mock).mockReturnValue(false);

    await runJournalInteractiveMenu(mockState);

    expect(runJournalCreateFlow).toHaveBeenCalledWith(mockState);
    expect(runJournalGenerateFlow).toHaveBeenCalledWith(mockState);
    expect(runJournalValidateFlow).toHaveBeenCalledWith(mockState);
    expect(runJournalPublishFlow).toHaveBeenCalledWith(mockState);
    expect(runJournalReadFlow).toHaveBeenCalledWith(mockState);
    expect(runJournalListFlow).toHaveBeenCalledWith(mockState);
    expect(runJournalStatusFlow).toHaveBeenCalledWith(mockState);
  });

  it("handles cancel input on first selection", async () => {
    (select as unknown as jest.Mock).mockResolvedValueOnce("create");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(true);

    await runJournalInteractiveMenu(mockState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
    expect(runJournalCreateFlow).not.toHaveBeenCalled();
  });
});
