// src/app/life-cycle/app-render/document/page/body/inline/link/link.inline.body.page.document.app-render.test.tsx

import { render, screen } from "@testing-library/react";

import { LinkInline } from "./link.inline.body.page.document.app-render";
import { Link } from "../../../../../primitives/link/link.primitive.app-render";

jest.mock("../../../../../primitives/link/link.primitive.app-render", () => ({
  Link: jest.fn(({ link }: Parameters<typeof Link>[0]) => (
    <a href={link.href}>{link.label}</a>
  )),
}));

const mockedLink = jest.mocked(Link);

type Content = Parameters<typeof LinkInline>[0]["content"];
type LinkContent = Content["link"];

describe("LinkInline AppRender", () => {
  const createLink = (overrides: Partial<LinkContent> = {}): LinkContent =>
    ({
      href: "/journal",
      label: "Journal",
      variant: null,
      icon: null,
      ariaLabel: null,
      title: null,
      target: null,
      rel: null,
      ...overrides,
    }) as LinkContent;

  const createContent = (link: LinkContent): Content =>
    ({
      kind: "link",
      link,
    }) as Content;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the underlying Link component", () => {
    render(<LinkInline content={createContent(createLink())} />);

    expect(screen.getByRole("link", { name: "Journal" })).toHaveAttribute(
      "href",
      "/journal",
    );

    expect(mockedLink).toHaveBeenCalledTimes(1);
  });

  it("forwards the exact link reference", () => {
    const link = createLink();

    render(<LinkInline content={createContent(link)} />);

    expect(mockedLink.mock.calls[0]?.[0].link).toBe(link);
  });

  it("does not supply unnecessary presentation props", () => {
    render(<LinkInline content={createContent(createLink())} />);

    expect(mockedLink.mock.calls[0]?.[0]).toEqual({
      link: expect.any(Object),
    });
  });

  it("preserves the resolved link destination and label", () => {
    const link = createLink({
      href: "/topics/birds",
      label: "Birds",
    });

    render(<LinkInline content={createContent(link)} />);

    expect(screen.getByRole("link", { name: "Birds" })).toHaveAttribute(
      "href",
      "/topics/birds",
    );
  });

  it("forwards optional link metadata unchanged", () => {
    const link = createLink({
      ariaLabel: "Read more about wildlife",
      title: "Wildlife journal",
      variant: "editorial",
    });

    render(<LinkInline content={createContent(link)} />);

    const forwarded = mockedLink.mock.calls[0]?.[0].link;

    expect(forwarded).toBe(link);
    expect(forwarded?.ariaLabel).toBe("Read more about wildlife");
    expect(forwarded?.title).toBe("Wildlife journal");
    expect(forwarded?.variant).toBe("editorial");
  });

  it("updates the delegated link when content changes", () => {
    const first = createContent(
      createLink({ href: "/journal", label: "Journal" }),
    );

    const second = createContent(
      createLink({ href: "/about", label: "About" }),
    );

    const { rerender } = render(<LinkInline content={first} />);

    rerender(<LinkInline content={second} />);

    expect(mockedLink).toHaveBeenCalledTimes(2);
    expect(mockedLink.mock.calls[0]?.[0].link).toBe(first.link);
    expect(mockedLink.mock.calls[1]?.[0].link).toBe(second.link);

    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
  });
});
