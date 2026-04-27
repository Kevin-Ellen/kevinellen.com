// tests/src/rendering/body-footer/colophon.body-footer.renderer.test.ts

import { renderBodyFooterColophon } from "@rendering/body-footer/colophon.body-footer.renderer";

describe("renderBodyFooterColophon", () => {
  it("renders colophon metadata items", () => {
    const result = renderBodyFooterColophon({
      items: [
        {
          label: "Copyright",
          value: "© 2026 Kevin Ellen",
        },
        {
          label: "Built with",
          value: "Cloudflare Workers",
        },
      ],
    });

    expect(result).toContain('<div class="l-footer__meta">');
    expect(result).toContain(
      '<span class="u-sr-only">Copyright: </span>© 2026 Kevin Ellen',
    );
    expect(result).toContain(
      '<span class="u-sr-only">Built with: </span>Cloudflare Workers',
    );
  });
});
