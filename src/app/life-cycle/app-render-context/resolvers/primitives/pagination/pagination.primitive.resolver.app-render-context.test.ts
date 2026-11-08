// src/app/life-cycle/app-render-context/resolvers/primitives/pagination/pagination.primitive.resolver.app-render-context.test.ts

import { resolvePaginationAppRenderContext } from "./pagination.primitive.resolver.app-render-context";

describe("Pagination primitive AppRenderContext resolver", () => {
  const resolve = (
    currentPage: number,
    totalPages: number,
    basePath = "/journals",
  ) =>
    resolvePaginationAppRenderContext({
      pagination: {
        currentPage,
        totalPages,
      },
      basePath,
    });

  it("creates navigation for the first page", () => {
    expect(resolve(1, 3)).toEqual({
      currentPage: 1,
      totalPages: 3,
      previous: null,
      next: "/journals/page-2",
      pages: [
        {
          number: 1,
          href: "/journals",
          current: true,
        },
        {
          number: 2,
          href: "/journals/page-2",
          current: false,
        },
        {
          number: 3,
          href: "/journals/page-3",
          current: false,
        },
      ],
    });
  });

  it("creates previous and next links for a middle page", () => {
    const result = resolve(2, 4);

    expect(result.previous).toBe("/journals");
    expect(result.next).toBe("/journals/page-3");
  });

  it("omits the next link on the final page", () => {
    const result = resolve(4, 4);

    expect(result.previous).toBe("/journals/page-3");
    expect(result.next).toBeNull();
  });

  it("supports single-page collections", () => {
    const result = resolve(1, 1);

    expect(result).toEqual({
      currentPage: 1,
      totalPages: 1,
      previous: null,
      next: null,
      pages: [
        {
          number: 1,
          href: "/journals",
          current: true,
        },
      ],
    });
  });

  it("marks exactly one page as current", () => {
    const result = resolve(3, 5);

    expect(result.pages.filter((page) => page.current)).toEqual([
      {
        number: 3,
        href: "/journals/page-3",
        current: true,
      },
    ]);
  });

  it("preserves page ordering", () => {
    const result = resolve(2, 5);

    expect(result.pages.map((page) => page.number)).toEqual([1, 2, 3, 4, 5]);
  });

  it("supports topic-specific base paths", () => {
    const result = resolve(2, 3, "/topics/wildlife");

    expect(result.previous).toBe("/topics/wildlife");
    expect(result.next).toBe("/topics/wildlife/page-3");

    expect(result.pages.map((page) => page.href)).toEqual([
      "/topics/wildlife",
      "/topics/wildlife/page-2",
      "/topics/wildlife/page-3",
    ]);
  });

  it("supports an empty pagination collection", () => {
    const result = resolve(1, 0);

    expect(result.pages).toEqual([]);
    expect(result.previous).toBeNull();
    expect(result.next).toBeNull();
  });

  it("creates new page objects on every resolution", () => {
    const first = resolve(1, 2);
    const second = resolve(1, 2);

    expect(first).toEqual(second);
    expect(first).not.toBe(second);
    expect(first.pages).not.toBe(second.pages);
    expect(first.pages[0]).not.toBe(second.pages[0]);
  });
});
