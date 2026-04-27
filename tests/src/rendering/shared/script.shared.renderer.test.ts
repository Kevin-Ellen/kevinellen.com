// tests/src/rendering/shared/script.shared.renderer.test.ts

import {
  renderInlineScript,
  renderLinkScript,
  renderStructuredDataScript,
} from "@rendering/shared/script.shared.renderer";

describe("script.shared.renderer", () => {
  it("renders structured data JSON safely", () => {
    const result = renderStructuredDataScript({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "</script><script>alert('duck')</script>",
    });

    expect(result).toBe(
      `<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"\\u003C/script\\u003E\\u003Cscript\\u003Ealert('duck')\\u003C/script\\u003E"}</script>`,
    );
  });

  it("renders an inline script with nonce", () => {
    const result = renderInlineScript({
      nonce: "abc123",
      content: "console.log('duck');",
    });

    expect(result).toBe(`<script nonce="abc123">console.log('duck');</script>`);
  });

  it("renders an inline script without nonce", () => {
    const result = renderInlineScript({
      nonce: null,
      content: "console.log('duck');",
    });

    expect(result).toBe(`<script>console.log('duck');</script>`);
  });

  it("renders a deferred linked script", () => {
    const result = renderLinkScript({
      src: '/assets/app-"duck".js',
      nonce: "abc123",
      loading: "defer",
    });

    expect(result).toBe(
      '<script src="/assets/app-&quot;duck&quot;.js" nonce="abc123" defer></script>',
    );
  });

  it("renders an async linked script", () => {
    const result = renderLinkScript({
      src: "/assets/app.js",
      loading: "async",
    });

    expect(result).toBe('<script src="/assets/app.js" async></script>');
  });

  it("renders a blocking linked script without loading attribute", () => {
    const result = renderLinkScript({
      src: "/assets/app.js",
      nonce: null,
      loading: "blocking",
    });

    expect(result).toBe('<script src="/assets/app.js"></script>');
  });
});
