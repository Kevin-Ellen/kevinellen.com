// src/rendering/body-footer/colophon.body-footer.renderer.test.ts

import type { AppRenderContextBodyFooterColophon } from "@app-render-context/types/body-footer.app-render-context.types";

import { renderBodyFooterColophon } from "@rendering/body-footer/colophon.body-footer.renderer";

const createColophon = (
  overrides: Partial<AppRenderContextBodyFooterColophon> = {},
): AppRenderContextBodyFooterColophon =>
  ({
    items: [
      {
        label: "Built with",
        value: "Cloudflare Workers",
      },
      {
        label: "Content",
        value: "Typed by hand",
      },
    ],
    ...overrides,
  }) as AppRenderContextBodyFooterColophon;

describe("renderBodyFooterColophon", () => {
  it("renders colophon items", () => {
    expect(renderBodyFooterColophon(createColophon())).toBe(
      `<div class="l-footer__meta"><p><span class="u-sr-only">Built with: </span>Cloudflare Workers</p><p><span class="u-sr-only">Content: </span>Typed by hand</p></div>`,
    );
  });

  it("renders an empty colophon", () => {
    expect(
      renderBodyFooterColophon(
        createColophon({
          items: [],
        }),
      ),
    ).toBe(`<div class="l-footer__meta"></div>`);
  });

  it("escapes rendered values", () => {
    expect(
      renderBodyFooterColophon(
        createColophon({
          items: [
            {
              label: `Built <with>`,
              value: `Workers "edge" <script>`,
            },
          ],
        }),
      ),
    ).toBe(
      `<div class="l-footer__meta"><p><span class="u-sr-only">Built &lt;with&gt;: </span>Workers &quot;edge&quot; &lt;script&gt;</p></div>`,
    );
  });
});
