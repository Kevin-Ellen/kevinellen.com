// packages/content-cli/src/commands/types/command.types.ts

import type { ParsedDirectCliArgs } from "@content-cli/types/parse-args.cli.types";

export type ContentCommandResult = Readonly<{
  ok: boolean;
}>;

export type JournalCreateCommandResult = ContentCommandResult &
  Readonly<{
    entity: "journal";
    action: "create";
    workspaceId: string;
    workspacePath: string;
    photosPath: string;
  }>;

export type PhotoCreateCommandResult = ContentCommandResult &
  Readonly<{
    entity: "photo";
    action: "create";
    workspaceId: string;
    workspacePath: string;
  }>;

export type ContentCommandHandler = (
  args: ParsedDirectCliArgs,
) => Promise<ContentCommandResult>;
