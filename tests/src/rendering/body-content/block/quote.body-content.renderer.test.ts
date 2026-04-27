// tests/src/rendering/body-content/block/quote.body-content.renderer.test.ts

import { renderQuoteBlockContentModule } from "@rendering/body-content/block/quote.body-content.renderer";

describe("renderQuoteBlockContentModule", () => {
  it("renders a quote with attribution", () => {
    const result = renderQuoteBlockContentModule({
      kind: "quote",
      id: "technology-quote",
      text: "Technology is the campfire.",
      attribution: "Laurie Anderson",
      flow: "content",
    });

    expect(result).toBe(`<figure class="m-contentBlock m-quote l-content">
    <blockquote class="m-quote__body" aria-describedby="technology-quote">
      Technology is the campfire.
    </blockquote>
    <figcaption id="technology-quote" class="m-quote__attribution">
        Laurie Anderson
      </figcaption>
  </figure>`);
  });

  it("renders a quote without attribution", () => {
    const result = renderQuoteBlockContentModule({
      kind: "quote",
      id: "quote-1",
      text: "No attribution.",
      attribution: null,
      flow: "content",
    });

    expect(result).toContain(
      '<figure class="m-contentBlock m-quote l-content">',
    );
    expect(result).toContain('<blockquote class="m-quote__body">');
    expect(result).toContain("No attribution.");
    expect(result).not.toContain("figcaption");
    expect(result).not.toContain("aria-describedby");
  });
});
