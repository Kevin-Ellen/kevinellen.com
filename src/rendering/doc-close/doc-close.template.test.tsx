// src/rendering/doc-close/doc-close.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextDocClose } from "@app-render-context/types/doc-close.app-render-context.types";

import { DocCloseTemplate } from "@rendering/doc-close/doc-close.template";

describe("DocCloseTemplate", () => {
  it("renders structured data, scripts, and SVG sprite", () => {
    const docClose = {
      structuredData: [
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Kevin Ellen",
        },
      ],
      inlineScripts: [
        {
          content: "console.log('hello');",
          nonce: "abc123",
        },
      ],
      linkScripts: [
        {
          src: "/assets/scripts/main.js",
          nonce: "abc123",
          loading: "defer",
        },
      ],
      svg: [
        {
          id: "icon-home",
          viewBox: "0 0 24 24",
          content: '<path d="M1 1h22v22H1z"></path>',
        },
      ],
    } as AppRenderContextDocClose;

    expect(renderToStaticMarkup(<DocCloseTemplate docClose={docClose} />)).toBe(
      '<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"Kevin Ellen"}</script><script nonce="abc123">console.log(\'hello\');</script><script src="/assets/scripts/main.js" nonce="abc123" defer=""></script><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="u-hidden-svg-sprite"><symbol id="icon-home" viewBox="0 0 24 24"><path d="M1 1h22v22H1z"></path></symbol></svg>',
    );
  });

  it("does not render an SVG sprite when no SVG assets are present", () => {
    const docClose = {
      structuredData: [],
      inlineScripts: [],
      linkScripts: [],
      svg: [],
    } as AppRenderContextDocClose;

    expect(renderToStaticMarkup(<DocCloseTemplate docClose={docClose} />)).toBe(
      "",
    );
  });
});
