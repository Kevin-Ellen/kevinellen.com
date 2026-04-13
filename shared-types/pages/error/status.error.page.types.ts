// shared-types/content/pages/error/status.error.page.types.ts

export const ERROR_PAGE_STATUSES = [404, 410, 500] as const;

export type ErrorPageStatus = (typeof ERROR_PAGE_STATUSES)[number];
