// src/app/life-cycle/app-resolve/resolvers/content/modules/quote/quote.module.content.resolver.app-resolve.test.ts

import { resolveQuoteModuleAppResolve } from "./quote.module.content.resolver.app-resolve";

type Content = Parameters<typeof resolveQuoteModuleAppResolve>[0]["content"];

describe("Quote module AppResolve resolver", () => {
  const createContent = (): Content =>
    ({
      kind: "quote",
      quote: "A moment in the forest.",
      attribution: "Field notes",
    }) as unknown as Content;

  it("preserves the original content properties", () => {
    const content = createContent();

    expect(resolveQuoteModuleAppResolve({ content })).toEqual(content);
  });

  it("returns a new object with the same property references", () => {
    const content = createContent();

    const result = resolveQuoteModuleAppResolve({ content });

    expect(result).not.toBe(content);

    for (const key of Object.keys(content) as Array<keyof Content>) {
      expect(result[key]).toBe(content[key]);
    }
  });

  it("does not mutate the original content", () => {
    const content = Object.freeze(createContent());

    const result = resolveQuoteModuleAppResolve({ content });

    expect(result).toEqual(content);
  });
});
