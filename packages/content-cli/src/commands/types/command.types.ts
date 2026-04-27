// packages/content-cli/src/commands/types/command.types.ts

import type { ParsedDirectCliArgs } from "@content-cli/types/parse-args.cli.types";

export type ContentCommandResult = Readonly<{
  ok: boolean;
}>;

export type ContentCommandHandler = (
  args: ParsedDirectCliArgs,
) => Promise<ContentCommandResult>;
