// shared-types/config/image-delivery/authored.image-delivery.types.ts

import type { ImageDeliveryProfileId } from "@shared-types/config/image-delivery/id.image-delivery.types";

export type AuthoredImageDeliveryProfile = Readonly<{
  sizes: string;
  widths: readonly number[];
}>;

export type AuthoredImageDeliveryConfig = Readonly<{
  [K in ImageDeliveryProfileId]: AuthoredImageDeliveryProfile;
}>;
