// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/hero/hero.module.content.resolver.app-render-context.test.ts

import { resolveHeroModuleContentAppRenderContext } from "./hero.module.content.resolver.app-render-context";

type Content = Parameters<
  typeof resolveHeroModuleContentAppRenderContext
>[0]["content"];

describe("Hero module AppRenderContext resolver", () => {
  const createContent = (): Content =>
    ({
      kind: "hero",
      heading: "Wildlife photography",
      description: "Encounters with the natural world",
    }) as unknown as Content;

  it("returns the original module reference", () => {
    const content = createContent();

    expect(resolveHeroModuleContentAppRenderContext({ content })).toBe(content);
  });

  it("preserves all module properties", () => {
    const content = createContent();

    expect(resolveHeroModuleContentAppRenderContext({ content })).toEqual(
      content,
    );
  });

  it("does not modify frozen input", () => {
    const content = Object.freeze(createContent());

    expect(resolveHeroModuleContentAppRenderContext({ content })).toBe(content);
  });
});
