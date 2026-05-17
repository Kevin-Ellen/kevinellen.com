// packages/content-cli/src/cli/interactive/menus/main.menu.interactive.cli.test.ts

import { runMainInteractiveMenu } from "@content-cli/cli/interactive/menus/main.menu.interactive.cli";
import { runEnvironmentInteractiveMenu } from "@content-cli/cli/interactive/menus/environment.menu.interactive.cli";
import { runJournalInteractiveMenu } from "@content-cli/cli/interactive/menus/journal.menu.interactive.cli";
import { runPhotoInteractiveMenu } from "@content-cli/cli/interactive/menus/photo.menu.interactive.cli";
import { runPromoteInteractiveMenu } from "@content-cli/cli/interactive/menus/promote.menu.interactive.cli";
import { cancel, isCancel, select } from "@clack/prompts";
import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

jest.mock("@clack/prompts", () => ({
  cancel: jest.fn(),
  isCancel: jest.fn(),
  select: jest.fn(),
}));

jest.mock(
  "@content-cli/cli/interactive/menus/environment.menu.interactive.cli",
  () => ({
    runEnvironmentInteractiveMenu: jest.fn(),
  }),
);
jest.mock(
  "@content-cli/cli/interactive/menus/journal.menu.interactive.cli",
  () => ({
    runJournalInteractiveMenu: jest.fn(),
  }),
);
jest.mock(
  "@content-cli/cli/interactive/menus/photo.menu.interactive.cli",
  () => ({
    runPhotoInteractiveMenu: jest.fn(),
  }),
);
jest.mock(
  "@content-cli/cli/interactive/menus/promote.menu.interactive.cli",
  () => ({
    runPromoteInteractiveMenu: jest.fn(),
  }),
);

describe("runMainInteractiveMenu full branch coverage", () => {
  let mockState: InteractiveCliState;

  beforeEach(() => {
    mockState = { env: "dev" } as InteractiveCliState;
    jest.clearAllMocks();

    // Make all async submenu mocks resolve to ensure coverage
    (runPromoteInteractiveMenu as jest.Mock).mockResolvedValue(undefined);
    (runJournalInteractiveMenu as jest.Mock).mockResolvedValue(undefined);
    (runPhotoInteractiveMenu as jest.Mock).mockResolvedValue(undefined);
    (runEnvironmentInteractiveMenu as jest.Mock).mockResolvedValue(undefined);
  });

  it("calls all submenus in sequence and exits safely", async () => {
    // Provide choices in order and exit at the end to break loop
    const choices = ["journal", "photo", "promote", "environment", "exit"];
    let callIndex = 0;

    (select as unknown as jest.Mock).mockImplementation(
      async () => choices[callIndex++],
    );
    (isCancel as unknown as jest.Mock).mockReturnValue(false);

    await runMainInteractiveMenu(mockState);

    expect(runJournalInteractiveMenu).toHaveBeenCalledWith(mockState);
    expect(runPhotoInteractiveMenu).toHaveBeenCalledWith(mockState);
    expect(runPromoteInteractiveMenu).toHaveBeenCalledWith(mockState);
    expect(runEnvironmentInteractiveMenu).toHaveBeenCalledWith(mockState);
  });

  it("handles cancel at top level", async () => {
    const choices = ["journal", "exit"]; // first choice, cancel returns true
    let callIndex = 0;

    (select as unknown as jest.Mock).mockImplementation(
      async () => choices[callIndex++],
    );
    (isCancel as unknown as jest.Mock).mockReturnValueOnce(true);

    await runMainInteractiveMenu(mockState);

    expect(cancel).toHaveBeenCalledWith("Cancelled.");
    expect(runJournalInteractiveMenu).not.toHaveBeenCalled();
    expect(runPhotoInteractiveMenu).not.toHaveBeenCalled();
    expect(runPromoteInteractiveMenu).not.toHaveBeenCalled();
    expect(runEnvironmentInteractiveMenu).not.toHaveBeenCalled();
  });

  it("explicitly covers promote branch for coverage", async () => {
    const choices = ["promote", "exit"]; // promote branch, then exit
    let callIndex = 0;

    (select as unknown as jest.Mock).mockImplementation(
      async () => choices[callIndex++],
    );
    (isCancel as unknown as jest.Mock).mockReturnValue(false);

    await runMainInteractiveMenu(mockState);

    expect(runPromoteInteractiveMenu).toHaveBeenCalledWith(mockState);
  });

  it("explicitly covers environment branch for coverage", async () => {
    const choices = ["environment", "exit"]; // environment branch, then exit
    let callIndex = 0;

    (select as unknown as jest.Mock).mockImplementation(
      async () => choices[callIndex++],
    );
    (isCancel as unknown as jest.Mock).mockReturnValue(false);

    await runMainInteractiveMenu(mockState);

    expect(runEnvironmentInteractiveMenu).toHaveBeenCalledWith(mockState);
  });

  it("explicitly covers journal branch for coverage", async () => {
    const choices = ["journal", "exit"];
    let callIndex = 0;

    (select as unknown as jest.Mock).mockImplementation(
      async () => choices[callIndex++],
    );
    (isCancel as unknown as jest.Mock).mockReturnValue(false);

    await runMainInteractiveMenu(mockState);

    expect(runJournalInteractiveMenu).toHaveBeenCalledWith(mockState);
  });

  it("explicitly covers photo branch for coverage", async () => {
    const choices = ["photo", "exit"];
    let callIndex = 0;

    (select as unknown as jest.Mock).mockImplementation(
      async () => choices[callIndex++],
    );
    (isCancel as unknown as jest.Mock).mockReturnValue(false);

    await runMainInteractiveMenu(mockState);

    expect(runPhotoInteractiveMenu).toHaveBeenCalledWith(mockState);
  });

  it("throws if an invalid action is returned", async () => {
    const choices = ["invalidAction"] as unknown as string[]; // force invalid action
    let callIndex = 0;

    (select as unknown as jest.Mock).mockImplementation(
      async () => choices[callIndex++],
    );
    (isCancel as unknown as jest.Mock).mockReturnValue(false);

    await expect(runMainInteractiveMenu(mockState, 1)).rejects.toThrow(
      /No handler found for action: invalidAction/,
    );
  });
});
