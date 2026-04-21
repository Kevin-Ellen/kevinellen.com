// src/app-state/config/navigation/authored.footer.navigation.app-state.ts

import type { AuthoredFooterNavigation } from "@shared-types/config/navigation/footer/authored.footer.navigation.types";
import type { PageId } from "@shared-types/pages/shared/id.shared.page.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const authoredFooterNavigation: AuthoredFooterNavigation = deepFreeze({
  sections: [
    {
      id: "site",
      label: "Site",
      items: [{ kind: "internal", id: "about" as PageId, text: "About" }],
    },

    {
      id: "practice",
      label: "Practice",
      items: [
        {
          kind: "internal",
          id: "about-equipment" as PageId,
          text: "Equipment",
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
        { kind: "internal", id: "privacy" as PageId, text: "Privacy" },
        { kind: "internal", id: "terms" as PageId, text: "Terms of Use" },
        {
          kind: "internal",
          id: "licensing" as PageId,
          text: "Photo Licensing",
        },
      ],
    },
  ],
});
