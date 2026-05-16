// shared-types/media/render-image/authored.render-image.types.ts

import type { PhotoId } from "@shared-types/media/photo/id.photo.types";

export type AuthoredPhotoReference = Readonly<{
  id: PhotoId;
  sizes?: string;
  widths?: readonly number[];
}>;
