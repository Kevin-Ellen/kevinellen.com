// packages/content-cli/src/content/notes/list.note.content.ts

import { getNoteWorkspaceStatus } from "@content-cli/content/notes/workspace.status.note.content";

import type { ContentCommandResult } from "@content-cli/commands/types/command.types";
import type { ParsedNoteDirectCliArgs } from "@content-cli/types/parse-args.cli.types";
import type { ContentWorkspaceBucket } from "@content-cli/types/workspace.content-cli.types";

type NoteListCommandResult = Readonly<
  ContentCommandResult & {
    ok: true;
    entity: "note";
    action: "list";
    env: ParsedNoteDirectCliArgs["env"];
    bucket: ContentWorkspaceBucket;
    workspaceIds: readonly string[];
  }
>;

export const runListNoteCommand = async (
  args: ParsedNoteDirectCliArgs,
): Promise<NoteListCommandResult> => {
  const status = await getNoteWorkspaceStatus(args.env);

  const bucket = status.find((entry) => entry.bucket === args.bucket);

  if (!bucket) {
    throw new Error(`Unknown note bucket: ${args.bucket}`);
  }

  console.log(`\nNote ${args.bucket} (${args.env})\n`);

  if (bucket.workspaceIds.length === 0) {
    console.log("  none\n");

    return {
      ok: true,
      entity: "note",
      action: "list",
      env: args.env,
      bucket: args.bucket,
      workspaceIds: [],
    };
  }

  for (const workspaceId of bucket.workspaceIds) {
    console.log(`  • ${workspaceId}`);
  }

  console.log();

  return {
    ok: true,
    entity: "note",
    action: "list",
    env: args.env,
    bucket: args.bucket,
    workspaceIds: bucket.workspaceIds,
  };
};
