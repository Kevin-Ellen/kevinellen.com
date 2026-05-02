// tests/src/app-render-context/resolve/body-content/shared/pagination.resolve.app-render-context.test.ts

import { resolvePaginationAppRenderContext } from "@app-render-context/resolve/body-content/shared/pagination.resolve.app-render-context";

describe("resolvePaginationAppRenderContext", () => {
  it("adds labels to pagination while preserving original fields", () => {
    const pagination = {
      currentPage: 2,
      totalPages: 5,
      baseHref: "/journal",
    };

    const result = resolvePaginationAppRenderContext(pagination as never);

    expect(result).toEqual({
      ...pagination,
      label: "Page 2 of 5",
      previousLabel: "← Newer entries",
      nextLabel: "Older entries →",
    });
  });

  it("handles first page correctly (no logic branching, just labels)", () => {
    const pagination = {
      currentPage: 1,
      totalPages: 3,
      baseHref: "/journal",
    };

    const result = resolvePaginationAppRenderContext(pagination as never);

    expect(result.label).toBe("Page 1 of 3");
    expect(result.previousLabel).toBe("← Newer entries");
    expect(result.nextLabel).toBe("Older entries →");
  });

  it("handles single page listings", () => {
    const pagination = {
      currentPage: 1,
      totalPages: 1,
      baseHref: "/journal",
    };

    const result = resolvePaginationAppRenderContext(pagination as never);

    expect(result.label).toBe("Page 1 of 1");
  });
});
