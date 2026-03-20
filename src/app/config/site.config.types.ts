// src/app/config/site.config.types.ts

import type { StructuredDataNode } from "@app/config/structuredData.config.types";

export type SocialMediaLinks = Record<
  "gitHub" | "instagram" | "linkedIn",
  string
>;

export type SiteConfig = {
  language: string;
  siteName: string;
  siteUrl: string;
  socialMedia: SocialMediaLinks;
  structuredData: StructuredDataNode[];
};
