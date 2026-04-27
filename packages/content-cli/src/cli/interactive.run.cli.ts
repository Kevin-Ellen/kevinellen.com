// packages/content-cli/src/cli/interactive.run.cli.ts

import { intro } from "@clack/prompts";

import { runMainInteractiveMenu } from "@content-cli/cli/interactive/menus/main.menu.interactive.cli";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";
import type { ParsedInteractiveCliArgs } from "@content-cli/types/parse-args.cli.types";

export const runInteractiveCli = async (
  parsedArgs: ParsedInteractiveCliArgs,
): Promise<void> => {
  const state: InteractiveCliState = {
    env: parsedArgs.env,
  };

  intro("🪶 Kevin Ellen Content CLI");

  await runMainInteractiveMenu(state);
};
