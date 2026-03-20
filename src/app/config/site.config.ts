// src/app/config/site.config.ts

import type {
  SiteConfig,
  SocialMediaLinks,
} from "@app/config/site.config.types";

import { buildSiteStructuredData } from "@app/config/structuredData.config";

const socialMedia: SocialMediaLinks = {
  gitHub: "https://github.com/Kevin-Ellen",
  instagram: "https://www.instagram.com/photography.mallard",
  linkedIn: "https://www.linkedin.com/in/kevinellen/",
};

export const siteConfig: SiteConfig = {
  language: "en-GB",
  siteName: "Kevin Ellen",
  siteUrl: "https://kevinellen.com",
  socialMedia,
  structuredData: buildSiteStructuredData(socialMedia),
};
