import type { StructuredDataNode } from "@app/config/structuredData.config.types";

/* -------------------------------------------------------------------------- */
/* Social media                                                               */
/* -------------------------------------------------------------------------- */

export type SocialMediaPlatformId = "gitHub" | "instagram" | "linkedIn";

export type SocialMediaItem = {
  readonly id: SocialMediaPlatformId;
  readonly label: string;
  readonly href: string;
  readonly iconId: string;
};

export type SocialMediaMap = Record<SocialMediaPlatformId, SocialMediaItem>;

/* -------------------------------------------------------------------------- */
/* Navigation items (discriminated union)                                     */
/* -------------------------------------------------------------------------- */

export type PageNavItem = {
  readonly kind: "page";
  readonly id: string;
  readonly label?: string;
  readonly iconId?: string;
};

export type SocialNavItem = {
  readonly kind: "social";
  readonly id: SocialMediaPlatformId;
};

export type ExternalNavItem = {
  readonly kind: "external";
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly iconId?: string;
};

export type NavigationItemConfig =
  | PageNavItem
  | SocialNavItem
  | ExternalNavItem;

/* -------------------------------------------------------------------------- */
/* Header navigation                                                          */
/* -------------------------------------------------------------------------- */

export type HeaderNavigationConfig = {
  readonly primary: readonly NavigationItemConfig[];
  readonly social: readonly NavigationItemConfig[];
};

/* -------------------------------------------------------------------------- */
/* Footer navigation                                                          */
/* -------------------------------------------------------------------------- */

export type FooterSectionKind = "site" | "practice" | "elsewhere" | "legal";

export type FooterSectionConfig = {
  readonly id: FooterSectionKind;
  readonly label: string;
  readonly items: readonly NavigationItemConfig[];
};

export type FooterNavigationConfig = {
  readonly sections: readonly FooterSectionConfig[];
};

export type FooterAffiliation = {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly svgId: string;
};

FooterLayoutConfig = {
  modules: FooterModule[]
}

/* -------------------------------------------------------------------------- */
/* Site config                                                                */
/* -------------------------------------------------------------------------- */

export type SiteConfig = {
  readonly language: string;
  readonly siteName: string;
  readonly siteUrl: string;
  readonly socialMedia: SocialMediaMap;
  readonly structuredData: readonly StructuredDataNode[];

  readonly navigation: {
    readonly header: HeaderNavigationConfig;
    readonly footer: FooterNavigationConfig;
  };
  readonly footerLayout: FooterLayoutConfig;
};
