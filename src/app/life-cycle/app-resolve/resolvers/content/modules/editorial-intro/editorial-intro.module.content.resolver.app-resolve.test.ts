// src/app/life-cycle/app-resolve/resolvers/content/modules/editorial-intro/editorial-intro.module.content.resolver.app-resolve.test.ts

import { resolveEditorialIntroModuleContentAppResolve } from "./editorial-intro.module.content.resolver.app-resolve";

type Content = Parameters<
  typeof resolveEditorialIntroModuleContentAppResolve
>[0]["content"];

describe("Editorial intro module AppResolve resolver", () => {
  const createContent = (): Content =>
    ({
      kind: "editorialIntro",
      heading: {
        text: "An autumn morning",
      },
    }) as unknown as Content;

  it("preserves all content properties", () => {
    const content = createContent();

    expect(resolveEditorialIntroModuleContentAppResolve({ content })).toEqual(
      content,
    );
  });

  it("returns a new object", () => {
    const content = createContent();

    const result = resolveEditorialIntroModuleContentAppResolve({
      content,
    });

    expect(result).not.toBe(content);
  });

  it("retains nested references", () => {
    const content = createContent();

    const result = resolveEditorialIntroModuleContentAppResolve({
      content,
    });

    for (const key of Object.keys(content) as Array<keyof Content>) {
      expect(result[key]).toBe(content[key]);
    }
  });

  it("does not mutate frozen input", () => {
    const content = Object.freeze(createContent());

    expect(() =>
      resolveEditorialIntroModuleContentAppResolve({ content }),
    ).not.toThrow();
  });
});
