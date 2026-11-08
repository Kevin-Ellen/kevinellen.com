// src/app/life-cycle/app-resolve/resolvers/content/modules/page-intro/page-intro.module.content.resolver.app-resolve.test.ts

import { resolvePageIntroModuleContentAppResolve } from "./page-intro.module.content.resolver.app-resolve";

type Content = Parameters<
  typeof resolvePageIntroModuleContentAppResolve
>[0]["content"];

describe("Page-intro module AppResolve resolver", () => {
  const createContent = (): Content =>
    ({
      kind: "pageIntro",
      heading: "Wildlife journals",
      description: "Observations from the field",
    }) as unknown as Content;

  it("preserves all content properties", () => {
    const content = createContent();

    expect(resolvePageIntroModuleContentAppResolve({ content })).toEqual(
      content,
    );
  });

  it("returns a new object reference", () => {
    const content = createContent();

    const result = resolvePageIntroModuleContentAppResolve({ content });

    expect(result).not.toBe(content);
  });

  it("retains the original nested property references", () => {
    const content = createContent();

    const result = resolvePageIntroModuleContentAppResolve({ content });

    for (const key of Object.keys(content) as Array<keyof Content>) {
      expect(result[key]).toBe(content[key]);
    }
  });

  it("does not mutate frozen content", () => {
    const content = Object.freeze(createContent());

    expect(() =>
      resolvePageIntroModuleContentAppResolve({ content }),
    ).not.toThrow();
  });
});
