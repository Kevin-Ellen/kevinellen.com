// src/shared/types/pagination/pagination.shared.type.ts

export type PaginationMetadata = Readonly<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}>;
