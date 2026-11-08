// src/app/life-cycle/app-render/document/page/header/header.page.document.app-render.test.tsx

import { render, screen, within } from "@testing-library/react";

import { PageHeader } from "./header.page.document.app-render";
import { Link } from "../../../primitives/link/link.primitive.app-render";
import { Svg } from "../../../primitives/svg/svg.primitive.app-render";

jest.mock("../../../primitives/link/link.primitive.app-render", () => ({
  Link: jest.fn(({ link }: Parameters<typeof Link>[0]) => (
    <a href={link.href} aria-label={link.ariaLabel ?? undefined}>
      {link.label}
    </a>
  )),
}));

jest.mock("../../../primitives/svg/svg.primitive.app-render", () => ({
  Svg: jest.fn(() => <svg data-testid="brand-logo" />),
}));

const mockedLink = jest.mocked(Link);
const mockedSvg = jest.mocked(Svg);

type Header = Parameters<typeof PageHeader>[0]["header"];
type NavigationLink = Header["navigation"]["primary"]["items"][number];

describe("PageHeader", () => {
  const createLink = (label: string, href: string): NavigationLink =>
    ({
      label,
      href,
      variant: null,
      icon: null,
      ariaLabel: null,
      title: null,
      target: null,
      rel: null,
    }) as NavigationLink;

  const createHeader = (overrides: Partial<Header> = {}): Header =>
    ({
      appearance: {
        transparent: false,
        inverted: false,
      },
      brand: {
        href: "/",
        label: "Kevin Ellen — Home",
        logo: {
          id: "logo-monogram-ke",
          width: 40,
          height: 40,
        },
      },
      navigation: {
        primary: {
          items: [
            createLink("Photography", "/photography"),
            createLink("Journal", "/journal"),
          ],
        },
        social: {
          items: [
            createLink("Instagram", "https://instagram.com"),
            createLink("GitHub", "https://github.com"),
          ],
        },
      },
      ...overrides,
    }) as Header;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the site header with its base class", () => {
    const { container } = render(<PageHeader header={createHeader()} />);

    expect(container.querySelector("header")).toHaveClass("l-header");
    expect(container.querySelector(".l-frame")).toBeInTheDocument();
  });

  it.each([
    [false, false, false, false],
    [true, false, true, false],
    [false, true, false, true],
    [true, true, true, true],
  ])(
    "renders appearance transparent=%s inverted=%s",
    (transparent, inverted, expectedTransparent, expectedInverted) => {
      const header = createHeader();

      const { container } = render(
        <PageHeader
          header={{
            ...header,
            appearance: { transparent, inverted },
          }}
        />,
      );

      const element = container.querySelector("header");

      expect(element?.classList.contains("l-header--transparent")).toBe(
        expectedTransparent,
      );

      expect(element?.classList.contains("l-header--inverted")).toBe(
        expectedInverted,
      );
    },
  );

  it("renders the brand as an accessible home link", () => {
    const header = createHeader();

    render(<PageHeader header={header} />);

    const brand = screen.getByRole("link", {
      name: "Kevin Ellen — Home",
    });

    expect(brand).toHaveAttribute("href", "/");
    expect(brand).toHaveClass("l-header__brand");
  });

  it("forwards the brand SVG and CSS class", () => {
    const header = createHeader();

    render(<PageHeader header={header} />);

    expect(mockedSvg).toHaveBeenCalledTimes(1);
    expect(mockedSvg.mock.calls[0]?.[0]).toEqual({
      svg: header.brand.logo,
      className: "l-header__brand-logo",
    });
  });

  it("renders primary navigation links in order", () => {
    const header = createHeader();

    const { container } = render(<PageHeader header={header} />);

    const navigation = container.querySelector(".l-header__primary");

    expect(navigation).not.toBeNull();

    expect(
      Array.from(navigation?.querySelectorAll(".l-header__item a") ?? []).map(
        (link) => link.textContent,
      ),
    ).toEqual(["Photography", "Journal"]);

    expect(mockedLink).toHaveBeenCalledTimes(4);

    expect(mockedLink.mock.calls[0]?.[0]).toEqual({
      link: header.navigation.primary.items[0],
      className: "l-header__link",
    });

    expect(mockedLink.mock.calls[1]?.[0]).toEqual({
      link: header.navigation.primary.items[1],
      className: "l-header__link",
    });
  });

  it("passes the icon class only to social links", () => {
    const header = createHeader();

    render(<PageHeader header={header} />);

    expect(mockedLink.mock.calls[2]?.[0]).toEqual({
      link: header.navigation.social.items[0],
      className: "l-header__link",
      iconClassName: "l-header__icon",
    });

    expect(mockedLink.mock.calls[3]?.[0]).toEqual({
      link: header.navigation.social.items[1],
      className: "l-header__link",
      iconClassName: "l-header__icon",
    });
  });

  it("renders separate primary and social navigation lists", () => {
    const { container } = render(<PageHeader header={createHeader()} />);

    const primary = container.querySelector(".l-header__primary");
    const social = container.querySelector(".l-header__social");

    expect(primary).not.toBeNull();
    expect(social).not.toBeNull();

    expect(
      within(primary as HTMLElement).getAllByRole("listitem"),
    ).toHaveLength(2);

    expect(within(social as HTMLElement).getAllByRole("listitem")).toHaveLength(
      2,
    );
  });

  it("supports empty navigation collections", () => {
    const header = createHeader();

    render(
      <PageHeader
        header={{
          ...header,
          navigation: {
            primary: { items: [] },
            social: { items: [] },
          },
        }}
      />,
    );

    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    expect(mockedLink).not.toHaveBeenCalled();
    expect(mockedSvg).toHaveBeenCalledTimes(1);
  });
});
