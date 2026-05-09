// packages/content-cli/src/content/photo/rebuild-homepage-strip.photo.content.ts

import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";
import { listCloudflareKvKeys } from "@content-cli/cloudflare/kv/list.client.cloudflare.content-cli";
import { readCloudflareKvValue } from "@content-cli/cloudflare/kv/read.client.cloudflare.content-cli";
import { writeCloudflareKvValue } from "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli";

import {
  HOMEPAGE_STRIP_PHOTO_INDEX_KEY,
  type HomepageStripPhotoIndex,
} from "@shared-types/media/photo/indices.photo.types";
import type { AuthoredPhotoMetadata } from "@shared-types/media/photo/authored.photo.types";
import type { ContentCommandHandler } from "@content-cli/commands/types/command.types";

const PHOTO_KEY_PREFIX = "photo:";

export const runRebuildHomepageStripPhotoCommand: ContentCommandHandler =
  async () => {
    const config = loadContentCliConfig("prod");

    const keys = await listCloudflareKvKeys(
      config,
      config.cloudflareKvPhotosNamespaceId,
      PHOTO_KEY_PREFIX,
    );

    const photoKeys = keys
      .filter((key) => key !== HOMEPAGE_STRIP_PHOTO_INDEX_KEY)
      .sort();

    const photos = await Promise.all(
      photoKeys.map((key) =>
        readCloudflareKvValue<AuthoredPhotoMetadata>(
          config,
          config.cloudflareKvPhotosNamespaceId,
          key,
        ),
      ),
    );

    const photoIds = photos
      .sort((a, b) => {
        const aDate = a.capturedAt ?? "";
        const bDate = b.capturedAt ?? "";

        return bDate.localeCompare(aDate) || a.id.localeCompare(b.id);
      })
      .map((photo) => photo.id);

    const nextIndex: HomepageStripPhotoIndex = {
      photoIds,
      updatedAt: new Date().toISOString(),
    };

    await writeCloudflareKvValue(
      config,
      config.cloudflareKvPhotosNamespaceId,
      HOMEPAGE_STRIP_PHOTO_INDEX_KEY,
      nextIndex,
    );

    console.log(`Rebuilt homepage strip index with ${photoIds.length} photos.`);

    return { ok: true };
  };
