// packages/content-cli/src/cli/direct.run.cli.ts

import type { ParsedDirectCliArgs } from "@content-cli/types/parse-args.cli.types";
import type { ContentCommandResult } from "@content-cli/commands/types/command.types";
import type { ContentCommandHandler } from "@content-cli/commands/types/command.types";

import { contentCommandRegistry } from "@content-cli/commands/registry/registry.command";

export const runDirectCli = async <
  T extends ParsedDirectCliArgs = ParsedDirectCliArgs,
>(
  parsedArgs: T,
): Promise<ContentCommandResult> => {
  // cast entity registry to any for indexing
  const entityRegistry = contentCommandRegistry[
    parsedArgs.entity
  ] as any as Record<string, ContentCommandHandler<T>>;

  const command = entityRegistry[parsedArgs.action];

  if (!command) {
    throw new Error("Unsupported CLI command.");
  }

  return command(parsedArgs);
};
