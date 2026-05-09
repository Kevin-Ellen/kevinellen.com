// src/rendering/shared/link.shared.renderer.test.ts

import type { AppRenderContextLink } from "@shared-types/links/app-render-context.links.types";

import {
  renderLinkAttributes,
  renderTextLink,
} from "@rendering/shared/link.shared.renderer";

const createLink = (
  overrides: Partial<AppRenderContextLink> = {},
): AppRenderContextLink =>
  ({
    kind: "internal",
    href: "/journal",
    text: "Journal",
    openInNewTab: false,
    svg: null,
    ...overrides,
  }) as AppRenderContextLink;

describe("renderLinkAttributes", () => {
  it("renders basic link attributes", () => {
    expect(renderLinkAttributes(createLink())).toBe(`href="/journal"`);
  });

  it("renders full link attributes", () => {
    expect(
      renderLinkAttributes({
        ...createLink(),
        openInNewTab: true,
        className: "m-link",
        ariaCurrent: "page",
        ariaLabel: "Open journal",
      }),
    ).toBe(
      `class="m-link" href="/journal" target="_blank" rel="noopener noreferrer" aria-current="page" aria-label="Open journal"`,
    );
  });

  it("omits optional attributes when not present", () => {
    expect(
      renderLinkAttributes({
        ...createLink(),
        className: null,
        ariaCurrent: null,
      }),
    ).toBe(`href="/journal"`);
  });

  it("escapes rendered attributes", () => {
    expect(
      renderLinkAttributes({
        ...createLink({
          href: `/journal/"bad"`,
        }),
        className: `link-"bad"`,
        ariaCurrent: "page",
        ariaLabel: `Label "bad" <script>`,
      }),
    ).toBe(
      `class="link-&quot;bad&quot;" href="/journal/&quot;bad&quot;" aria-current="page" aria-label="Label &quot;bad&quot; &lt;script&gt;"`,
    );
  });
});

describe("renderTextLink", () => {
  it("renders text link", () => {
    expect(renderTextLink(createLink())).toBe(`<a href="/journal">Journal</a>`);
  });

  it("renders text link with attributes", () => {
    expect(
      renderTextLink({
        ...createLink(),
        className: "m-link",
        ariaCurrent: "page",
      }),
    ).toBe(`<a class="m-link" href="/journal" aria-current="page">Journal</a>`);
  });

  it("escapes link text", () => {
    expect(
      renderTextLink(
        createLink({
          text: `Journal <script>alert("x")</script>`,
        }),
      ),
    ).toBe(
      `<a href="/journal">Journal &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;</a>`,
    );
  });
});
