// src/rendering/shared/link.shared.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextLink } from "@shared-types/links/app-render-context.links.types";

import { LinkTemplate } from "@rendering/shared/link.shared.template";

const link = (
  overrides: Partial<AppRenderContextLink> = {},
): AppRenderContextLink =>
  ({
    kind: "internal",
    href: "/journal",
    text: "Journal",
    openInNewTab: false,
    ...overrides,
  }) as AppRenderContextLink;

describe("LinkTemplate", () => {
  it("renders a standard link", () => {
    expect(renderToStaticMarkup(<LinkTemplate link={link()} />)).toBe(
      '<a href="/journal">Journal</a>',
    );
  });

  it("renders an external link opening in a new tab", () => {
    expect(
      renderToStaticMarkup(
        <LinkTemplate
          link={link({
            kind: "external",
            href: "https://example.com",
            text: "External",
            openInNewTab: true,
          })}
        />,
      ),
    ).toBe(
      '<a href="https://example.com" target="_blank" rel="noopener noreferrer">External</a>',
    );
  });

  it("renders aria attributes", () => {
    expect(
      renderToStaticMarkup(
        <LinkTemplate
          link={link({
            href: "/notes",
            text: "Notes",
          })}
          ariaCurrent="page"
          ariaLabel="Current page"
        />,
      ),
    ).toBe(
      '<a href="/notes" aria-current="page" aria-label="Current page">Notes</a>',
    );
  });

  it("renders a class name", () => {
    expect(
      renderToStaticMarkup(
        <LinkTemplate
          link={link({
            href: "/about",
            text: "About",
          })}
          className="m-nav__link"
        />,
      ),
    ).toBe('<a class="m-nav__link" href="/about">About</a>');
  });

  it("renders children instead of link text", () => {
    expect(
      renderToStaticMarkup(
        <LinkTemplate
          link={link({
            href: "/contact",
            text: "Fallback text",
          })}
        >
          <strong>Contact us</strong>
        </LinkTemplate>,
      ),
    ).toBe('<a href="/contact"><strong>Contact us</strong></a>');
  });
});
