// tests/src/app-render-context/class.app-render-context.test.ts

import { AppRenderContext } from "@app-render-context/class.app-render-context";

import type { AppRenderContextData } from "@app-render-context/app-render-context.types";

describe("AppRenderContext", () => {
  const mockData = {
    responsePolicy: {
      status: 200,
      robots: [],
      nonce: "test-nonce",
    },
    docOpen: {
      metadata: {
        pageTitle: "About | Kevin Ellen",
        metaDescription: "About Page meta description.",
      },
      language: "en-GB",
      canonicalUrl: "https://dev.kevinellen.com/about",
      inlineScripts: [],
      linkScripts: [],
      links: [],
      preload: [],
      nonce: "test-nonce",
      themeColour: "#1f2621",
    },
    bodyHeader: {
      branding: {
        href: "/",
        ariaLabel: "Kevin Ellen home",
        logo: {
          id: "logo-monogram-ke",
          width: 100,
          height: 100,
        },
      },
      navigation: {
        primary: [],
        social: [],
      },
      breadcrumbs: {
        items: [],
        current: "About",
      },
    },
    bodyContent: {
      header: {
        eyebrow: null,
        title: "About",
        intro: null,
      },
      content: [],
      footer: [],
    },
    bodyFooter: {
      nav: {
        sections: [],
      },
      affiliations: {
        items: [],
      },
      colophon: {
        items: [],
      },
    },
    docClose: {
      inlineScripts: [],
      linkScripts: [],
      svg: [],
      structuredData: [],
    },
  } as unknown as AppRenderContextData;

  it("stores the provided app render context data", () => {
    const appRenderContext = new AppRenderContext(mockData);

    expect(appRenderContext.data).toBe(mockData);
  });

  it("returns responsePolicy from the provided data", () => {
    const appRenderContext = new AppRenderContext(mockData);

    expect(appRenderContext.responsePolicy).toBe(mockData.responsePolicy);
  });

  it("returns docOpen from the provided data", () => {
    const appRenderContext = new AppRenderContext(mockData);

    expect(appRenderContext.docOpen).toBe(mockData.docOpen);
  });

  it("returns bodyHeader from the provided data", () => {
    const appRenderContext = new AppRenderContext(mockData);

    expect(appRenderContext.bodyHeader).toBe(mockData.bodyHeader);
  });

  it("returns bodyContent from the provided data", () => {
    const appRenderContext = new AppRenderContext(mockData);

    expect(appRenderContext.bodyContent).toBe(mockData.bodyContent);
  });

  it("returns bodyFooter from the provided data", () => {
    const appRenderContext = new AppRenderContext(mockData);

    expect(appRenderContext.bodyFooter).toBe(mockData.bodyFooter);
  });

  it("returns docClose from the provided data", () => {
    const appRenderContext = new AppRenderContext(mockData);

    expect(appRenderContext.docClose).toBe(mockData.docClose);
  });

  it("returns the full original object through inspect", () => {
    const appRenderContext = new AppRenderContext(mockData);

    expect(appRenderContext.inspect).toBe(mockData);
  });

  it("returns stable references across repeated getter calls", () => {
    const appRenderContext = new AppRenderContext(mockData);

    expect(appRenderContext.data).toBe(appRenderContext.data);
    expect(appRenderContext.responsePolicy).toBe(
      appRenderContext.responsePolicy,
    );
    expect(appRenderContext.docOpen).toBe(appRenderContext.docOpen);
    expect(appRenderContext.bodyHeader).toBe(appRenderContext.bodyHeader);
    expect(appRenderContext.bodyContent).toBe(appRenderContext.bodyContent);
    expect(appRenderContext.bodyFooter).toBe(appRenderContext.bodyFooter);
    expect(appRenderContext.docClose).toBe(appRenderContext.docClose);
    expect(appRenderContext.inspect).toBe(appRenderContext.inspect);
  });
});
