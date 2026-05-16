// src/app-context/resolve/page-content/shared/photo-reference.resolve.app-context.ts

import type { AppContextResolvedPhoto } from "@shared-types/media/render-image/app-context.render-image.types";
import type { AppContextImageDeliveryProfile } from "@shared-types/config/image-delivery/app-context.image-delivery.types";
import type { AppContextPhotoMetadata } from "@shared-types/media/photo/app-context.photo.types";
import type { AuthoredPhotoReference } from "@shared-types/media/render-image/authored.render-image.types";

export const appContextResolvePhotoReference = ({
  reference,
  photo,
  delivery,
}: Readonly<{
  reference: AuthoredPhotoReference;
  photo: AppContextPhotoMetadata;
  delivery: AppContextImageDeliveryProfile;
}>): AppContextResolvedPhoto => ({
  metadata: photo,
  delivery: {
    sizes:
      reference.sizes && reference.sizes.trim().length > 0
        ? reference.sizes
        : delivery.sizes,

    widths:
      reference.widths && reference.widths.length > 0
        ? reference.widths
        : delivery.widths,
  },
});
