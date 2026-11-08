// src/app/life-cycle/app-render-context/resolvers/document/page/body/inline/text/text.inline.body.page.document.content.resolver.app-render-context.test.ts

import { resolveTextInlineContentAppRenderContext } from "./text.inline.body.page.document.content.resolver.app-render-context";

type Content = Parameters<
  typeof resolveTextInlineContentAppRenderContext
>[0]["content"];

describe("Text inline content AppRenderContext resolver", () => {
  const createContent = (overrides: Record<string, unknown> = {}): Content =>
    ({
      kind: "text",
      value: "A morning in Epping Forest",
      ...overrides,
    }) as unknown as Content;

  it("returns the original content reference", () => {
    const content = createContent();

    expect(resolveTextInlineContentAppRenderContext({ content })).toBe(content);
  });

  it("preserves text content and properties", () => {
    const content = createContent({
      value: "A red fox crossed the woodland path",
      strong: true,
      emphasis: false,
    });

    expect(resolveTextInlineContentAppRenderContext({ content })).toEqual(
      content,
    );
  });

  it("supports empty text", () => {
    const content = createContent({ value: "" });

    expect(resolveTextInlineContentAppRenderContext({ content })).toBe(content);
  });

  it("does not mutate frozen content", () => {
    const content = Object.freeze(createContent());

    expect(resolveTextInlineContentAppRenderContext({ content })).toBe(content);
  });
});
