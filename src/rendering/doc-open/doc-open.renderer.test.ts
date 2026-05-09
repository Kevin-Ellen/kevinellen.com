// src/rendering/doc-open/doc-open.renderer.test.ts

import type { AppRenderContextDocOpen } from "@app-render-context/types/doc-open.app-render-context.types";

import { renderDocOpen } from "@rendering/doc-open/doc-open.renderer";

import {
  renderCanonicalLink,
  renderHeadLink,
  renderPreloadLink,
} from "@rendering/doc-open/link.doc-open.renderer";

import {
  renderInlineScript,
  renderLinkScript,
} from "@rendering/shared/script.shared.renderer";

jest.mock("../../../.build/generated/styles.css?raw", () => ({
  __esModule: true,
  default: "body{color:red;}",
}));

jest.mock("@rendering/doc-open/link.doc-open.renderer", () => ({
  renderCanonicalLink: jest.fn(),
  renderHeadLink: jest.fn(),
  renderPreloadLink: jest.fn(),
}));

jest.mock("@rendering/shared/script.shared.renderer", () => ({
  renderInlineScript: jest.fn(),
  renderLinkScript: jest.fn(),
}));

const createDocOpen = (
  overrides: Partial<AppRenderContextDocOpen> = {},
): AppRenderContextDocOpen =>
  ({
    language: "en",
    nonce: "abc123",
    canonicalUrl: "https://example.com/journal",
    themeColour: "#ffffff",
    metadata: {
      pageTitle: "Journal",
      metaDescription: "Field notes and photography.",
    },
    preload: [
      {
        rel: "preload",
        href: "/font.woff2",
        as: "font",
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
        src: "/app.js",
        nonce: "abc123",
      },
    ],
    inlineScripts: [
      {
        id: "theme",
        nonce: "abc123",
        content: `console.log("theme")`,
      },
    ],
    ...overrides,
  }) as AppRenderContextDocOpen;

describe("renderDocOpen", () => {
  const mockedRenderCanonicalLink = jest.mocked(renderCanonicalLink);
  const mockedRenderHeadLink = jest.mocked(renderHeadLink);
  const mockedRenderPreloadLink = jest.mocked(renderPreloadLink);

  const mockedRenderInlineScript = jest.mocked(renderInlineScript);
  const mockedRenderLinkScript = jest.mocked(renderLinkScript);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderCanonicalLink.mockReturnValue(
      `<link rel="canonical" href="https://example.com/journal">`,
    );

    mockedRenderHeadLink.mockReturnValue(
      `<link rel="icon" href="/favicon.ico">`,
    );

    mockedRenderPreloadLink.mockReturnValue(
      `<link rel="preload" href="/font.woff2" as="font">`,
    );

    mockedRenderLinkScript.mockReturnValue(`<script src="/app.js"></script>`);

    mockedRenderInlineScript.mockReturnValue(
      `<script>console.log("theme")</script>`,
    );
  });

  it("renders document open markup", () => {
    const docOpen = createDocOpen();

    expect(renderDocOpen(docOpen)).toBe(
      `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style nonce="abc123">body{color:red;}</style><title>Journal</title><meta name="description" content="Field notes and photography."><link rel="canonical" href="https://example.com/journal"><meta name="theme-color" content="#ffffff"><link rel="preload" href="/font.woff2" as="font"><link rel="icon" href="/favicon.ico"><script src="/app.js"></script><script>console.log("theme")</script></head><body>`,
    );

    expect(mockedRenderCanonicalLink).toHaveBeenCalledWith(
      docOpen.canonicalUrl,
    );

    expect(mockedRenderHeadLink).toHaveBeenCalledWith(
      docOpen.links[0],
      0,
      docOpen.links,
    );

    expect(mockedRenderPreloadLink).toHaveBeenCalledWith(
      docOpen.preload[0],
      0,
      docOpen.preload,
    );

    expect(mockedRenderLinkScript).toHaveBeenCalledWith(
      docOpen.linkScripts[0],
      0,
      docOpen.linkScripts,
    );

    expect(mockedRenderInlineScript).toHaveBeenCalledWith(
      docOpen.inlineScripts[0],
      0,
      docOpen.inlineScripts,
    );
  });

  it("omits canonical link when canonical url is null", () => {
    const result = renderDocOpen(
      createDocOpen({
        canonicalUrl: null,
      }),
    );

    expect(result).not.toContain(`rel="canonical"`);

    expect(mockedRenderCanonicalLink).not.toHaveBeenCalled();
  });

  it("escapes rendered values", () => {
    const result = renderDocOpen(
      createDocOpen({
        language: "en-GB",
        nonce: `abc"123`,
        themeColour: `#fff"bad"`,
        metadata: {
          pageTitle: `Journal <bad>`,
          metaDescription: `Description "bad" <script>`,
        },
      }),
    );

    expect(result).toContain(`nonce="abc&quot;123"`);
    expect(result).toContain(`<title>Journal &lt;bad&gt;</title>`);

    expect(result).toContain(
      `content="Description &quot;bad&quot; &lt;script&gt;"`,
    );

    expect(result).toContain(
      `<meta name="theme-color" content="#fff&quot;bad&quot;">`,
    );
  });
});
