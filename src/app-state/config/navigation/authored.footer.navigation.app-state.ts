// src/app-state/config/navigation/authored.footer.navigation.app-state.ts

import type { AuthoredNavigation } from "@shared-types/config/navigation/authored.navigation.types";
import type { PageId } from "@shared-types/pages/shared/id.shared.page.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const authoredFooterNavigation: AuthoredNavigation["footer"] =
  deepFreeze({
    sections: [
      {
        id: "site",
        label: "Site",
        items: [
          { kind: "internal", id: "journal" as PageId },
          // { kind: "page", id: "photos" },
          { kind: "internal", id: "about" as PageId },
        ],
      },

      {
        id: "practice",
        label: "Practice",
        items: [
          { kind: "internal", id: "about-equipment" as PageId },
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
          { kind: "internal", id: "privacy" as PageId },
          { kind: "internal", id: "terms" as PageId },
          { kind: "internal", id: "licensing" as PageId },
        ],
      },
    ],
  });
