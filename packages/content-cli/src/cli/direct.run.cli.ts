// packages/content-cli/src/cli/direct.run.cli.ts

import { contentCommandRegistry } from "@content-cli/commands/registry/registry.command";

import type { ParsedDirectCliArgs } from "@content-cli/types/parse-args.cli.types";

export const runDirectCli = async (
  parsedArgs: ParsedDirectCliArgs,
): Promise<void> => {
  const command = contentCommandRegistry[parsedArgs.entity][parsedArgs.action];

  if (!command) {
    throw new Error("Unsupported CLI command.");
  }

  await command(parsedArgs);
};
