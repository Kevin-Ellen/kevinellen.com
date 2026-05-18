// packages/content-cli/src/cli/interactive/menus/promote.menu.interactive.cli.test.ts

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

import { cancel, isCancel, select } from "@clack/prompts";

import { runJournalPromoteFlow } from "@content-cli/cli/interactive/flows/journal/promote.journal.flow.interactive.cli";
import { runNotePromoteFlow } from "@content-cli/cli/interactive/flows/note/promote.note.flow.interactive.cli";
import { runPromoteInteractiveMenu } from "@content-cli/cli/interactive/menus/promote.menu.interactive.cli";

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

jest.mock(
  "@content-cli/cli/interactive/flows/note/promote.note.flow.interactive.cli",
  () => ({
    runNotePromoteFlow: jest.fn(),
  }),
);

describe("runPromoteInteractiveMenu", () => {
  const mockState = { env: "dev" } as InteractiveCliState;

  beforeEach(() => {
    jest.clearAllMocks();

    (isCancel as unknown as jest.Mock).mockReturnValue(false);
    (runJournalPromoteFlow as jest.Mock).mockResolvedValue(undefined);
    (runNotePromoteFlow as jest.Mock).mockResolvedValue(undefined);
  });

  it("calls runJournalPromoteFlow for journal dev → stg", async () => {
    (select as unknown as jest.Mock).mockResolvedValue("journal:dev-stg");

    await runPromoteInteractiveMenu(mockState);

    expect(runJournalPromoteFlow).toHaveBeenCalledWith(mockState, "dev", "stg");
    expect(runNotePromoteFlow).not.toHaveBeenCalled();
  });

  it("calls runJournalPromoteFlow for journal stg → prod", async () => {
    (select as unknown as jest.Mock).mockResolvedValue("journal:stg-prod");

    await runPromoteInteractiveMenu(mockState);

    expect(runJournalPromoteFlow).toHaveBeenCalledWith(
      mockState,
      "stg",
      "prod",
    );
    expect(runNotePromoteFlow).not.toHaveBeenCalled();
  });

  it("calls runJournalPromoteFlow for journal dev → prod", async () => {
    (select as unknown as jest.Mock).mockResolvedValue("journal:dev-prod");

    await runPromoteInteractiveMenu(mockState);

    expect(runJournalPromoteFlow).toHaveBeenCalledWith(
      mockState,
      "dev",
      "prod",
    );
    expect(runNotePromoteFlow).not.toHaveBeenCalled();
  });

  it("calls runNotePromoteFlow for note dev → stg", async () => {
    (select as unknown as jest.Mock).mockResolvedValue("note:dev-stg");

    await runPromoteInteractiveMenu(mockState);

    expect(runNotePromoteFlow).toHaveBeenCalledWith(mockState, "dev", "stg");
    expect(runJournalPromoteFlow).not.toHaveBeenCalled();
  });

  it("calls runNotePromoteFlow for note stg → prod", async () => {
    (select as unknown as jest.Mock).mockResolvedValue("note:stg-prod");

    await runPromoteInteractiveMenu(mockState);

    expect(runNotePromoteFlow).toHaveBeenCalledWith(mockState, "stg", "prod");
    expect(runJournalPromoteFlow).not.toHaveBeenCalled();
  });

  it("calls runNotePromoteFlow for note dev → prod", async () => {
    (select as unknown as jest.Mock).mockResolvedValue("note:dev-prod");

    await runPromoteInteractiveMenu(mockState);

    expect(runNotePromoteFlow).toHaveBeenCalledWith(mockState, "dev", "prod");
    expect(runJournalPromoteFlow).not.toHaveBeenCalled();
  });

  it("returns immediately when back is selected", async () => {
    (select as unknown as jest.Mock).mockResolvedValue("back");

    await runPromoteInteractiveMenu(mockState);

    expect(runJournalPromoteFlow).not.toHaveBeenCalled();
    expect(runNotePromoteFlow).not.toHaveBeenCalled();
  });

  it("cancels if user cancels selection", async () => {
    (select as unknown as jest.Mock).mockResolvedValue("journal:dev-stg");
    (isCancel as unknown as jest.Mock).mockReturnValue(true);

    await runPromoteInteractiveMenu(mockState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
    expect(runJournalPromoteFlow).not.toHaveBeenCalled();
    expect(runNotePromoteFlow).not.toHaveBeenCalled();
  });

  it("throws error for invalid action", async () => {
    (select as unknown as jest.Mock).mockResolvedValue("invalidAction");

    await expect(runPromoteInteractiveMenu(mockState)).rejects.toThrow(
      /No promote flow defined for action: invalidAction/,
    );

    expect(runJournalPromoteFlow).not.toHaveBeenCalled();
    expect(runNotePromoteFlow).not.toHaveBeenCalled();
  });
});
