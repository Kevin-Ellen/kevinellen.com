// packages/content-cli/src/cli/interactive/menus/promote.menu.interactive.cli.test.ts

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";
import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";

import { cancel, isCancel, select } from "@clack/prompts";
import { runPromoteInteractiveMenu } from "@content-cli/cli/interactive/menus/promote.menu.interactive.cli";
import { runJournalPromoteFlow } from "@content-cli/cli/interactive/flows/journal/promote.journal.flow.interactive.cli";

jest.mock("@clack/prompts", () => ({
  cancel: jest.fn(),
  isCancel: jest.fn(),
  select: jest.fn(),
}));

jest.mock(
  "@content-cli/cli/interactive/flows/journal/promote.journal.flow.interactive.cli",
  () => ({
    runJournalPromoteFlow: jest.fn(),
  }),
);

describe("runPromoteInteractiveMenu", () => {
  let mockState: InteractiveCliState;

  beforeEach(() => {
    mockState = { env: "dev" } as InteractiveCliState;
    jest.clearAllMocks();
    (runJournalPromoteFlow as jest.Mock).mockResolvedValue(undefined);
  });

  it("calls runJournalPromoteFlow for dev → stg", async () => {
    (select as unknown as jest.Mock).mockResolvedValue("dev-stg");
    (isCancel as unknown as jest.Mock).mockReturnValue(false);

    await runPromoteInteractiveMenu(mockState);

    expect(runJournalPromoteFlow).toHaveBeenCalledWith(mockState, "dev", "stg");
  });

  it("calls runJournalPromoteFlow for stg → prod", async () => {
    (select as unknown as jest.Mock).mockResolvedValue("stg-prod");
    (isCancel as unknown as jest.Mock).mockReturnValue(false);

    await runPromoteInteractiveMenu(mockState);

    expect(runJournalPromoteFlow).toHaveBeenCalledWith(
      mockState,
      "stg",
      "prod",
    );
  });

  it("calls runJournalPromoteFlow for dev → prod", async () => {
    (select as unknown as jest.Mock).mockResolvedValue("dev-prod");
    (isCancel as unknown as jest.Mock).mockReturnValue(false);

    await runPromoteInteractiveMenu(mockState);

    expect(runJournalPromoteFlow).toHaveBeenCalledWith(
      mockState,
      "dev",
      "prod",
    );
  });

  it("returns immediately when back is selected", async () => {
    (select as unknown as jest.Mock).mockResolvedValue("back");
    (isCancel as unknown as jest.Mock).mockReturnValue(false);

    await runPromoteInteractiveMenu(mockState);

    expect(runJournalPromoteFlow).not.toHaveBeenCalled();
  });

  it("cancels if user cancels selection", async () => {
    (select as unknown as jest.Mock).mockResolvedValue("dev-stg");
    (isCancel as unknown as jest.Mock).mockReturnValue(true);

    await runPromoteInteractiveMenu(mockState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
    expect(runJournalPromoteFlow).not.toHaveBeenCalled();
  });

  it("throws error for invalid action", async () => {
    (select as unknown as jest.Mock).mockResolvedValue("invalidAction");
    (isCancel as unknown as jest.Mock).mockReturnValue(false);

    await expect(runPromoteInteractiveMenu(mockState)).rejects.toThrow(
      /No promote flow defined for action: invalidAction/,
    );

    expect(runJournalPromoteFlow).not.toHaveBeenCalled();
  });
});
