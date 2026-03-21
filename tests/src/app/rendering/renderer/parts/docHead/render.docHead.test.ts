// tests/src/app/rendering/renderer/parts/docHead/render.docHead.test.ts

import { renderDocHead } from "@app/rendering/renderer/parts/docHead/render.docHead";
import { createDocumentRenderContext } from "@tests/src/app/rendering/renderer/render.test.fixtures";

describe("renderDocHead", () => {
  it("renders the document opener, html lang, head, and body opener", () => {
    const ctx = createDocumentRenderContext();

    const html = renderDocHead(ctx);

    expect(html).toContain("<!doctype html>");
    expect(html).toContain('<html lang="en-GB">');
    expect(html).toContain("<head>");
    expect(html).toContain('<body class="l-page">');
  });

  it("renders the page title and meta description", () => {
    const ctx = createDocumentRenderContext();

    const html = renderDocHead(ctx);

    expect(html).toContain("<title>Kevin Ellen</title>");
    expect(html).toContain(
      'meta name="description" content="Nature photography, journal writing, and technical architecture."',
    );
  });

  it("renders the style nonce", () => {
    const ctx = createDocumentRenderContext({
      security: {
        nonce: "nonce-123",
      },
    });

    const html = renderDocHead(ctx);

    expect(html).toContain('<style nonce="nonce-123">');
  });

  it("renders canonical for non-error pages", () => {
    const ctx = createDocumentRenderContext({
      page: {
        id: "home",
        kind: "home",
        slug: "/",
        renderMode: "request-composed",
      },
      seo: {
        pageTitle: "Kevin Ellen",
        metaDescription: "Description",
        canonicalUrl: "https://kevinellen.com/",
      },
    });

    const html = renderDocHead(ctx);

    expect(html).toContain(
      '<link rel="canonical" href="https://kevinellen.com/">',
    );
  });

  it("suppresses canonical for error pages", () => {
    const ctx = createDocumentRenderContext({
      page: {
        id: "error-404",
        kind: "error",
        slug: "/errors/404",
        renderMode: "request-composed",
      },
      seo: {
        pageTitle: "404 Not Found",
        metaDescription: "Page not found",
        canonicalUrl: "https://kevinellen.com/errors/404",
      },
    });

    const html = renderDocHead(ctx);

    expect(html).not.toContain('rel="canonical"');
  });

  it("renders only head scripts", () => {
    const ctx = createDocumentRenderContext({
      assets: {
        scripts: [
          {
            id: "head-script",
            kind: "external",
            src: "/static/head.js",
            location: "head",
            defer: true,
          },
          {
            id: "footer-script",
            kind: "inline",
            content: "console.log('footer');",
            location: "footer",
          },
        ],
        svgs: [],
      },
    });

    const html = renderDocHead(ctx);

    expect(html).toContain('<script src="/static/head.js" defer></script>');
    expect(html).not.toContain("console.log('footer');");
  });

  it("escapes title and meta description", () => {
    const ctx = createDocumentRenderContext({
      seo: {
        pageTitle: `<Test "Title">`,
        metaDescription: `Fish & Chips "desc" <tag>`,
        canonicalUrl: "https://kevinellen.com/",
      },
    });

    const html = renderDocHead(ctx);

    expect(html).toContain("<title>&lt;Test &quot;Title&quot;&gt;</title>");
    expect(html).toContain(
      'content="Fish &amp; Chips &quot;desc&quot; &lt;tag&gt;"',
    );
  });
});
