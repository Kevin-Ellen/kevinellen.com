// src/app/life-cycle/app-render/primitives/link/link.primitive.app-render.test.tsx

import { render, screen, within } from "@testing-library/react";

import { Link } from "./link.primitive.app-render";
import { Svg } from "../svg/svg.primitive.app-render";

jest.mock("../svg/svg.primitive.app-render", () => ({
  Svg: jest.fn(() => <svg data-testid="link-icon" />),
}));

const mockedSvg = jest.mocked(Svg);

type Props = Parameters<typeof Link>[0];
type LinkReference = Props["link"];
type Icon = NonNullable<LinkReference["icon"]>;

describe("Link AppRender primitive", () => {
  const createLink = (overrides: Partial<LinkReference> = {}): LinkReference =>
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
    }) as LinkReference;

  const icon = {
    id: "icon-camera",
    width: 24,
    height: 24,
  } as Icon;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Standard links", () => {
    it("renders an anchor with the correct destination", () => {
      render(<Link link={createLink()} />);

      expect(screen.getByRole("link", { name: "Journal" })).toHaveAttribute(
        "href",
        "/journal",
      );
    });

    it("renders ordinary link text", () => {
      render(<Link link={createLink()} />);

      const anchor = screen.getByRole("link", {
        name: "Journal",
      });

      expect(anchor).toHaveTextContent("Journal");
      expect(anchor.querySelector(".c-editorial-link__label")).toBeNull();

      expect(anchor.querySelector(".c-editorial-link__arrow")).toBeNull();
    });

    it("applies a custom link class", () => {
      render(<Link link={createLink()} className="c-navigation__link" />);

      expect(screen.getByRole("link")).toHaveClass("c-navigation__link");
    });

    it("omits the class attribute when no classes apply", () => {
      render(<Link link={createLink()} />);

      expect(screen.getByRole("link")).not.toHaveAttribute("class");
    });

    it("renders an empty label when explicitly provided", () => {
      render(<Link link={createLink({ label: "" })} />);

      const anchor = screen.getByRole("link");

      expect(anchor).toBeEmptyDOMElement();
    });
  });

  describe("Editorial links", () => {
    it("renders the editorial variant classes", () => {
      render(<Link link={createLink({ variant: "editorial" })} />);

      expect(screen.getByRole("link")).toHaveClass("c-editorial-link");
    });

    it("renders the subtle editorial variant classes", () => {
      render(
        <Link
          link={createLink({
            variant: "editorial-subtle",
          })}
        />,
      );

      expect(screen.getByRole("link")).toHaveClass(
        "c-editorial-link",
        "c-editorial-link--subtle",
      );
    });

    it("combines variant and custom classes", () => {
      render(
        <Link
          link={createLink({
            variant: "editorial-subtle",
          })}
          className="c-feature__link"
        />,
      );

      expect(screen.getByRole("link")).toHaveClass(
        "c-editorial-link",
        "c-editorial-link--subtle",
        "c-feature__link",
      );
    });

    it("renders the label within the editorial span", () => {
      render(<Link link={createLink({ variant: "editorial" })} />);

      const anchor = screen.getByRole("link");

      expect(
        anchor.querySelector(".c-editorial-link__label"),
      ).toHaveTextContent("Journal");
    });

    it("renders an arrow hidden from assistive technology", () => {
      render(<Link link={createLink({ variant: "editorial" })} />);

      const arrow = screen
        .getByRole("link")
        .querySelector(".c-editorial-link__arrow");

      expect(arrow).toHaveTextContent("→");
      expect(arrow).toHaveAttribute("aria-hidden", "true");
    });

    it("does not render an SVG for editorial links", () => {
      render(
        <Link
          link={createLink({
            variant: "editorial",
            icon,
          })}
        />,
      );

      expect(mockedSvg).not.toHaveBeenCalled();
      expect(screen.queryByTestId("link-icon")).toBeNull();
    });

    it("uses the link label as its accessible name", () => {
      render(
        <Link
          link={createLink({
            variant: "editorial",
            label: "Read field notes",
          })}
        />,
      );

      expect(
        screen.getByRole("link", {
          name: "Read field notes",
        }),
      ).toBeInTheDocument();
    });
  });

  describe("Icon links", () => {
    it("renders the SVG when an icon is provided", () => {
      render(<Link link={createLink({ icon })} />);

      expect(screen.getByTestId("link-icon")).toBeInTheDocument();

      expect(mockedSvg).toHaveBeenCalledWith(
        expect.objectContaining({
          svg: icon,
        }),
        undefined,
      );
    });

    it("forwards the icon CSS class", () => {
      render(
        <Link link={createLink({ icon })} iconClassName="c-social__icon" />,
      );

      expect(mockedSvg).toHaveBeenCalledWith(
        expect.objectContaining({
          svg: icon,
          className: "c-social__icon",
        }),
        undefined,
      );
    });

    it("does not render visible label text when an icon exists", () => {
      render(
        <Link
          link={createLink({
            icon,
            label: "Instagram",
            ariaLabel: "Visit Instagram",
          })}
        />,
      );

      const anchor = screen.getByRole("link", {
        name: "Visit Instagram",
      });

      expect(within(anchor).queryByText("Instagram")).toBeNull();
      expect(screen.getByTestId("link-icon")).toBeInTheDocument();
    });

    it("does not render the editorial arrow for icon links", () => {
      render(<Link link={createLink({ icon })} />);

      expect(
        screen.getByRole("link").querySelector(".c-editorial-link__arrow"),
      ).toBeNull();
    });
  });

  describe("Anchor attributes", () => {
    it("forwards an accessible label", () => {
      render(
        <Link
          link={createLink({
            icon,
            ariaLabel: "Visit Instagram",
          })}
        />,
      );

      expect(
        screen.getByRole("link", {
          name: "Visit Instagram",
        }),
      ).toHaveAttribute("aria-label", "Visit Instagram");
    });

    it("forwards a title", () => {
      render(
        <Link
          link={createLink({
            title: "Explore journal entries",
          })}
        />,
      );

      expect(screen.getByRole("link")).toHaveAttribute(
        "title",
        "Explore journal entries",
      );
    });

    it("forwards the target attribute", () => {
      render(
        <Link
          link={createLink({
            href: "https://example.com",
            target: "_blank",
          })}
        />,
      );

      expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
    });

    it("joins rel values with spaces", () => {
      render(
        <Link
          link={createLink({
            rel: ["noopener", "noreferrer"],
          })}
        />,
      );

      expect(screen.getByRole("link")).toHaveAttribute(
        "rel",
        "noopener noreferrer",
      );
    });

    it("omits nullable attributes when absent", () => {
      render(<Link link={createLink()} />);

      const anchor = screen.getByRole("link");

      expect(anchor).not.toHaveAttribute("aria-label");
      expect(anchor).not.toHaveAttribute("title");
      expect(anchor).not.toHaveAttribute("target");
      expect(anchor).not.toHaveAttribute("rel");
    });

    it("does not invent rel attributes for external links", () => {
      render(
        <Link
          link={createLink({
            href: "https://example.com",
            target: "_blank",
            rel: null,
          })}
        />,
      );

      expect(screen.getByRole("link")).not.toHaveAttribute("rel");
    });
  });
});
