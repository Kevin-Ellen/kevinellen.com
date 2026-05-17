// packages/content-cli/src/content/photo/read.photo.content.ts

import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";
import { readCloudflareKvValue } from "@content-cli/cloudflare/kv/read.client.cloudflare.content-cli";

import type { ContentCommandResult } from "@content-cli/commands/types/command.types";
import type { AuthoredPhotoMetadata } from "@shared-types/media/photo/authored.photo.types";
import type { ParsedPhotoReadArgs } from "@content-cli/types/parse-args.cli.types";

export const runReadPhotoCommand = async (
  args: ParsedPhotoReadArgs,
): Promise<ContentCommandResult> => {
  const photoId = args.photoId;

  if (!photoId) {
    throw new Error("Photo read requires --photo-id.");
  }

  const config = loadContentCliConfig(args.env);

  const photo = await readCloudflareKvValue<AuthoredPhotoMetadata>(
    config,
    config.cloudflareKvPhotosNamespaceId,
    `photo:${photoId}`,
  );

  console.log("\nPhoto from KV\n");
  console.log(JSON.stringify(photo, null, 2));
  console.log();

  return { ok: true };
};
