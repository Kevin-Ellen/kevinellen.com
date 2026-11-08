// src/app/life-cycle/app-resolve/resolvers/content/inline/text/text.inline.content.resolver.app-resolve.test.ts

import { resolveTextInlineContentAppResolve } from "./text.inline.content.resolver.app-resolve";

type Content = Parameters<
  typeof resolveTextInlineContentAppResolve
>[0]["content"];

describe("Text inline content AppResolve resolver", () => {
  const createContent = (): Content =>
    ({
      kind: "text",
      text: "A quiet morning in Epping Forest.",
    }) as unknown as Content;

  it("returns the original content reference", () => {
    const content = createContent();

    const result = resolveTextInlineContentAppResolve({ content });

    expect(result).toBe(content);
  });

  it("preserves all content properties", () => {
    const content = createContent();

    expect(resolveTextInlineContentAppResolve({ content })).toEqual(content);
  });

  it("does not mutate frozen content", () => {
    const content = Object.freeze(createContent());

    const result = resolveTextInlineContentAppResolve({ content });

    expect(result).toBe(content);
    expect(content).toEqual(createContent());
  });
});
