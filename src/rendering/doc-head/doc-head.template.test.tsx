// src/rendering/doc-head/doc-head.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextDocOpen } from "@app-render-context/types/doc-open.app-render-context.types";

import { DocHeadTemplate } from "@rendering/doc-head/doc-head.template";

describe("DocHeadTemplate", () => {
  it("renders document head content", () => {
    const docOpen = {
      language: "en-GB",
      nonce: "abc123",
      canonicalUrl: "https://example.com/notes",
      themeColour: "#1f2621",

      metadata: {
        pageTitle: "Technical Notes",
        metaDescription: "Notes about architecture and rendering.",
      },

      socialPreview: null,

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
          src: "/assets/scripts/main.js",
          nonce: "abc123",
          loading: "defer",
        },
      ],

      inlineScripts: [
        {
          content: "console.log('hello');",
          nonce: "abc123",
        },
      ],
    } as AppRenderContextDocOpen;

    const html = renderToStaticMarkup(<DocHeadTemplate docOpen={docOpen} />);

    expect(html).toContain("<head>");
    expect(html).toContain('<meta charSet="utf-8"/>');

    expect(html).toContain(
      '<meta name="viewport" content="width=device-width, initial-scale=1"/>',
    );

    expect(html).toContain("<title>Technical Notes</title>");

    expect(html).toContain(
      '<meta name="description" content="Notes about architecture and rendering."/>',
    );

    expect(html).toContain(
      '<link rel="canonical" href="https://example.com/notes"/>',
    );

    expect(html).toContain('<meta name="theme-color" content="#1f2621"/>');

    expect(html).toContain(
      '<link rel="preload" href="/assets/fonts/font.woff2" as="font" type="font/woff2" crossorigin="anonymous"/>',
    );

    expect(html).toContain('<link rel="icon" href="/favicon.ico"/>');

    expect(html).toContain(
      '<script src="/assets/scripts/main.js" nonce="abc123" defer=""></script>',
    );

    expect(html).toContain(
      `<script nonce="abc123">console.log('hello');</script>`,
    );

    expect(html).toContain('<style nonce="abc123">');
  });

  it("does not render a canonical link when canonicalUrl is null", () => {
    const docOpen = {
      language: "en-GB",
      nonce: "abc123",
      canonicalUrl: null,
      themeColour: "#000000",

      metadata: {
        pageTitle: "No Canonical",
        metaDescription: "Testing canonical omission.",
      },

      socialPreview: null,

      preload: [],
      links: [],
      linkScripts: [],
      inlineScripts: [],
    } as AppRenderContextDocOpen;

    const html = renderToStaticMarkup(<DocHeadTemplate docOpen={docOpen} />);

    expect(html).not.toContain('rel="canonical"');
  });
});
