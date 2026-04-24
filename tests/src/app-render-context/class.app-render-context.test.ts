// tests/src/app-render-context/class.app-render-context.test.ts

import { AppRenderContext } from "@app-render-context/class.app-render-context";

import type { AppRenderContextData } from "@app-render-context/app-render-context.types";

describe("AppRenderContext", () => {
  const mockData = {
    docOpen: {
      doctype: "<!doctype html>",
      htmlAttributes: {
        lang: "en-GB",
      },
      head: {
        title: "About | Kevin Ellen",
        meta: [],
        links: [],
        scripts: [],
        structuredData: [],
      },
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
    },
    bodyContent: {
      page: {
        id: "about",
        kind: "static",
      },
      content: [],
    },
    bodyFooter: {
      affiliations: null,
      colophon: {
        copyright: "© 2026 Kevin Ellen. All rights reserved.",
      },
    },
    docClose: {
      scripts: [],
    },
  } as unknown as AppRenderContextData;

  it("stores the provided app render context data", () => {
    const appRenderContext = new AppRenderContext(mockData);

    expect(appRenderContext.data).toBe(mockData);
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
    expect(appRenderContext.docOpen).toBe(appRenderContext.docOpen);
    expect(appRenderContext.bodyHeader).toBe(appRenderContext.bodyHeader);
    expect(appRenderContext.bodyContent).toBe(appRenderContext.bodyContent);
    expect(appRenderContext.bodyFooter).toBe(appRenderContext.bodyFooter);
    expect(appRenderContext.docClose).toBe(appRenderContext.docClose);
    expect(appRenderContext.inspect).toBe(appRenderContext.inspect);
  });
});
