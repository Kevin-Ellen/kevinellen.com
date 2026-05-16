// src/app-state/config/navigation/authored.footer.navigation.app-state.ts

import type { AuthoredFooterNavigation } from "@shared-types/config/navigation/footer/authored.footer.navigation.types";
import type { PageIdPublic } from "@shared-types/page-definitions/shared/shared.page-id.page-definition.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const authoredFooterNavigation: AuthoredFooterNavigation = deepFreeze({
  sections: [
    {
      id: "site",
      label: "Site",
      items: [
        { kind: "internal", id: "journal" as PageIdPublic, text: "Journal" },
        { kind: "internal", id: "notes" as PageIdPublic, text: "Notes" },
        { kind: "internal", id: "about" as PageIdPublic, text: "About" },
      ],
    },

    {
      id: "practice",
      label: "Practice",
      items: [
        {
          kind: "internal",
          id: "about-equipment" as PageIdPublic,
          text: "Equipment",
        },
        {
          kind: "internal",
          id: "about-technology" as PageIdPublic,
          text: "Technology",
        },
      ],
    },

    {
      id: "elsewhere",
      label: "Elsewhere",
      items: [
        { kind: "social", id: "github", openInNewTab: true, text: "GitHub" },
        {
          kind: "social",
          id: "instagram",
          openInNewTab: true,
          text: "Instagram",
        },
        {
          kind: "social",
          id: "linkedin",
          openInNewTab: true,
          text: "LinkedIn",
        },
      ],
    },

    {
      id: "legal",
      label: "Legal",
      items: [
        { kind: "internal", id: "privacy" as PageIdPublic, text: "Privacy" },
        { kind: "internal", id: "terms" as PageIdPublic, text: "Terms of Use" },
        {
          kind: "internal",
          id: "licensing" as PageIdPublic,
          text: "Photo Licensing",
        },
      ],
    },
  ],
});
