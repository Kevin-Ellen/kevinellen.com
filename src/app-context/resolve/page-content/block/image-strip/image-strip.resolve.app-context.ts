// src/app-context/resolve/page-content/block/image-strip/image-strip.resolve.app-context.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppContextImageStripBlock } from "@shared-types/page-content/block/image-strip/app-context.image-strip.block.types";
import type { AppStateImageStripBlock } from "@shared-types/page-content/block/image-strip/app-state.image-strip.block.types";

const getDailySeed = (): string => new Date().toISOString().slice(0, 10);

const hashString = (value: string): number => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
};

const sortDailyPhotoIds = (photoIds: readonly string[]): readonly string[] => {
  const seed = getDailySeed();

  return [...photoIds].sort(
    (a, b) => hashString(`${seed}:${a}`) - hashString(`${seed}:${b}`),
  );
};

export const appContextResolveImageStripBlock = (
  module: AppStateImageStripBlock,
  context: AppContextPageContentResolverContext,
): AppContextImageStripBlock => {
  const selectedPhotoIds = sortDailyPhotoIds(
    context.homepageStripPhotoIds,
  ).slice(0, module.itemCount);

  const photos = selectedPhotoIds.map((photoId) => {
    const photo = context.resolvePhoto(photoId);

    if (!photo) {
      throw new Error(
        `No AppContext photo resolved for imageStrip photoId: ${photoId}`,
      );
    }

    return photo;
  });

  return {
    ...module,
    photos,
  };
};
