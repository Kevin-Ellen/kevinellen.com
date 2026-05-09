// src/app-render-context/class.app-render-context.test.ts

import type { AppRenderContextData } from "@app-render-context/app-render-context.types";

import { AppRenderContext } from "@app-render-context/class.app-render-context";

describe("AppRenderContext", () => {
  const data = {
    responsePolicy: {
      robots: ["noindex"],
      nonce: "nonce-123",
      status: 200,
    },
    docOpen: {
      metadata: {},
      language: "en-GB",
      canonicalUrl: "https://example.com",
      inlineScripts: [],
      linkScripts: [],
      links: [],
      preload: [],
      nonce: "nonce-123",
      themeColour: "#000000",
    },
    bodyHeader: {
      branding: {},
      navigation: {},
      breadcrumbs: {},
    },
    bodyContent: {
      header: null,
      content: [],
      footer: [],
    },
    bodyFooter: {
      nav: {},
      affiliations: {},
      colophon: {},
    },
    docClose: {
      inlineScripts: [],
      linkScripts: [],
      svg: [],
      structuredData: [],
    },
  } as unknown as AppRenderContextData;

  const appRenderContext = new AppRenderContext(data);

  it("exposes raw data", () => {
    expect(appRenderContext.data).toBe(data);
  });

  it("exposes response policy", () => {
    expect(appRenderContext.responsePolicy).toBe(data.responsePolicy);
  });

  it("exposes doc open", () => {
    expect(appRenderContext.docOpen).toBe(data.docOpen);
  });

  it("exposes body header", () => {
    expect(appRenderContext.bodyHeader).toBe(data.bodyHeader);
  });

  it("exposes body content", () => {
    expect(appRenderContext.bodyContent).toBe(data.bodyContent);
  });

  it("exposes body footer", () => {
    expect(appRenderContext.bodyFooter).toBe(data.bodyFooter);
  });

  it("exposes doc close", () => {
    expect(appRenderContext.docClose).toBe(data.docClose);
  });

  it("exposes inspect payload", () => {
    expect(appRenderContext.inspect).toBe(data);
  });
});
