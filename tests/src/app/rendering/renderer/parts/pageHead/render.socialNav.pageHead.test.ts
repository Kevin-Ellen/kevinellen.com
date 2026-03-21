// tests/src/app/rendering/renderer/parts/pageHead/render.socialNav.pageHead.test.ts

import { renderSocialNav } from "@app/rendering/renderer/parts/pageHead/render.socialNav.pageHead";
import { createDocumentRenderContext } from "@tests/src/app/rendering/renderer/render.test.fixtures";

describe("renderSocialNav", () => {
  it("renders social navigation items", () => {
    const ctx = createDocumentRenderContext();

    const html = renderSocialNav(ctx);

    expect(html).toContain("GitHub");
    expect(html).toContain("Instagram");
    expect(html).toContain("https://github.com/Kevin-Ellen");
    expect(html).toContain("https://www.instagram.com/photography.mallard");
  });

  it("renders icon usage for social items", () => {
    const ctx = createDocumentRenderContext();

    const html = renderSocialNav(ctx);

    expect(html).toContain('href="#icon-github"');
    expect(html).toContain('href="#icon-instagram"');
  });

  it("returns stable wrapper output when no social items exist", () => {
    const ctx = createDocumentRenderContext({
      pageHead: {
        navigation: {
          primary: [],
          social: [],
        },
        breadcrumbs: [],
      },
    });

    const html = renderSocialNav(ctx);

    expect(html).toContain("l-header__social");
  });
});
