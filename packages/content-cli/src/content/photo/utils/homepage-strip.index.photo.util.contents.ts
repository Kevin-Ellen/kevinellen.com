// packages/content-cli/src/content/photo/utils/homepage-strip.index.photo.util.contents.ts

import type { ContentCliConfig } from "@content-cli/config/load.content-cli.config";
import type { PhotoId } from "@shared-types/media/photo/id.photo.types";
import {
  HOMEPAGE_STRIP_PHOTO_INDEX_KEY,
  type HomepageStripPhotoIndex,
} from "@shared-types/media/photo/indices.photo.types";

import { writeCloudflareKvValue } from "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli";
import { readCloudflareKvValue } from "@content-cli/cloudflare/kv/read.client.cloudflare.content-cli";

export const updateHomepageStripPhotoIndex = async (
  config: ContentCliConfig,
  publishedPhotoIds: readonly PhotoId[],
): Promise<void> => {
  if (publishedPhotoIds.length === 0) {
    return;
  }

  const existing = await readCloudflareKvValue<HomepageStripPhotoIndex>(
    config,
    config.cloudflareKvPhotosNamespaceId,
    HOMEPAGE_STRIP_PHOTO_INDEX_KEY,
  );

  const existingPhotoIds = existing?.photoIds ?? [];

  const existingSet = new Set(existingPhotoIds);
  const uniqueIncoming = Array.from(new Set(publishedPhotoIds));

  const photoIds = [
    ...existingPhotoIds,
    ...uniqueIncoming.filter((id) => !existingSet.has(id)),
  ];

  if (photoIds.length === existingPhotoIds.length) {
    return;
  }

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
};
