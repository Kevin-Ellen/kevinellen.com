// packages/content-cli/src/content/photo/list.photo.content.ts

import { getPhotoWorkspaceStatus } from "@content-cli/content/photo/workspace.status.photo.content";

import type { ParsedPhotoSimpleArgs } from "@content-cli/types/parse-args.cli.types";
import type { ContentCommandResult } from "@content-cli/commands/types/command.types";

export const runListPhotoCommand = async (
  args: ParsedPhotoSimpleArgs,
): Promise<ContentCommandResult> => {
  const status = await getPhotoWorkspaceStatus(args.env);

  const bucket = status.find((entry) => entry.bucket === args.bucket);

  if (!bucket) {
    throw new Error(`Unknown photo bucket: ${args.bucket}`);
  }

  console.log(`\nPhoto ${args.bucket}\n`);

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
