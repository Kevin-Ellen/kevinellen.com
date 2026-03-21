// src/app/config/site.config.types.ts

import type { StructuredDataNode } from "@app/config/structuredData.config.types";

export type SocialMediaPlatformId = "gitHub" | "instagram" | "linkedIn";

export type SocialMediaItem = {
  readonly id: SocialMediaPlatformId;
  readonly label: string;
  readonly href: string;
  readonly iconId: string;
};

export type SocialMediaMap = Record<SocialMediaPlatformId, SocialMediaItem>;

export type FooterSectionKind =
  | "site"
  | "practice"
  | "elsewhere"
  | "conservation"
  | "legal";

export type HeaderNavigationConfig = {
  primary: readonly string[]; // PageId[]
  social: readonly (keyof SocialMediaMap)[];
};

export type FooterSectionConfig = {
  id: FooterSectionKind;
  label: string;
  items: readonly string[]; // PageId[] OR social ids OR external ids
};

export type FooterNavigationConfig = {
  sections: readonly FooterSectionConfig[];
};

export type SiteConfig = {
  language: string;
  siteName: string;
  siteUrl: string;
  socialMedia: SocialMediaMap;
  structuredData: StructuredDataNode[];

  navigation: {
    header: HeaderNavigationConfig;
    footer: FooterNavigationConfig;
  };
};
