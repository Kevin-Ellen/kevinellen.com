// tests/src/rendering/body-footer/body-footer.renderer.test.ts

import { renderBodyFooter } from "@rendering/body-footer/body-footer.renderer";

describe("renderBodyFooter", () => {
  it("renders the complete footer structure", () => {
    const result = renderBodyFooter({
      nav: {
        sections: [],
      },
      affiliations: {
        items: [],
      },
      colophon: {
        items: [],
      },
    });

    expect(result).toContain('<footer class="l-footer">');
    expect(result).toContain('<h2 class="u-sr-only">Footer</h2>');
    expect(result).toContain('<div class="l-page__frame">');
    expect(result).toContain("</footer>");
  });
});
