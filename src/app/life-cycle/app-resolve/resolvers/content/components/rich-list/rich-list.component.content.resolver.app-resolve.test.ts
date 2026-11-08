// src/app/life-cycle/app-resolve/resolvers/content/components/rich-list/rich-list.component.content.resolver.app-resolve.test.ts

import { resolveRichListComponentContentAppResolve } from "./rich-list.component.content.resolver.app-resolve";

type Content = Parameters<
  typeof resolveRichListComponentContentAppResolve
>[0]["content"];

describe("Rich-list component AppResolve resolver", () => {
  const createContent = (): Content =>
    ({
      kind: "richList",
      items: [{ title: "First" }, { title: "Second" }],
    }) as unknown as Content;

  it("preserves the component properties", () => {
    const content = createContent();

    expect(resolveRichListComponentContentAppResolve({ content })).toEqual(
      content,
    );
  });

  it("returns a new component without cloning nested values", () => {
    const content = createContent();

    const result = resolveRichListComponentContentAppResolve({
      content,
    });

    expect(result).not.toBe(content);

    for (const key of Object.keys(content) as Array<keyof Content>) {
      expect(result[key]).toBe(content[key]);
    }
  });

  it("does not mutate frozen input", () => {
    const content = Object.freeze(createContent());

    expect(() =>
      resolveRichListComponentContentAppResolve({ content }),
    ).not.toThrow();
  });
});
