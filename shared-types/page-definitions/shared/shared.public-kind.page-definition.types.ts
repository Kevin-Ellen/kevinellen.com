// shared-types/page-definitions/shared/shared.public-kind.page-definition.types.ts

export const PUBLIC_PAGE_KINDS = [
  "home",
  "static",
  "listing",
  "article",
  "journal",
] as const;

export type PublicPageKind = (typeof PUBLIC_PAGE_KINDS)[number];
