// src/app/config/site.config.ts

import type { SiteConfig, SocialMediaMap } from "@app/config/site.config.types";

import { buildSiteStructuredData } from "@app/config/structuredData.config";

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

const headerNavigation = {
  primary: ["home", "journal", "photos", "about"] as const,
  social: ["gitHub", "instagram", "linkedIn"] as const,
};

const footerNavigation = {
  sections: [
    {
      id: "site",
      label: "Site",
      items: ["home", "journal", "photos", "about"],
    },
    {
      id: "practice",
      label: "Practice",
      items: ["technology", "architecture"],
    },
    {
      id: "elsewhere",
      label: "Elsewhere",
      items: ["gitHub", "instagram", "linkedIn"],
    },
    {
      id: "conservation",
      label: "Conservation",
      items: ["rspb", "wwf", "wildlife-trust"],
    },
    {
      id: "legal",
      label: "Legal",
      items: ["privacy", "terms", "cookies"],
    },
  ] as const,
};

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
};
