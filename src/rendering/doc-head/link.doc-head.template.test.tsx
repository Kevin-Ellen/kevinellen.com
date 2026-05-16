// src/rendering/doc-head/link.doc-head.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import {
  CanonicalLink,
  HeadLink,
  PreloadLink,
} from "@rendering/doc-head/link.doc-head.template";

describe("HeadLink", () => {
  it("renders a basic head link", () => {
    expect(
      renderToStaticMarkup(
        <HeadLink
          link={{
            rel: "icon",
            href: "/favicon.ico",
          }}
        />,
      ),
    ).toBe('<link rel="icon" href="/favicon.ico"/>');
  });

  it("renders type and sizes when present", () => {
    expect(
      renderToStaticMarkup(
        <HeadLink
          link={{
            rel: "icon",
            href: "/assets/icons/favicon-96x96.png",
            type: "image/png",
            sizes: "96x96",
          }}
        />,
      ),
    ).toBe(
      '<link rel="icon" href="/assets/icons/favicon-96x96.png" type="image/png" sizes="96x96"/>',
    );
  });
});

describe("PreloadLink", () => {
  it("renders a preload link", () => {
    expect(
      renderToStaticMarkup(
        <PreloadLink
          preload={{
            rel: "preload",
            href: "/assets/fonts/font.woff2",
            as: "font",
          }}
        />,
      ),
    ).toBe('<link rel="preload" href="/assets/fonts/font.woff2" as="font"/>');
  });

  it("renders optional preload attributes", () => {
    expect(
      renderToStaticMarkup(
        <PreloadLink
          preload={{
            rel: "preload",
            href: "/assets/fonts/font.woff2",
            as: "font",
            type: "font/woff2",
            crossorigin: "anonymous",
          }}
        />,
      ),
    ).toBe(
      '<link rel="preload" href="/assets/fonts/font.woff2" as="font" type="font/woff2" crossorigin="anonymous"/>',
    );
  });
});

describe("CanonicalLink", () => {
  it("renders a canonical link", () => {
    expect(
      renderToStaticMarkup(<CanonicalLink href="https://example.com/notes" />),
    ).toBe('<link rel="canonical" href="https://example.com/notes"/>');
  });
});
