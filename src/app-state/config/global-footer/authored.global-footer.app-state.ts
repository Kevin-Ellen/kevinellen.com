// src/app-state.config.global-footer/authored.global-footer.app-state.ts

import type {
  AuthoredGlobalFooter,
  AuthoredGlobalFooterAffiliations,
} from "@shared-types/page-content/site/global-footer/authored.global-footer.page-content.types";

import { deepFreeze } from "@utils/deepFreeze.util";

const affiliations: AuthoredGlobalFooterAffiliations = deepFreeze({
  kind: "affiliations",
  title: "Conservation",
  description:
    "Supporting organisations that protect habitats, species, and access to nature.",
  items: [
    {
      id: "rspb",
      label: "RSPB",
      href: "https://www.rspb.org.uk/",
      svgId: "logo-rspb",
    },
    {
      id: "national-trust",
      label: "National Trust",
      href: "https://www.nationaltrust.org.uk/",
      svgId: "logo-national-trust",
    },
    {
      id: "vogelbescherming-nederland",
      label: "Vogelbescherming Nederland",
      href: "https://www.vogelbescherming.nl/",
      svgId: "logo-vogelbescherming-nederland",
    },
  ],
});

export const appStateGlobalFooterAuthored: AuthoredGlobalFooter = deepFreeze({
  affiliations,
});
