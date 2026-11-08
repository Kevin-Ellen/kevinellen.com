// src/app/life-cycle/app-render/document/page/body/components/pagination/pagination.component.body.page.document.app-render.test.tsx

import { render, screen, within } from "@testing-library/react";

import { PaginationComponent } from "./pagination.component.body.page.document.app-render";

type Pagination = Parameters<typeof PaginationComponent>[0]["pagination"];

describe("PaginationComponent", () => {
  const createPagination = (overrides: Partial<Pagination> = {}): Pagination =>
    ({
      totalPages: 3,
      currentPage: 2,
      previous: "/journal",
      next: "/journal/page-3",
      pages: [
        { number: 1, href: "/journal", current: false },
        { number: 2, href: "/journal/page-2", current: true },
        { number: 3, href: "/journal/page-3", current: false },
      ],
      ...overrides,
    }) as Pagination;

  it.each([0, 1])("omits pagination when totalPages is %i", (totalPages) => {
    const { container } = render(
      <PaginationComponent
        pagination={createPagination({ totalPages })}
        label="Journal pages"
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a named navigation landmark", () => {
    render(
      <PaginationComponent
        pagination={createPagination()}
        label="Journal pages"
      />,
    );

    expect(
      screen.getByRole("navigation", { name: "Journal pages" }),
    ).toHaveClass("c-pagination");
  });

  it("renders all page links", () => {
    render(
      <PaginationComponent
        pagination={createPagination()}
        label="Journal pages"
      />,
    );

    const navigation = screen.getByRole("navigation");

    expect(within(navigation).getByRole("link", { name: "1" })).toHaveAttribute(
      "href",
      "/journal",
    );

    expect(within(navigation).getByRole("link", { name: "2" })).toHaveAttribute(
      "href",
      "/journal/page-2",
    );

    expect(within(navigation).getByRole("link", { name: "3" })).toHaveAttribute(
      "href",
      "/journal/page-3",
    );
  });

  it("marks only the active page as current", () => {
    render(
      <PaginationComponent
        pagination={createPagination()}
        label="Journal pages"
      />,
    );

    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    expect(screen.getByRole("link", { name: "1" })).not.toHaveAttribute(
      "aria-current",
    );

    expect(screen.getByRole("link", { name: "3" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("renders previous and next navigation", () => {
    render(
      <PaginationComponent
        pagination={createPagination()}
        label="Journal pages"
      />,
    );

    const previous = screen.getByRole("link", { name: /Previous/ });
    const next = screen.getByRole("link", { name: /Next/ });

    expect(previous).toHaveAttribute("rel", "prev");
    expect(previous).toHaveAttribute("href", "/journal");

    expect(next).toHaveAttribute("rel", "next");
    expect(next).toHaveAttribute("href", "/journal/page-3");
  });

  it("omits previous when unavailable", () => {
    render(
      <PaginationComponent
        pagination={createPagination({ previous: null })}
        label="Journal pages"
      />,
    );

    expect(screen.queryByRole("link", { name: "Previous" })).toBeNull();
  });

  it("omits next when unavailable", () => {
    render(
      <PaginationComponent
        pagination={createPagination({ next: null })}
        label="Journal pages"
      />,
    );

    expect(screen.queryByRole("link", { name: "Next" })).toBeNull();
  });

  it("preserves the supplied page order", () => {
    const { container } = render(
      <PaginationComponent
        pagination={createPagination()}
        label="Journal pages"
      />,
    );

    expect(
      Array.from(container.querySelectorAll(".c-pagination__pages a")).map(
        (anchor) => anchor.textContent,
      ),
    ).toEqual(["1", "2", "3"]);
  });
});
