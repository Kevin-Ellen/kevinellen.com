// src/rendering/body-footer/colophon.body-footer.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextBodyFooterColophon } from "@app-render-context/types/body-footer.app-render-context.types";

import { BodyFooterColophonTemplate } from "@rendering/body-footer/colophon.body-footer.template";

const colophon = (
  overrides: Partial<AppRenderContextBodyFooterColophon> = {},
): AppRenderContextBodyFooterColophon =>
  ({
    items: [
      {
        label: "Location",
        value: "Epping Forest",
      },
      {
        label: "Camera",
        value: "Canon EOS R7",
      },
    ],
    ...overrides,
  }) as AppRenderContextBodyFooterColophon;

describe("BodyFooterColophonTemplate", () => {
  it("renders colophon items", () => {
    expect(
      renderToStaticMarkup(
        <BodyFooterColophonTemplate colophon={colophon()} />,
      ),
    ).toBe(
      '<div class="l-footer__meta"><p><span class="u-sr-only">Location: </span>Epping Forest</p><p><span class="u-sr-only">Camera: </span>Canon EOS R7</p></div>',
    );
  });

  it("renders an empty colophon", () => {
    expect(
      renderToStaticMarkup(
        <BodyFooterColophonTemplate
          colophon={colophon({
            items: [],
          })}
        />,
      ),
    ).toBe('<div class="l-footer__meta"></div>');
  });

  it("escapes content safely", () => {
    const html = renderToStaticMarkup(
      <BodyFooterColophonTemplate
        colophon={colophon({
          items: [
            {
              label: '<script>alert("x")</script>',
              value: "<img src=x onerror=alert(1)>",
            },
          ],
        })}
      />,
    );

    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");

    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
  });
});
