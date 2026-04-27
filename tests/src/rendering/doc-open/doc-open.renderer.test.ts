// tests/src/rendering/doc-open/doc-open.renderer.test.ts

import { renderDocOpen } from "@rendering/doc-open/doc-open.renderer";

describe("renderDocOpen", () => {
  it("renders document opening markup with metadata, CSS, links and scripts", () => {
    const result = renderDocOpen({
      language: "en-GB",
      nonce: "abc123",
      metadata: {
        pageTitle: "About <Kevin>",
        metaDescription: 'About "Kevin".',
      },
      canonicalUrl: "https://example.com/about",
      themeColour: "#1f2621",
      preload: [
        {
          rel: "preload",
          href: "/assets/fonts/font.woff2",
          as: "font",
          type: "font/woff2",
          crossorigin: "anonymous",
        },
      ],
      links: [
        {
          rel: "icon",
          href: "/favicon.ico",
        },
      ],
      linkScripts: [
        {
          src: "/assets/app.js",
          nonce: "abc123",
          loading: "defer",
        },
      ],
      inlineScripts: [
        {
          nonce: "abc123",
          content: "console.log('duck');",
        },
      ],
    });

    expect(result).toContain("<!doctype html>");
    expect(result).toContain('<html lang="en-GB">');
    expect(result).toContain('<style nonce="abc123">body{color:red;}</style>');
    expect(result).toContain("<title>About &lt;Kevin&gt;</title>");
    expect(result).toContain(
      '<meta name="description" content="About &quot;Kevin&quot;.">',
    );
    expect(result).toContain(
      '<link rel="canonical" href="https://example.com/about">',
    );
    expect(result).toContain('<meta name="theme-color" content="#1f2621">');
    expect(result).toContain(
      '<link rel="preload" href="/assets/fonts/font.woff2" as="font" type="font/woff2" crossorigin="anonymous">',
    );
    expect(result).toContain('<link rel="icon" href="/favicon.ico">');
    expect(result).toContain(
      '<script src="/assets/app.js" nonce="abc123" defer></script>',
    );
    expect(result).toContain(
      `<script nonce="abc123">console.log('duck');</script>`,
    );
    expect(result.endsWith("<body>")).toBe(true);
  });

  it("omits canonical when canonicalUrl is null", () => {
    const result = renderDocOpen({
      language: "en-GB",
      nonce: "abc123",
      metadata: {
        pageTitle: "Fallback title",
        metaDescription: "Fallback description.",
      },
      canonicalUrl: null,
      themeColour: "#1f2621",
      preload: [],
      links: [],
      linkScripts: [],
      inlineScripts: [],
    });

    expect(result).toContain("<title>Fallback title</title>");
    expect(result).toContain(
      '<meta name="description" content="Fallback description.">',
    );
    expect(result).not.toContain('rel="canonical"');
    expect(result).toContain('<style nonce="abc123">body{color:red;}</style>');
  });
});
