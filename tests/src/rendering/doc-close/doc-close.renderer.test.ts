// tests/src/rendering/doc-close/doc-close.renderer.test.ts

import { renderDocClose } from "@rendering/doc-close/doc-close.renderer";

describe("renderDocClose", () => {
  it("renders structured data, scripts, SVG sprite, and closes the document", () => {
    const result = renderDocClose({
      structuredData: [
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Kevin Ellen",
        },
      ],
      inlineScripts: [
        {
          nonce: "abc123",
          content: "console.log('duck');",
        },
      ],
      linkScripts: [
        {
          src: "/assets/app.js",
          nonce: "abc123",
          loading: "defer",
        },
      ],
      svg: [
        {
          id: "icon-home",
          viewBox: "0 0 10 10",
          content: "<path />",
        },
      ],
    });

    expect(result).toContain(
      '<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"Kevin Ellen"}</script>',
    );
    expect(result).toContain(
      `<script nonce="abc123">console.log('duck');</script>`,
    );
    expect(result).toContain(
      '<script src="/assets/app.js" nonce="abc123" defer></script>',
    );
    expect(result).toContain(
      '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" hidden class="u-hidden-svg-sprite"><symbol id="icon-home" viewBox="0 0 10 10"><path /></symbol></svg>',
    );
    expect(result.endsWith("</body></html>")).toBe(true);
  });

  it("omits the SVG sprite when there are no SVG assets", () => {
    const result = renderDocClose({
      structuredData: [],
      inlineScripts: [],
      linkScripts: [],
      svg: [],
    });

    expect(result).toBe("</body></html>");
  });
});
