// src/rendering/shared/script.shared.renderer.test.ts

import {
  renderInlineScript,
  renderLinkScript,
  renderStructuredDataScript,
} from "@rendering/shared/script.shared.renderer";

describe("renderStructuredDataScript", () => {
  it("renders structured data script", () => {
    expect(
      renderStructuredDataScript({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Kevin Ellen",
      }),
    ).toBe(
      `<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"Kevin Ellen"}</script>`,
    );
  });

  it("escapes script-sensitive JSON content", () => {
    expect(
      renderStructuredDataScript({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: `<script>Tom & Jerry</script>`,
      }),
    ).toBe(
      `<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"\\u003Cscript\\u003ETom \\u0026 Jerry\\u003C/script\\u003E"}</script>`,
    );
  });
});

describe("renderInlineScript", () => {
  it("renders inline script", () => {
    expect(
      renderInlineScript({
        content: `console.log("hello");`,
      }),
    ).toBe(`<script>console.log("hello");</script>`);
  });

  it("renders inline script with nonce", () => {
    expect(
      renderInlineScript({
        content: `console.log("hello");`,
        nonce: "abc123",
      }),
    ).toBe(`<script nonce="abc123">console.log("hello");</script>`);
  });

  it("escapes nonce", () => {
    expect(
      renderInlineScript({
        content: `console.log("hello");`,
        nonce: `abc"123`,
      }),
    ).toBe(`<script nonce="abc&quot;123">console.log("hello");</script>`);
  });
});

describe("renderLinkScript", () => {
  it("renders link script", () => {
    expect(
      renderLinkScript({
        src: "/assets/app.js",
      }),
    ).toBe(`<script src="/assets/app.js"></script>`);
  });

  it("renders link script with nonce", () => {
    expect(
      renderLinkScript({
        src: "/assets/app.js",
        nonce: "abc123",
      }),
    ).toBe(`<script src="/assets/app.js" nonce="abc123"></script>`);
  });

  it("renders defer script", () => {
    expect(
      renderLinkScript({
        src: "/assets/app.js",
        loading: "defer",
      }),
    ).toBe(`<script src="/assets/app.js" defer></script>`);
  });

  it("renders async script", () => {
    expect(
      renderLinkScript({
        src: "/assets/app.js",
        loading: "async",
      }),
    ).toBe(`<script src="/assets/app.js" async></script>`);
  });

  it("does not render loading attribute for blocking scripts", () => {
    expect(
      renderLinkScript({
        src: "/assets/app.js",
        loading: "blocking",
      }),
    ).toBe(`<script src="/assets/app.js"></script>`);
  });

  it("escapes script attributes", () => {
    expect(
      renderLinkScript({
        src: `/assets/"bad".js`,
        nonce: `abc"123`,
      }),
    ).toBe(
      `<script src="/assets/&quot;bad&quot;.js" nonce="abc&quot;123"></script>`,
    );
  });
});
