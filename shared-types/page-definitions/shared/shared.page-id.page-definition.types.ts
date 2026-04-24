// shared-types/page-definitions/shared.page-id.page-definition.types.ts

export type PageIdPublic = string;
export type PageIdError = "error-404" | "error-410" | "error-500";

export type PageId = PageIdPublic | PageIdError;
