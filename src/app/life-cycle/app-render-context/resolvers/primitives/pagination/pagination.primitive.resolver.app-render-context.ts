// src/app/life-cycle/app-render-context/resolvers/primitives/pagination/pagination.primitive.resolver.app-render-context.ts

type PaginationInput = Readonly<{
  currentPage: number;
  totalPages: number;
}>;

type Input = Readonly<{
  pagination: PaginationInput;
  basePath: string;
}>;

export const resolvePaginationAppRenderContext = ({
  pagination,
  basePath,
}: Input) => {
  const { currentPage, totalPages } = pagination;

  const href = (page: number): string =>
    page === 1 ? basePath : `${basePath}/page-${page}`;

  return {
    currentPage,
    totalPages,
    previous: currentPage > 1 ? href(currentPage - 1) : null,
    next: currentPage < totalPages ? href(currentPage + 1) : null,
    pages: Array.from({ length: totalPages }, (_, index) => {
      const number = index + 1;

      return {
        number,
        href: href(number),
        current: number === currentPage,
      };
    }),
  };
};
