// packages/content-cli/src/cli/interactive/menus/note.menu.interactive.cli.test.ts

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";
import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";

import { cancel, isCancel, select } from "@clack/prompts";

import { runNoteInteractiveMenu } from "@content-cli/cli/interactive/menus/note.menu.interactive.cli";
import { runNoteCreateFlow } from "@content-cli/cli/interactive/flows/note/create.note.flow.interactive.cli";
import { runNoteGenerateFlow } from "@content-cli/cli/interactive/flows/note/generate.note.flow.interactive.cli";
import { runNoteValidateFlow } from "@content-cli/cli/interactive/flows/note/validate.note.flow.interactive.cli";
import { runNotePublishFlow } from "@content-cli/cli/interactive/flows/note/publish.note.flow.interactive.cli";
import { runNoteReadFlow } from "@content-cli/cli/interactive/flows/note/read.note.flow.interactive.cli";
import { runNoteListFlow } from "@content-cli/cli/interactive/flows/note/list.note.flow.interactive.cli";
import { runNoteStatusFlow } from "@content-cli/cli/interactive/flows/note/status.note.flow.interactive.cli";

jest.mock(
  "@content-cli/cli/interactive/flows/note/create.note.flow.interactive.cli",
  () => ({ runNoteCreateFlow: jest.fn() }),
);

jest.mock(
  "@content-cli/cli/interactive/flows/note/generate.note.flow.interactive.cli",
  () => ({ runNoteGenerateFlow: jest.fn() }),
);

jest.mock(
  "@content-cli/cli/interactive/flows/note/validate.note.flow.interactive.cli",
  () => ({ runNoteValidateFlow: jest.fn() }),
);

jest.mock(
  "@content-cli/cli/interactive/flows/note/publish.note.flow.interactive.cli",
  () => ({ runNotePublishFlow: jest.fn() }),
);

jest.mock(
  "@content-cli/cli/interactive/flows/note/read.note.flow.interactive.cli",
  () => ({ runNoteReadFlow: jest.fn() }),
);

jest.mock(
  "@content-cli/cli/interactive/flows/note/list.note.flow.interactive.cli",
  () => ({ runNoteListFlow: jest.fn() }),
);

jest.mock(
  "@content-cli/cli/interactive/flows/note/status.note.flow.interactive.cli",
  () => ({ runNoteStatusFlow: jest.fn() }),
);

jest.mock("@clack/prompts", () => ({
  cancel: jest.fn(),
  isCancel: jest.fn(),
  select: jest.fn(),
}));

describe("runNoteInteractiveMenu", () => {
  let mockState: InteractiveCliState;

  beforeEach(() => {
    mockState = { env: "dev" as ContentCliEnvironment };
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

    (select as unknown as jest.Mock).mockImplementation(
      async () => choices[callIndex++],
    );

    (isCancel as unknown as jest.Mock).mockReturnValue(false);

    await runNoteInteractiveMenu(mockState);

    expect(runNoteCreateFlow).toHaveBeenCalledWith(mockState);
    expect(runNoteGenerateFlow).toHaveBeenCalledWith(mockState);
    expect(runNoteValidateFlow).toHaveBeenCalledWith(mockState);
    expect(runNotePublishFlow).toHaveBeenCalledWith(mockState);
    expect(runNoteReadFlow).toHaveBeenCalledWith(mockState);
    expect(runNoteListFlow).toHaveBeenCalledWith(mockState);
    expect(runNoteStatusFlow).toHaveBeenCalledWith(mockState);
  });

  it("handles cancel input on first selection", async () => {
    (select as unknown as jest.Mock).mockResolvedValueOnce("create");
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(true);

    await runNoteInteractiveMenu(mockState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
    expect(runNoteCreateFlow).not.toHaveBeenCalled();
  });
});
