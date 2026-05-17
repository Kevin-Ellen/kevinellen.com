// shared-types/page-definitions/shared.error.page-definition.types.ts

export const ERROR_PAGE_STATUSES = [
  404, 410, 500,
] as const satisfies readonly number[];
export type ErrorPageStatus = (typeof ERROR_PAGE_STATUSES)[number];
