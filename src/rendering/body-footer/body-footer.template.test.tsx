// src/rendering/body-footer/body-footer.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextBodyFooter } from "@app-render-context/types/body-footer.app-render-context.types";

import { BodyFooterTemplate } from "@rendering/body-footer/body-footer.template";

const bodyFooter = (
  overrides: Partial<AppRenderContextBodyFooter> = {},
): AppRenderContextBodyFooter =>
  ({
    nav: {
      sections: [],
    },
    affiliations: {
      items: [],
    },
    colophon: {
      items: [],
    },
    ...overrides,
  }) as AppRenderContextBodyFooter;

describe("BodyFooterTemplate", () => {
  it("renders footer shell", () => {
    expect(
      renderToStaticMarkup(<BodyFooterTemplate bodyFooter={bodyFooter()} />),
    ).toBe(
      '<footer class="l-footer"><h2 class="u-sr-only">Footer</h2><div class="l-page__frame"><div class="l-footer__grid"></div><section class="l-footer__conservation" aria-labelledby="footer-conservation-heading"><h3 id="footer-conservation-heading" class="l-footer__heading">Conservation</h3><ul class="l-footer__logos" aria-label="Supported organisations"></ul></section><div class="l-footer__meta"></div></div></footer>',
    );
  });
});
