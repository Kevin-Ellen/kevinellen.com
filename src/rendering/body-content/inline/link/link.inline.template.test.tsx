// src/rendering/body-content/inline/link/link.inline.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextLinkInline } from "@shared-types/page-content/inline/link/app-render-context.link.inline-content.types";

import { LinkInlineTemplate } from "@rendering/body-content/inline/link/link.inline.template";

describe("LinkInlineTemplate", () => {
  it("renders a standard link", () => {
    const item = {
      kind: "link",
      link: {
        href: "/journal",
        text: "Journal",
        openInNewTab: false,
      },
    } as AppRenderContextLinkInline;

    expect(renderToStaticMarkup(<LinkInlineTemplate item={item} />)).toBe(
      '<a href="/journal">Journal</a>',
    );
  });

  it("renders an external link opening in a new tab", () => {
    const item = {
      kind: "link",
      link: {
        href: "https://example.com",
        text: "External",
        openInNewTab: true,
      },
    } as AppRenderContextLinkInline;

    expect(renderToStaticMarkup(<LinkInlineTemplate item={item} />)).toBe(
      '<a href="https://example.com" target="_blank" rel="noopener noreferrer">External</a>',
    );
  });
});
