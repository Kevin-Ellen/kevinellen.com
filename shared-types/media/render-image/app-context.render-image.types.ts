// shared-types/media/render-image/app-context.render-image.types.ts

import type { AppContextImageDeliveryProfile } from "@shared-types/config/image-delivery/app-context.image-delivery.types";
import type { AppContextPhotoMetadata } from "@shared-types/media/photo/app-context.photo.types";

export type AppContextResolvedPhoto = Readonly<{
  metadata: AppContextPhotoMetadata;
  delivery: AppContextImageDeliveryProfile;
}>;
