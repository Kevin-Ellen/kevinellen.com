// packages/content-cli/src/cli/direct.run.cli.ts

import type { ParsedDirectCliArgs } from "@content-cli/types/parse-args.cli.types";
import type { ContentCommandResult } from "@content-cli/commands/types/command.types";

import { contentCommandRegistry } from "@content-cli/commands/registry/registry.command";

export const runDirectCli = async (
  parsedArgs: ParsedDirectCliArgs,
): Promise<ContentCommandResult> => {
  const command = contentCommandRegistry[parsedArgs.entity][parsedArgs.action];

  if (!command) {
    throw new Error("Unsupported CLI command.");
  }

  return command(parsedArgs);
};
