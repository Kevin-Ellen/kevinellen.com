// tests/src/rendering/doc-open/link.doc-open.renderer.test.ts

import {
  renderCanonicalLink,
  renderHeadLink,
  renderPreloadLink,
} from "@rendering/doc-open/link.doc-open.renderer";

describe("link.doc-open.renderer", () => {
  it("renders a head link with optional attributes", () => {
    expect(
      renderHeadLink({
        rel: "icon",
        href: '/favicon-"duck".ico',
        type: "image/x-icon",
        sizes: "32x32",
      }),
    ).toBe(
      '<link rel="icon" href="/favicon-&quot;duck&quot;.ico" type="image/x-icon" sizes="32x32">',
    );
  });

  it("omits empty optional head link attributes", () => {
    expect(
      renderHeadLink({
        rel: "manifest",
        href: "/manifest.webmanifest",
        type: null,
        sizes: null,
      }),
    ).toBe('<link rel="manifest" href="/manifest.webmanifest">');
  });

  it("renders a preload link", () => {
    expect(
      renderPreloadLink({
        rel: "preload",
        href: "/assets/fonts/font.woff2",
        as: "font",
        type: "font/woff2",
        crossorigin: "anonymous",
      }),
    ).toBe(
      '<link rel="preload" href="/assets/fonts/font.woff2" as="font" type="font/woff2" crossorigin="anonymous">',
    );
  });

  it("renders a canonical link", () => {
    expect(renderCanonicalLink('https://example.com/about?x="duck"')).toBe(
      '<link rel="canonical" href="https://example.com/about?x=&quot;duck&quot;">',
    );
  });

  it("omits empty optional preload attributes", () => {
    expect(
      renderPreloadLink({
        rel: "preload",
        href: "/assets/app.css",
        as: "style",
        type: null,
        crossorigin: null,
      }),
    ).toBe('<link rel="preload" href="/assets/app.css" as="style">');
  });
});
