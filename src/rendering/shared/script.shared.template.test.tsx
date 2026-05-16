// src/rendering/shared/script.shared.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import {
  InlineScript,
  LinkScript,
  StructuredDataScript,
} from "@rendering/shared/script.shared.template";

describe("StructuredDataScript", () => {
  it("renders escaped JSON-LD script content", () => {
    expect(
      renderToStaticMarkup(
        <StructuredDataScript
          item={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "</script><script>alert('x')</script>",
          }}
        />,
      ),
    ).toBe(
      '<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"\\u003C/script\\u003E\\u003Cscript\\u003Ealert(\'x\')\\u003C/script\\u003E"}</script>',
    );
  });
});

describe("InlineScript", () => {
  it("renders an inline script with nonce", () => {
    expect(
      renderToStaticMarkup(
        <InlineScript
          script={{
            content: "console.log('hello');",
            nonce: "abc123",
          }}
        />,
      ),
    ).toBe(`<script nonce="abc123">console.log('hello');</script>`);
  });

  it("renders an inline script without nonce", () => {
    expect(
      renderToStaticMarkup(
        <InlineScript
          script={{
            content: "console.log('hello');",
          }}
        />,
      ),
    ).toBe(`<script>console.log('hello');</script>`);
  });
});

describe("LinkScript", () => {
  it("renders a blocking linked script", () => {
    expect(
      renderToStaticMarkup(
        <LinkScript
          script={{
            src: "/assets/scripts/main.js",
            nonce: "abc123",
          }}
        />,
      ),
    ).toBe('<script src="/assets/scripts/main.js" nonce="abc123"></script>');
  });

  it("renders a deferred linked script", () => {
    expect(
      renderToStaticMarkup(
        <LinkScript
          script={{
            src: "/assets/scripts/main.js",
            nonce: "abc123",
            loading: "defer",
          }}
        />,
      ),
    ).toBe(
      '<script src="/assets/scripts/main.js" nonce="abc123" defer=""></script>',
    );
  });

  it("renders an async linked script", () => {
    expect(
      renderToStaticMarkup(
        <LinkScript
          script={{
            src: "/assets/scripts/main.js",
            loading: "async",
          }}
        />,
      ),
    ).toBe('<script src="/assets/scripts/main.js" async=""></script>');
  });
});
