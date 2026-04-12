// shared-types/content/pages/shared/id.page.types.ts

export type PageIdPublic = string;
export type PageIdError = "error-404" | "error-410" | "error-500";

export type PageId = PageIdPublic | PageIdError;
