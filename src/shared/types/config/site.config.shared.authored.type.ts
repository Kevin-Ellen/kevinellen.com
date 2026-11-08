// src/shared/types/config/site.config.shared.authored.type.ts

export type SiteConfigAuthored = Readonly<{
  name: string;
  language: string;
  locale: string;
  titleSuffix: string;
  description: string;
  themeColor: string;
  icons: Readonly<{
    favicon: string;
    svg: string;
    appleTouch: string;
  }>;
  manifest: string;
}>;
