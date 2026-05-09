// src/rendering/body-content/inline/inline.renderer.test.ts

import type { AppRenderContextInline } from "@shared-types/page-content/inline/app-render-context.inline-content.types";

import {
  renderInlineContent,
  renderInlineContentItem,
} from "@rendering/body-content/inline/inline.renderer";

describe("renderInlineContentItem", () => {
  it("renders text inline content", () => {
    const item = {
      kind: "text",
      value: "Hello <world>",
    } as AppRenderContextInline;

    expect(renderInlineContentItem(item)).toBe("Hello &lt;world&gt;");
  });

  it("renders code inline content", () => {
    const item = {
      kind: "code",
      value: "const value = true;",
    } as AppRenderContextInline;

    expect(renderInlineContentItem(item)).toBe(
      "<code>const value = true;</code>",
    );
  });

  it("renders link inline content", () => {
    const item = {
      kind: "link",
      link: {
        href: "/journal",
        text: "Journal",
        openInNewTab: false,
        svg: null,
      },
    } as AppRenderContextInline;

    expect(renderInlineContentItem(item)).toBe(
      `<a href="/journal">Journal</a>`,
    );
  });

  it("renders emphasis inline content", () => {
    const item = {
      kind: "emphasis",
      content: [{ kind: "text", value: "gentle" }],
    } as AppRenderContextInline;

    expect(renderInlineContentItem(item)).toBe("<em>gentle</em>");
  });

  it("renders strong inline content", () => {
    const item = {
      kind: "strong",
      content: [{ kind: "text", value: "important" }],
    } as AppRenderContextInline;

    expect(renderInlineContentItem(item)).toBe("<strong>important</strong>");
  });

  it("renders line break inline content", () => {
    const item = {
      kind: "lineBreak",
    } as AppRenderContextInline;

    expect(renderInlineContentItem(item)).toBe("<br>");
  });
});

describe("renderInlineContent", () => {
  it("renders joined inline content", () => {
    const content = [
      { kind: "text", value: "Hello " },
      {
        kind: "strong",
        content: [{ kind: "text", value: "world" }],
      },
      { kind: "text", value: "." },
    ] as readonly AppRenderContextInline[];

    expect(renderInlineContent(content)).toBe("Hello <strong>world</strong>.");
  });

  it("renders empty inline content", () => {
    expect(renderInlineContent([])).toBe("");
  });
});
