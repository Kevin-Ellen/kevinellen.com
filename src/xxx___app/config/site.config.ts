// src/app/config/site.config.ts

import type { SiteConfig, SocialMediaMap } from "@app/config/site.config.types";

import { buildSiteStructuredData } from "@app/config/structuredData.config";

/* -------------------------------------------------------------------------- */
/* Social media                                                               */
/* -------------------------------------------------------------------------- */

const socialMedia: SocialMediaMap = {
  gitHub: {
    id: "gitHub",
    label: "GitHub",
    href: "https://github.com/Kevin-Ellen",
    iconId: "icon-github",
  },
  instagram: {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/photography.mallard",
    iconId: "icon-instagram",
  },
  linkedIn: {
    id: "linkedIn",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/kevinellen/",
    iconId: "icon-linkedin",
  },
};

/* -------------------------------------------------------------------------- */
/* Header navigation                                                          */
/* -------------------------------------------------------------------------- */

const headerNavigation = {
  primary: [
    { kind: "page", id: "home", iconId: "icon-home" },
    { kind: "page", id: "journal", label: "Journal" },
    { kind: "page", id: "photos", label: "Photos" },
    { kind: "page", id: "about", label: "About" },
  ] as const,

  social: [
    { kind: "social", id: "gitHub" },
    { kind: "social", id: "instagram" },
    { kind: "social", id: "linkedIn" },
  ] as const,
};

/* -------------------------------------------------------------------------- */
/* Footer navigation                                                          */
/* -------------------------------------------------------------------------- */

const footerNavigation = {
  sections: [
    {
      id: "site",
      label: "Site",
      items: [
        { kind: "page", id: "home" },
        { kind: "page", id: "journal" },
        { kind: "page", id: "photos" },
        { kind: "page", id: "about" },
      ],
    },

    {
      id: "practice",
      label: "Practice",
      items: [
        { kind: "page", id: "technology" },
        { kind: "page", id: "architecture" },
      ],
    },

    {
      id: "elsewhere",
      label: "Elsewhere",
      items: [
        { kind: "social", id: "gitHub" },
        { kind: "social", id: "instagram" },
        { kind: "social", id: "linkedIn" },
      ],
    },
    {
      id: "legal",
      label: "Legal",
      items: [
        { kind: "page", id: "privacy" },
        { kind: "page", id: "terms" },
        { kind: "page", id: "cookies" },
      ],
    },
  ] as const,
};

const footerLayout = {
  affiliations: [
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
      id: "vogel-bescherming-nederland",
      label: "Vogelbescherming Nederland",
      href: "https://www.vogelbescherming.nl/",
      svgId: "logo-vogelbescherming-nederland",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* Final site config                                                          */
/* -------------------------------------------------------------------------- */

export const siteConfig: SiteConfig = {
  language: "en-GB",
  siteName: "Kevin Ellen",
  siteUrl: "https://kevinellen.com",

  socialMedia,

  structuredData: buildSiteStructuredData(socialMedia),

  navigation: {
    header: headerNavigation,
    footer: footerNavigation,
  },

  footerLayout: footerLayout,
};
