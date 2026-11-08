// src/app/life-cycle/app-render/document/page/body/breadcrumbs/breadcrumbs.body.page.document.app-render.test.tsx

import { render, screen, within } from "@testing-library/react";

import { Breadcrumbs } from "./breadcrumbs.body.page.document.app-render";

type Breadcrumb = Parameters<typeof Breadcrumbs>[0]["breadcrumbs"][number];

describe("Breadcrumbs AppRender", () => {
  const createBreadcrumb = (label: string, href: string): Breadcrumb => ({
    label,
    href,
    variant: null,
    icon: null,
    ariaLabel: null,
    title: null,
    target: null,
    rel: null,
  });

  const createBreadcrumbs = (): readonly Breadcrumb[] => [
    createBreadcrumb("Home", "/"),
    createBreadcrumb("Journal", "/journal"),
    createBreadcrumb("Viru Bog", "/journal/viru-bog"),
  ];

  it("renders an accessible breadcrumb navigation", () => {
    render(<Breadcrumbs breadcrumbs={createBreadcrumbs()} />);

    const navigation = screen.getByRole("navigation", {
      name: "Breadcrumb",
    });

    expect(navigation).toHaveClass("m-breadcrumbs", "l-frame");

    expect(within(navigation).getByRole("list")).toHaveClass(
      "m-breadcrumbs__list",
    );
  });

  it("renders breadcrumbs in their original order", () => {
    render(<Breadcrumbs breadcrumbs={createBreadcrumbs()} />);

    const items = screen.getAllByRole("listitem");

    expect(items).toHaveLength(3);

    expect(items.map((item) => item.textContent)).toEqual([
      "Home",
      "Journal",
      "Viru Bog",
    ]);

    items.forEach((item) => {
      expect(item).toHaveClass("m-breadcrumbs__item");
    });
  });

  it("renders preceding breadcrumbs as links", () => {
    render(<Breadcrumbs breadcrumbs={createBreadcrumbs()} />);

    const home = screen.getByRole("link", { name: "Home" });
    const journal = screen.getByRole("link", { name: "Journal" });

    expect(home).toHaveAttribute("href", "/");
    expect(journal).toHaveAttribute("href", "/journal");

    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("renders the final breadcrumb as plain text", () => {
    render(<Breadcrumbs breadcrumbs={createBreadcrumbs()} />);

    const items = screen.getAllByRole("listitem");
    const current = items[2];

    expect(current).toHaveTextContent("Viru Bog");
    expect(current.querySelector("span")).toHaveTextContent("Viru Bog");
    expect(current.querySelector("a")).toBeNull();

    expect(screen.queryByRole("link", { name: "Viru Bog" })).toBeNull();
  });

  it("marks only the final breadcrumb as the current page", () => {
    render(<Breadcrumbs breadcrumbs={createBreadcrumbs()} />);

    const items = screen.getAllByRole("listitem");

    expect(items[0]).not.toHaveAttribute("aria-current");
    expect(items[1]).not.toHaveAttribute("aria-current");
    expect(items[2]).toHaveAttribute("aria-current", "page");
  });

  it("supports a single breadcrumb", () => {
    render(<Breadcrumbs breadcrumbs={[createBreadcrumb("Home", "/")]} />);

    const items = screen.getAllByRole("listitem");

    expect(items).toHaveLength(1);
    expect(items[0]).toHaveAttribute("aria-current", "page");
    expect(items[0]).toHaveTextContent("Home");

    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("supports an empty breadcrumb collection", () => {
    render(<Breadcrumbs breadcrumbs={[]} />);

    const navigation = screen.getByRole("navigation", {
      name: "Breadcrumb",
    });

    expect(within(navigation).getByRole("list")).toBeEmptyDOMElement();

    expect(within(navigation).queryAllByRole("listitem")).toHaveLength(0);

    expect(within(navigation).queryAllByRole("link")).toHaveLength(0);
  });

  it("does not mark intermediate links as the current page", () => {
    render(<Breadcrumbs breadcrumbs={createBreadcrumbs()} />);

    const links = screen.getAllByRole("link");

    links.forEach((link) => {
      expect(link).not.toHaveAttribute("aria-current");
    });
  });

  it("updates the current page when breadcrumbs change", () => {
    const { rerender } = render(
      <Breadcrumbs breadcrumbs={createBreadcrumbs()} />,
    );

    rerender(
      <Breadcrumbs
        breadcrumbs={[
          createBreadcrumb("Home", "/"),
          createBreadcrumb("Journal", "/journal"),
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );

    expect(screen.queryByRole("link", { name: "Journal" })).toBeNull();

    const items = screen.getAllByRole("listitem");

    expect(items).toHaveLength(2);
    expect(items[1]).toHaveAttribute("aria-current", "page");
    expect(items[1]).toHaveTextContent("Journal");
  });

  it("does not mutate the supplied breadcrumb collection", () => {
    const breadcrumbs = Object.freeze(createBreadcrumbs());

    expect(() =>
      render(<Breadcrumbs breadcrumbs={breadcrumbs} />),
    ).not.toThrow();

    expect(breadcrumbs).toHaveLength(3);
  });
});
