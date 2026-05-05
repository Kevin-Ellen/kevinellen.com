// shared-types/media/photo/indices.photo.types.ts

import type { PhotoId } from "@shared-types/media/photo/id.photo.types";

export const HOMEPAGE_STRIP_PHOTO_INDEX_KEY = "photo:index:homepage-strip";

type BasePhotoIndex = Readonly<{
  photoIds: readonly PhotoId[];
  updatedAt: string;
}>;

export type HomepageStripPhotoIndex = BasePhotoIndex;
