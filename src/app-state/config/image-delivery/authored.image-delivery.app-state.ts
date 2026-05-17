// src/app-state/config/image-delivery/authored.image-delivery.app-state.ts

import type { AuthoredImageDeliveryConfig } from "@shared-types/config/image-delivery/authored.image-delivery.types";

export const authoredImageDeliveryConfig: AuthoredImageDeliveryConfig = {
  fullBleed: {
    sizes: "100vw",
    widths: [960, 1280, 1600, 1920],
  },

  contentWidth: {
    sizes: "(min-width: 64rem) 960px, calc(100vw - 2rem)",
    widths: [640, 960, 1280, 1600],
  },

  homepageHero: {
    sizes: "(min-width: 64rem) 800px, calc(100vw - 2rem)",
    widths: [640, 800, 960, 1280],
  },

  homepageJournalFeature: {
    sizes: "(min-width: 64rem) 650px, calc(100vw - 2rem)",
    widths: [640, 960, 1280],
  },

  homepageImageStrip: {
    sizes: "(min-width: 64rem) 325px, (min-width: 768px) 33vw, 85vw",
    widths: [320, 480, 640],
  },

  listingThumbnail: {
    sizes: "(min-width: 48rem) 575px, 100vw",
    widths: [320, 480, 640],
  },

  articleHero: {
    sizes: "(min-width: 64rem) 1250px, calc(100vw - 2rem)",
    widths: [480, 640, 960, 1280, 1600],
  },

  articleInline: {
    sizes: "(min-width: 64rem) 760px, calc(100vw - 2rem)",
    widths: [640, 960, 1280, 1600],
  },
};
