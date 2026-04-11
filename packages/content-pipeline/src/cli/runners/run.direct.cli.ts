// packages/content-pipeline/src/cli/runners/run.direct.cli.ts

import { contentCommandRegistry } from "@content-pipeline/cli/registry/content.command.registry";

import type { ParsedDirectCliArgs } from "@content-pipeline/cli/types/parsed.cli.args.types";

export const runDirectCli = async (
  parsedArgs: ParsedDirectCliArgs,
): Promise<void> => {
  if (!parsedArgs.entity || !parsedArgs.action) {
    throw new Error("Direct mode requires both an entity and an action.");
  }

  const entityCommands = contentCommandRegistry[parsedArgs.entity];
  const command = entityCommands?.[parsedArgs.action];

  if (!command) {
    throw new Error("Unsupported CLI command.");
  }

  await command({
    env: parsedArgs.env,
    draftId: parsedArgs.draftId,
  });
};
