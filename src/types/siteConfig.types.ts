// src/types/siteConfig.types.ts

import type { DocFooter } from "@types-src/appPage.types";

export type SocialMediaLinks = Record<
  "gitHub" | "instagram" | "linkedIn",
  string
>;

export type SiteConfig = {
  language: string;
  siteName: string;
  siteUrl: string;
  docFooter: DocFooter;
  socialMedia: SocialMediaLinks;
};
