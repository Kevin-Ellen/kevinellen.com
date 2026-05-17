// packages/content-cli/src/content/notes/status.note.content.ts

import type { ParsedNoteDirectCliArgs } from "@content-cli/types/parse-args.cli.types";
import type { ContentCommandResult } from "@content-cli/commands/types/command.types";

import { getNoteWorkspaceStatus } from "@content-cli/content/notes/workspace.status.note.content";

export const runStatusNoteCommand = async (
  args: ParsedNoteDirectCliArgs,
): Promise<ContentCommandResult> => {
  const status = await getNoteWorkspaceStatus(args.env);

  console.log(`\nNote status (${args.env})\n`);

  for (const bucket of status) {
    console.log(`${bucket.bucket}: ${bucket.count}`);

    for (const workspaceId of bucket.workspaceIds) {
      console.log(`  • ${workspaceId}`);
    }

    if (bucket.workspaceIds.length === 0) {
      console.log("  none");
    }

    console.log();
  }

  return { ok: true };
};
