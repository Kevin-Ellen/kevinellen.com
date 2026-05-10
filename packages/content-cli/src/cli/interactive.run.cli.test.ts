// packages/content-cli/src/cli/interactive.run.cli.test.ts

import { runInteractiveCli } from "@content-cli/cli/interactive.run.cli";
import type { ParsedInteractiveCliArgs } from "@content-cli/types/parse-args.cli.types";
import { runMainInteractiveMenu } from "@content-cli/cli/interactive/menus/main.menu.interactive.cli";
import { intro } from "@clack/prompts";

jest.mock(
  "@content-cli/cli/interactive/menus/main.menu.interactive.cli",
  () => ({
    runMainInteractiveMenu: jest.fn(),
  }),
);

jest.mock("@clack/prompts", () => ({
  intro: jest.fn(),
}));

describe("runInteractiveCli", () => {
  const mockedMenu = jest.mocked(runMainInteractiveMenu);
  const mockedIntro = jest.mocked(intro);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls intro with CLI header", async () => {
    const args: ParsedInteractiveCliArgs = { mode: "interactive", env: "dev" };
    await runInteractiveCli(args);
    expect(mockedIntro).toHaveBeenCalledWith("🪶 Kevin Ellen Content CLI");
  });

  it("calls runMainInteractiveMenu with correct state", async () => {
    const args: ParsedInteractiveCliArgs = { mode: "interactive", env: "stg" };
    await runInteractiveCli(args);
    expect(mockedMenu).toHaveBeenCalledWith({ env: "stg" });
  });

  it("works with default environment", async () => {
    const args: ParsedInteractiveCliArgs = { mode: "interactive", env: "prod" };
    await runInteractiveCli(args);
    expect(mockedMenu).toHaveBeenCalledWith({ env: "prod" });
  });
});
