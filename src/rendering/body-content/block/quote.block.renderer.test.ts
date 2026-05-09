// src/rendering/body-content/block/quote.block.renderer.test.ts

import type { AppRenderContextQuoteBlock } from "@shared-types/page-content/block/quote/app-render-context.quote.block.types";

import { renderQuoteBlock } from "@rendering/body-content/block/quote.block.renderer";
import { renderBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.helper";

jest.mock("@rendering/body-content/block/helpers/flow.block.helper", () => ({
  renderBlockFlowClass: jest.fn(),
}));

const createModule = (
  overrides: Partial<AppRenderContextQuoteBlock> = {},
): AppRenderContextQuoteBlock =>
  ({
    kind: "quote",
    id: "quote-attribution",
    flow: "content",
    text: "The marsh was completely silent.",
    attribution: "Kevin Ellen",
    ...overrides,
  }) as AppRenderContextQuoteBlock;

describe("renderQuoteBlock", () => {
  const mockedRenderBlockFlowClass = jest.mocked(renderBlockFlowClass);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderBlockFlowClass.mockReturnValue("l-content");
  });

  it("renders quote block with attribution", () => {
    expect(renderQuoteBlock(createModule())).toBe(
      `<figure class="m-contentBlock m-quote l-content"><blockquote class="m-quote__body" aria-describedby="quote-attribution">The marsh was completely silent.</blockquote><figcaption id="quote-attribution" class="m-quote__attribution">Kevin Ellen</figcaption></figure>`,
    );

    expect(mockedRenderBlockFlowClass).toHaveBeenCalledWith("content");
  });

  it("renders quote block without attribution", () => {
    expect(
      renderQuoteBlock(
        createModule({
          attribution: null,
        }),
      ),
    ).toBe(
      `<figure class="m-contentBlock m-quote l-content"><blockquote class="m-quote__body">The marsh was completely silent.</blockquote></figure>`,
    );
  });

  it("escapes rendered values", () => {
    expect(
      renderQuoteBlock(
        createModule({
          id: `quote-"bad"`,
          text: `Quote <script>alert("x")</script>`,
          attribution: `Kevin <bad>`,
        }),
      ),
    ).toBe(
      `<figure class="m-contentBlock m-quote l-content"><blockquote class="m-quote__body" aria-describedby="quote-&quot;bad&quot;">Quote &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;</blockquote><figcaption id="quote-&quot;bad&quot;" class="m-quote__attribution">Kevin &lt;bad&gt;</figcaption></figure>`,
    );
  });
});
