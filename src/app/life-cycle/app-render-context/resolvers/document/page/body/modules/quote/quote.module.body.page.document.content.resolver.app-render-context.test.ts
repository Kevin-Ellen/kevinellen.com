// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/quote/quote.module.body.page.document.content.resolver.app-render-context.test.ts

import { resolveQuoteModuleAppRenderContext } from "./quote.module.body.page.document.content.resolver.app-render-context";

type Content = Parameters<
  typeof resolveQuoteModuleAppRenderContext
>[0]["content"];

describe("Quote module AppRenderContext resolver", () => {
  const createContent = (): Content =>
    ({
      kind: "quote",
      quote: "The woodland was unusually quiet.",
      attribution: "Field notes",
    }) as unknown as Content;

  it("preserves all content properties", () => {
    const content = createContent();

    expect(resolveQuoteModuleAppRenderContext({ content })).toEqual(content);
  });

  it("returns a new object reference", () => {
    const content = createContent();

    const result = resolveQuoteModuleAppRenderContext({ content });

    expect(result).not.toBe(content);
  });

  it("preserves the supplied values", () => {
    const content = createContent();

    const result = resolveQuoteModuleAppRenderContext({ content });

    expect(result.kind).toBe(content.kind);
    expect(result).toEqual({ ...content });
  });

  it("does not mutate frozen content", () => {
    const content = Object.freeze(createContent());

    const result = resolveQuoteModuleAppRenderContext({ content });

    expect(result).toEqual(content);
    expect(result).not.toBe(content);
  });
});
