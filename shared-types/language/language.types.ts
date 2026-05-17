// shared-types/language/language.types.ts

export const SITE_LANGUAGES = ["en-GB"] as const;

export type SiteLanguage = (typeof SITE_LANGUAGES)[number];
