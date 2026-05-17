// packages/content-cli/src/commands/types/command.types.ts

import type { ParsedDirectCliArgs } from "@content-cli/types/parse-args.cli.types";

export type ContentCommandResult = Readonly<{
  ok: boolean;
}>;

/** Journal results */
export type JournalCreateCommandResult = ContentCommandResult &
  Readonly<{
    entity: "journal";
    action: "create";
    workspaceId: string;
    workspacePath: string;
    photosPath: string;
  }>;

/** Photo results */
export type PhotoCreateCommandResult = ContentCommandResult &
  Readonly<{
    entity: "photo";
    action: "create";
    workspaceId: string;
    workspacePath: string;
  }>;

/** Note results */
export type NoteCreateCommandResult = ContentCommandResult &
  Readonly<{
    entity: "note";
    action: "create";
    workspaceId: string;
    workspacePath: string;
  }>;

/** Generic command handler */
export type ContentCommandHandler<TArgs = ParsedDirectCliArgs> = (
  args: TArgs,
) => Promise<ContentCommandResult>;
