// src/config/footer.config.ts

import type { FooterConfig } from "@config/footer.config.types";
import { deepFreeze } from "@utils/deepFreeze.util";

export const footerConfig: FooterConfig = deepFreeze({
  modules: [
    {
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
    },
    {
      kind: "colophon",
      copyrightName: "Kevin Ellen",
      copyrightYear: 2026,
    },
  ],
});
