// packages/content-cli/src/content/journal/list.journal.content.ts

import { getJournalWorkspaceStatus } from "@content-cli/content/journal/workspace.status.journal.content";

import type { ContentCommandResult } from "@content-cli/commands/types/command.types";
import type { ParsedJournalDirectCliArgs } from "@content-cli/types/parse-args.cli.types";
import type { ContentWorkspaceBucket } from "@content-cli/types/workspace.content-cli.types";

type JournalListCommandResult = Readonly<
  ContentCommandResult & {
    ok: true;
    entity: "journal";
    action: "list";
    env: ParsedJournalDirectCliArgs["env"];
    bucket: ContentWorkspaceBucket;
    workspaceIds: readonly string[];
  }
>;

export const runListJournalCommand = async (
  args: ParsedJournalDirectCliArgs,
): Promise<JournalListCommandResult> => {
  const status = await getJournalWorkspaceStatus(args.env);
  const bucket = status.find((entry) => entry.bucket === args.bucket);

  if (!bucket) {
    throw new Error(`Unknown journal bucket: ${args.bucket}`);
  }

  console.log(`\nJournal ${args.bucket} (${args.env})\n`);

  if (bucket.workspaceIds.length === 0) {
    console.log("  none\n");

    return {
      ok: true,
      entity: "journal",
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
    entity: "journal",
    action: "list",
    env: args.env,
    bucket: args.bucket,
    workspaceIds: bucket.workspaceIds,
  };
};
