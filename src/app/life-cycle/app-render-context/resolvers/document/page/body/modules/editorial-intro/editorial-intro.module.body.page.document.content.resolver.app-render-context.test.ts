// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/editorial-intro/editorial-intro.module.body.page.document.content.resolver.app-render-context.test.ts

import { resolveEditorialIntroModuleContentAppRenderContext } from "./editorial-intro.module.body.page.document.content.resolver.app-render-context";

type Content = Parameters<
  typeof resolveEditorialIntroModuleContentAppRenderContext
>[0]["content"];

describe("Editorial intro module AppRenderContext resolver", () => {
  const createContent = (): Content =>
    ({
      kind: "editorialIntro",
      heading: "Wildlife photography",
      description: "Observations from the natural world",
    }) as unknown as Content;

  it("preserves all content properties", () => {
    const content = createContent();

    expect(
      resolveEditorialIntroModuleContentAppRenderContext({ content }),
    ).toEqual(content);
  });

  it("returns a new object reference", () => {
    const content = createContent();

    const result = resolveEditorialIntroModuleContentAppRenderContext({
      content,
    });

    expect(result).not.toBe(content);
  });

  it("does not mutate frozen content", () => {
    const content = Object.freeze(createContent());

    const result = resolveEditorialIntroModuleContentAppRenderContext({
      content,
    });

    expect(result).toEqual(content);
    expect(result).not.toBe(content);
  });
});
