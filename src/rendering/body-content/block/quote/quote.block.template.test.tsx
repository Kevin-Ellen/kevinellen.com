// src/rendering/body-content/block/quote/quote.block.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextQuoteBlock } from "@shared-types/page-content/block/quote/app-render-context.quote.block.types";

import { QuoteBlockTemplate } from "@rendering/body-content/block/quote/quote.block.template";

const block = (
  overrides: Partial<AppRenderContextQuoteBlock> = {},
): AppRenderContextQuoteBlock =>
  ({
    kind: "quote",
    id: "quote-kingfisher",
    flow: "content",
    text: "Nature rewards patience.",
    attribution: "Field journal",
    ...overrides,
  }) as AppRenderContextQuoteBlock;

describe("QuoteBlockTemplate", () => {
  it("renders a quote block with attribution", () => {
    expect(renderToStaticMarkup(<QuoteBlockTemplate block={block()} />)).toBe(
      '<figure class="m-contentBlock m-quote l-content"><blockquote class="m-quote__body" aria-describedby="quote-kingfisher">Nature rewards patience.</blockquote><figcaption id="quote-kingfisher" class="m-quote__attribution">Field journal</figcaption></figure>',
    );
  });

  it("renders a quote block without attribution", () => {
    expect(
      renderToStaticMarkup(
        <QuoteBlockTemplate
          block={block({
            attribution: null,
          })}
        />,
      ),
    ).toBe(
      '<figure class="m-contentBlock m-quote l-content"><blockquote class="m-quote__body">Nature rewards patience.</blockquote></figure>',
    );
  });

  it("renders breakout flow", () => {
    const html = renderToStaticMarkup(
      <QuoteBlockTemplate
        block={block({
          flow: "breakout",
        })}
      />,
    );

    expect(html).toContain("m-contentBlock--breakout");
  });

  it("escapes unsafe content", () => {
    const html = renderToStaticMarkup(
      <QuoteBlockTemplate
        block={block({
          text: '<script>alert("x")</script>',
          attribution: "<img src=x onerror=alert(1)>",
        })}
      />,
    );

    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");

    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
  });
});
