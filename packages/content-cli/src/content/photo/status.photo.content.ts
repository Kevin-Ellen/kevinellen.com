// packages/content-cli/src/content/photo/status.photo.content.ts

import { getPhotoWorkspaceStatus } from "@content-cli/content/photo/workspace.status.photo.content";

import type { ContentCommandHandler } from "@content-cli/commands/types/command.types";

export const runStatusPhotoCommand: ContentCommandHandler = async (args) => {
  const status = await getPhotoWorkspaceStatus(args.env);

  console.log(`\nPhoto status\n`);

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
