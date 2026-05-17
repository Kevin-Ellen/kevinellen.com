// packages/content-cli/src/content/journal/status.journal.content.ts

import type { ParsedJournalDirectCliArgs } from "@content-cli/types/parse-args.cli.types";
import type { ContentCommandResult } from "@content-cli/commands/types/command.types";
import { getJournalWorkspaceStatus } from "@content-cli/content/journal/workspace.status.journal.content";

export const runStatusJournalCommand = async (
  args: ParsedJournalDirectCliArgs,
): Promise<ContentCommandResult> => {
  const status = await getJournalWorkspaceStatus(args.env);

  console.log(`\nJournal status (${args.env})\n`);

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
