// src/app/config/footer.config.ts

import type { FooterConfigAuthored } from "../types/config/footer/footer.config.authored.type";

export const footerConfigAuthored = {
  conservation: {
    heading: "Conservation",
    conservations: [
      {
        id: "rspb",
        link: {
          kind: "external",
          label: "RSPB",
          ariaLabel: "Visit RSPB",
          href: "https://www.rspb.org.uk/",
          target: "_blank",
          rel: ["noopener"],
          icon: {
            id: "logo-rspb",
          },
        },
      },
      {
        id: "national-trust",
        link: {
          kind: "external",
          label: "National Trust",
          ariaLabel: "Visit National Trust",
          href: "https://www.nationaltrust.org.uk/",
          target: "_blank",
          rel: ["noopener"],
          icon: {
            id: "logo-national-trust",
          },
        },
      },
      {
        id: "vogelbescherming-nederland",
        link: {
          kind: "external",
          label: "Vogelbescherming Nederland",
          ariaLabel: "Visit Vogelbescherming Nederland",
          href: "https://www.vogelbescherming.nl/",
          target: "_blank",
          rel: ["noopener"],
          icon: {
            id: "logo-vogelbescherming-nederland",
          },
        },
      },
      {
        id: "essex-wildlife-trust",
        link: {
          kind: "external",
          label: "Essex Wildlife Trust",
          ariaLabel: "Visit Essex Wildlife Trust",
          href: "https://www.essexwt.org.uk/",
          target: "_blank",
          rel: ["noopener"],
          icon: {
            id: "logo-essex-wildlife-trust",
          },
        },
      },
    ],
  },

  colophon: {
    rights: "All rights reserved",
  },
} as const satisfies FooterConfigAuthored;
