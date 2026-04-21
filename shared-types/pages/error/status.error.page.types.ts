// shared-types/content/pages/error/status.error.page.types.ts

export const ERROR_PAGE_STATUSES = [
  404, 410, 500,
] as const satisfies readonly number[];

export type ErrorPageStatus = (typeof ERROR_PAGE_STATUSES)[number];
