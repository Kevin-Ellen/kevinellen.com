// src/config/navigation.config.ts

import type { NavigationConfig } from "@config/navigation.config.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const navigationConfig: NavigationConfig = deepFreeze({
  header: {
    primary: [
      { kind: "page", id: "journal" },
      // { kind: "page", id: "photos" },
      { kind: "page", id: "about" },
    ],
    social: [
      {
        kind: "social",
        id: "github",
        svgId: "icon-github",
        openInNewTab: true,
      },
      {
        kind: "social",
        id: "instagram",
        svgId: "icon-instagram",
        openInNewTab: true,
      },
    ],
  },
  footer: {
    sections: [
      {
        id: "site",
        label: "Site",
        items: [
          { kind: "page", id: "journal" },
          // { kind: "page", id: "photos" },
          { kind: "page", id: "about" },
        ],
      },

      {
        id: "practice",
        label: "Practice",
        items: [
          { kind: "page", id: "about-equipment" },
          // { kind: "page", id: "field-notes" },
        ],
      },

      {
        id: "elsewhere",
        label: "Elsewhere",
        items: [
          { kind: "social", id: "github", openInNewTab: true },
          { kind: "social", id: "instagram", openInNewTab: true },
          { kind: "social", id: "linkedin", openInNewTab: true },
        ],
      },

      {
        id: "legal",
        label: "Legal",
        items: [
          { kind: "page", id: "privacy" },
          { kind: "page", id: "terms" },
          { kind: "page", id: "licensing" },
        ],
      },
    ],
  },
});
