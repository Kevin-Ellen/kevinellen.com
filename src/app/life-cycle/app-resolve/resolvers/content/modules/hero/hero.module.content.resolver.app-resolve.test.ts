// src/app/life-cycle/app-resolve/resolvers/content/modules/hero/hero.module.content.resolver.app-resolve.test.ts

import { resolveHeroModuleContentAppResolve } from "./hero.module.content.resolver.app-resolve";

type Content = Parameters<
  typeof resolveHeroModuleContentAppResolve
>[0]["content"];

describe("Hero module AppResolve resolver", () => {
  const createContent = (): Content =>
    ({
      kind: "hero",
      heading: "Wildlife photography",
    }) as unknown as Content;

  it("returns exactly the supplied content object", () => {
    const content = createContent();

    expect(resolveHeroModuleContentAppResolve({ content })).toBe(content);
  });

  it("preserves its properties without transformation", () => {
    const content = createContent();

    expect(resolveHeroModuleContentAppResolve({ content })).toEqual(content);
  });

  it("accepts frozen input without mutation", () => {
    const content = Object.freeze(createContent());

    expect(resolveHeroModuleContentAppResolve({ content })).toBe(content);
  });
});
