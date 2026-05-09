// src/rendering/doc-open/link.doc-open.renderer.test.ts

import {
  renderCanonicalLink,
  renderHeadLink,
  renderPreloadLink,
} from "@rendering/doc-open/link.doc-open.renderer";

describe("renderHeadLink", () => {
  it("renders head link", () => {
    expect(
      renderHeadLink({
        rel: "icon",
        href: "/favicon.ico",
        type: "image/x-icon",
        sizes: "32x32",
      }),
    ).toBe(
      `<link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="32x32">`,
    );
  });

  it("renders head link without optional attributes", () => {
    expect(
      renderHeadLink({
        rel: "icon",
        href: "/favicon.ico",
      }),
    ).toBe(`<link rel="icon" href="/favicon.ico">`);
  });

  it("escapes head link values", () => {
    expect(
      renderHeadLink({
        rel: `"icon"`,
        href: `/favicon<bad>.ico`,
        type: `image/"bad"`,
        sizes: `32x32"bad"`,
      }),
    ).toBe(
      `<link rel="&quot;icon&quot;" href="/favicon&lt;bad&gt;.ico" type="image/&quot;bad&quot;" sizes="32x32&quot;bad&quot;">`,
    );
  });
});

describe("renderPreloadLink", () => {
  it("renders preload link", () => {
    expect(
      renderPreloadLink({
        rel: "preload",
        href: "/fonts/inter.woff2",
        as: "font",
        type: "font/woff2",
        crossorigin: "anonymous",
      }),
    ).toBe(
      `<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin="anonymous">`,
    );
  });

  it("renders preload link without optional attributes", () => {
    expect(
      renderPreloadLink({
        rel: "preload",
        href: "/app.js",
        as: "script",
      }),
    ).toBe(`<link rel="preload" href="/app.js" as="script">`);
  });

  it("escapes preload values", () => {
    expect(
      renderPreloadLink({
        rel: `"preload"`,
        href: `/font<bad>.woff2`,
        as: `"font"`,
        type: `font/"bad"`,
        crossorigin: `"anonymous"`,
      }),
    ).toBe(
      `<link rel="&quot;preload&quot;" href="/font&lt;bad&gt;.woff2" as="&quot;font&quot;" type="font/&quot;bad&quot;" crossorigin="&quot;anonymous&quot;">`,
    );
  });
});

describe("renderCanonicalLink", () => {
  it("renders canonical link", () => {
    expect(renderCanonicalLink("https://example.com/journal")).toBe(
      `<link rel="canonical" href="https://example.com/journal">`,
    );
  });

  it("escapes canonical href", () => {
    expect(renderCanonicalLink(`https://example.com/"bad"`)).toBe(
      `<link rel="canonical" href="https://example.com/&quot;bad&quot;">`,
    );
  });
});
