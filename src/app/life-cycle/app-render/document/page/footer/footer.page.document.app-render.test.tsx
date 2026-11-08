// src/app/life-cycle/app-render/document/page/footer/footer.page.document.app-render.test.tsx

import { render, screen, within } from "@testing-library/react";

import { PageFooter } from "./footer.page.document.app-render";
import { Link } from "../../../primitives/link/link.primitive.app-render";

jest.mock("../../../primitives/link/link.primitive.app-render", () => ({
  Link: jest.fn(({ link }: Parameters<typeof Link>[0]) => (
    <a href={link.href}>{link.label}</a>
  )),
}));

const mockedLink = jest.mocked(Link);

type Footer = Parameters<typeof PageFooter>[0]["footer"];
type FooterLink = Parameters<typeof Link>[0]["link"];

describe("PageFooter", () => {
  const createLink = (label: string, href: string): FooterLink => ({
    href,
    label,
    variant: null,
    icon: null,
    ariaLabel: null,
    title: null,
    target: null,
    rel: null,
  });

  const createFooter = (overrides: Partial<Footer> = {}): Footer =>
    ({
      navigation: [
        {
          id: "explore",
          label: "Explore",
          links: [
            createLink("Photography", "/photography"),
            createLink("Journal", "/journal"),
          ],
        },
        {
          id: "about",
          label: "About",
          links: [createLink("About me", "/about")],
        },
      ],
      conservation: {
        heading: "Supporting conservation",
        items: [
          {
            id: "rspb",
            link: createLink("RSPB", "https://www.rspb.org.uk"),
          },
          {
            id: "national-trust",
            link: createLink(
              "National Trust",
              "https://www.nationaltrust.org.uk",
            ),
          },
        ],
      },
      colophon: {
        year: 2026,
        name: "Kevin Ellen",
        rights: "All rights reserved",
      },
      legal: {
        label: "Legal",
        links: [
          createLink("Privacy", "/privacy"),
          createLink("Cookies", "/cookies"),
        ],
      },
      ...overrides,
    }) as Footer;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the semantic site footer", () => {
    const { container } = render(<PageFooter footer={createFooter()} />);

    expect(container.querySelector("footer")).toHaveClass("l-footer");
    expect(container.querySelector("footer > .l-frame")).toBeInTheDocument();
  });

  it("renders the accessible footer navigation", () => {
    render(<PageFooter footer={createFooter()} />);

    expect(screen.getByRole("navigation", { name: "Footer" })).toHaveClass(
      "l-footer__navigation",
    );
  });

  it("renders navigation groups and their headings", () => {
    const { container } = render(<PageFooter footer={createFooter()} />);

    expect(container.querySelectorAll(".l-footer__group")).toHaveLength(2);

    expect(
      screen.getByRole("heading", { level: 2, name: "Explore" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: "About" }),
    ).toBeInTheDocument();
  });

  it("forwards navigation links in order", () => {
    const footer = createFooter();

    render(<PageFooter footer={footer} />);

    const expected = footer.navigation.flatMap((section) => section.links);

    expect(
      mockedLink.mock.calls
        .slice(0, expected.length)
        .map(([props]) => props.link),
    ).toEqual(expected);

    expected.forEach((link, index) => {
      expect(mockedLink.mock.calls[index]?.[0].link).toBe(link);
    });
  });

  it("renders navigation links within their groups", () => {
    const { container } = render(<PageFooter footer={createFooter()} />);

    const groups = Array.from(container.querySelectorAll(".l-footer__group"));

    expect(within(groups[0] as HTMLElement).getAllByRole("link")).toHaveLength(
      2,
    );

    expect(within(groups[1] as HTMLElement).getAllByRole("link")).toHaveLength(
      1,
    );
  });

  it("renders the conservation section", () => {
    const { container } = render(<PageFooter footer={createFooter()} />);

    const conservation = container.querySelector(".l-footer__conservation");

    expect(conservation).toHaveAttribute(
      "aria-labelledby",
      "footer-conservation-title",
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Supporting conservation",
      }),
    ).toHaveAttribute("id", "footer-conservation-title");
  });

  it("forwards conservation logo classes", () => {
    const footer = createFooter();

    render(<PageFooter footer={footer} />);

    const conservationCalls = mockedLink.mock.calls.filter(([props]) =>
      props.className?.startsWith("l-footer__logo--"),
    );

    expect(conservationCalls).toHaveLength(2);

    footer.conservation.items.forEach((item, index) => {
      expect(conservationCalls[index]?.[0]).toEqual({
        link: item.link,
        className: `l-footer__logo--${item.id}`,
      });
    });
  });

  it("renders the colophon", () => {
    render(<PageFooter footer={createFooter()} />);

    expect(
      screen.getByText("© 2026 Kevin Ellen. All rights reserved."),
    ).toBeInTheDocument();
  });

  it("renders the labelled legal navigation", () => {
    render(<PageFooter footer={createFooter()} />);

    const navigation = screen.getByRole("navigation", {
      name: "Legal",
    });

    expect(
      within(navigation).getByRole("link", { name: "Privacy" }),
    ).toHaveAttribute("href", "/privacy");

    expect(
      within(navigation).getByRole("link", { name: "Cookies" }),
    ).toHaveAttribute("href", "/cookies");
  });

  it("supports empty navigation and conservation collections", () => {
    const footer = createFooter();

    const { container } = render(
      <PageFooter
        footer={{
          ...footer,
          navigation: [],
          conservation: {
            ...footer.conservation,
            items: [],
          },
          legal: {
            ...footer.legal,
            links: [],
          },
        }}
      />,
    );

    expect(container.querySelectorAll(".l-footer__group")).toHaveLength(0);

    expect(container.querySelector(".l-footer__logos")).toBeEmptyDOMElement();

    expect(mockedLink).not.toHaveBeenCalled();
  });
});
