// packages/content-cli/src/content/journal/status.journal.content.ts

import { getJournalWorkspaceStatus } from "@content-cli/content/journal/workspace.status.journal.content";

import type { ContentCommandHandler } from "@content-cli/commands/types/command.types";

export const runStatusJournalCommand: ContentCommandHandler = async (args) => {
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
