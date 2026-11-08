// src/shared/utilities/paginate/paginate.utility.shared.ts

export type PaginationResult<T> = Readonly<{
  items: readonly T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}>;

type Input<T> = Readonly<{
  items: readonly T[];
  requestedPage: number;
  pageSize: number;
}>;

export const paginate = <T>({
  items,
  requestedPage,
  pageSize,
}: Input<T>): PaginationResult<T> | null => {
  if (!Number.isSafeInteger(pageSize) || pageSize < 1) {
    throw new Error("Pagination pageSize must be a positive integer");
  }

  if (!Number.isSafeInteger(requestedPage) || requestedPage < 1) {
    return null;
  }

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (requestedPage > totalPages) {
    return null;
  }

  const start = (requestedPage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    currentPage: requestedPage,
    totalPages,
    totalItems,
    pageSize,
  };
};
