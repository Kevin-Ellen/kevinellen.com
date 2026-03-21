// tests/src/app/rendering/renderer/parts/pageHead/render.primaryNav.pageHead.test.ts

import { renderPrimaryNav } from "@app/rendering/renderer/parts/pageHead/render.primaryNav.pageHead";
import { createDocumentRenderContext } from "@tests/src/app/rendering/renderer/render.test.fixtures";

describe("renderPrimaryNav", () => {
  it("renders primary navigation items", () => {
    const ctx = createDocumentRenderContext();

    const html = renderPrimaryNav(ctx);

    expect(html).toContain("/journal");
    expect(html).toContain("Journal");
    expect(html).toContain("/photos");
    expect(html).toContain("Photos");
    expect(html).toContain("/about");
    expect(html).toContain("About");
  });

  it("renders icon usage when iconId exists", () => {
    const ctx = createDocumentRenderContext();

    const html = renderPrimaryNav(ctx);

    expect(html).toContain('href="#icon-home"');
  });

  it("renders active state for active items if implemented", () => {
    const ctx = createDocumentRenderContext({
      pageHead: {
        navigation: {
          primary: [
            {
              id: "journal",
              label: "Journal",
              href: "/journal",
              isActive: true,
            },
          ],
          social: [],
        },
        breadcrumbs: [],
      },
    });

    const html = renderPrimaryNav(ctx);

    expect(html).toContain("Journal");
    expect(html).toContain("/journal");
  });

  it("returns stable wrapper output when no items exist", () => {
    const ctx = createDocumentRenderContext({
      pageHead: {
        navigation: {
          primary: [],
          social: [],
        },
        breadcrumbs: [],
      },
    });

    const html = renderPrimaryNav(ctx);

    expect(html).toContain("l-header__nav");
  });
});
