// src/app/config/resources.config.ts

import type { ResourcesConfigAuthored } from "../types/config/resources/resources.config.authored.type";

export const resourcesConfigAuthored = {
  preloads: [
    {
      href: "/assets/fonts/source-sans/sourcesans3-regular.woff2",
      as: "font",
      type: "font/woff2",
      crossorigin: "anonymous",
    },
    {
      href: "/assets/fonts/source-sans/sourcesans3-semibold.woff2",
      as: "font",
      type: "font/woff2",
      crossorigin: "anonymous",
    },
    {
      href: "/assets/fonts/source-serif/sourceserif4-regular.woff2",
      as: "font",
      type: "font/woff2",
      crossorigin: "anonymous",
    },
  ],
} as const satisfies ResourcesConfigAuthored;
