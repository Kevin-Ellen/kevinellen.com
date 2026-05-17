// src/rendering/body-content/inline/inline.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextInline } from "@shared-types/page-content/inline/app-render-context.inline-content.types";

import {
  InlineContentItemTemplate,
  InlineContentTemplate,
} from "@rendering/body-content/inline/inline.template";

describe("InlineContentItemTemplate", () => {
  it("renders text inline content", () => {
    const item = {
      kind: "text",
      value: "Plain text",
    } as AppRenderContextInline;

    expect(
      renderToStaticMarkup(<InlineContentItemTemplate item={item} />),
    ).toBe("Plain text");
  });

  it("renders link inline content", () => {
    const item = {
      kind: "link",
      link: {
        href: "/notes",
        text: "Notes",
        openInNewTab: false,
      },
    } as AppRenderContextInline;

    expect(
      renderToStaticMarkup(<InlineContentItemTemplate item={item} />),
    ).toBe('<a href="/notes">Notes</a>');
  });

  it("renders code inline content", () => {
    const item = {
      kind: "code",
      value: "npm run validate",
    } as AppRenderContextInline;

    expect(
      renderToStaticMarkup(<InlineContentItemTemplate item={item} />),
    ).toBe("<code>npm run validate</code>");
  });

  it("renders emphasis inline content", () => {
    const item = {
      kind: "emphasis",
      content: [{ kind: "text", value: "soft" }],
    } as AppRenderContextInline;

    expect(
      renderToStaticMarkup(<InlineContentItemTemplate item={item} />),
    ).toBe("<em>soft</em>");
  });

  it("renders strong inline content", () => {
    const item = {
      kind: "strong",
      content: [{ kind: "text", value: "important" }],
    } as AppRenderContextInline;

    expect(
      renderToStaticMarkup(<InlineContentItemTemplate item={item} />),
    ).toBe("<strong>important</strong>");
  });

  it("renders line break inline content", () => {
    const item = {
      kind: "lineBreak",
    } as AppRenderContextInline;

    expect(
      renderToStaticMarkup(<InlineContentItemTemplate item={item} />),
    ).toBe("<br/>");
  });
});

describe("InlineContentTemplate", () => {
  it("renders multiple inline content items", () => {
    const content = [
      { kind: "text", value: "Read " },
      {
        kind: "link",
        link: {
          href: "/journal",
          text: "journal",
          openInNewTab: false,
        },
      },
      { kind: "text", value: " now" },
    ] as readonly AppRenderContextInline[];

    expect(
      renderToStaticMarkup(<InlineContentTemplate content={content} />),
    ).toBe('Read <a href="/journal">journal</a> now');
  });

  it("renders empty inline content", () => {
    expect(renderToStaticMarkup(<InlineContentTemplate content={[]} />)).toBe(
      "",
    );
  });
});
