// packages/content-cli/src/content/journal/list.journal.content.ts

import { getJournalWorkspaceStatus } from "@content-cli/content/journal/workspace.status.journal.content";

import type { ContentCommandHandler } from "@content-cli/commands/types/command.types";

export const runListJournalCommand: ContentCommandHandler = async (args) => {
  const status = await getJournalWorkspaceStatus(args.env);
  const bucket = status.find((entry) => entry.bucket === args.bucket);

  if (!bucket) {
    throw new Error(`Unknown journal bucket: ${args.bucket}`);
  }

  console.log(`\nJournal ${args.bucket} (${args.env})\n`);

  if (bucket.workspaceIds.length === 0) {
    console.log("  none\n");
    return { ok: true };
  }

  for (const workspaceId of bucket.workspaceIds) {
    console.log(`  • ${workspaceId}`);
  }

  console.log();

  return { ok: true };
};
