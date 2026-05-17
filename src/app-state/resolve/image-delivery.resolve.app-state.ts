// src/app-state/resolve/image-delivery.resolve.app-state.ts

import type { AppStateImageDeliveryConfig } from "@shared-types/config/image-delivery/app-state.image-delivery.types";

import { authoredImageDeliveryConfig } from "@app-state/config/image-delivery/authored.image-delivery.app-state";

export const appStateResolveImageDelivery =
  authoredImageDeliveryConfig satisfies AppStateImageDeliveryConfig;
