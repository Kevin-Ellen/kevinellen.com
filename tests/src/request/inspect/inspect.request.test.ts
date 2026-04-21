// tests/src/request/inspect/inspect.request.test.ts

import { AppState } from "@app-state/class.app-state";
import { inspectRequest } from "@request/inspect/inspect.request";

import type { AppStateData } from "@app-state/types/app-state.types";
import type { RoutingResult } from "@request/types/request.types";

describe("inspectRequest", () => {
  const envDev = { APP_ENV: "dev" } as Env;
  const envProd = { APP_ENV: "prod" } as Env;

  const appStateData = {
    siteConfig: {
      siteName: "Kevin Ellen",
      author: "Kevin Ellen",
      language: "en-GB",
      description: "Wildlife photography, field notes, and technical work.",
      headerBranding: {
        homeHref: "/",
        ariaLabel: "Kevin Ellen home",
        logo: {
          type: "inline-svg",
          svg: "logo-monogram-ke",
        },
      },
      headAssets: {
        faviconIco: {
          href: "/favicon.ico",
        },
        faviconSvg: {
          href: "/assets/icons/ke-monogram-logo.svg",
          type: "image/svg+xml",
        },
        faviconPng: {
          href: "/assets/icons/favicon-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
        appleTouchIcon: {
          href: "/apple-touch-icon.png",
        },
        manifest: {
          href: "/manifest.webmanifest",
        },
      },
      assets: {
        scripts: [],
        svgs: [],
      },
      host: "dev.kevinellen.com",
      origin: "https://dev.kevinellen.com",
    },
    webManifest: {
      shortName: "KevinE",
      themeColor: "#1f2621",
      backgroundColor: "#1f2621",
      display: "minimal-ui",
      name: "Kevin Ellen",
      scope: "/",
      description: "Wildlife photography, field notes, and technical work.",
      startUrl: "https://dev.kevinellen.com/",
      icons: [],
    },
    system: {
      goneRules: [],
      redirectRules: [],
    },
    assets: {
      scripts: [],
      svg: [],
    },
    globalFooter: {
      affiliations: {
        kind: "affiliations",
        title: "Conservation",
        description: "Supporting organisations.",
        items: [],
      },
      colophon: {
        kind: "colophon",
        copyrightName: "Kevin Ellen",
        copyrightYear: 2026,
        allRightsReserved: true,
      },
    },
    social: {},
    metadataLabels: {},
    navigation: {
      header: {
        primary: [],
        social: [],
      },
      footer: {
        sections: [],
      },
    },
    structuredData: {
      website: {
        id: {
          pageId: "home",
          hash: "#website",
        },
        url: {
          pageId: "home",
        },
        name: "Kevin Ellen",
        description: "Wildlife photography, field notes, and technical work.",
        inLanguage: "en-GB",
        publisherId: {
          pageId: "about",
          hash: "#person",
        },
      },
    },
    pages: {
      public: [],
      error: [],
    },
  } as unknown as AppStateData;

  const appState = new AppState(appStateData);

  const routing: RoutingResult = {
    kind: "found",
    publicPageId: "home",
  };

  it("returns null outside dev", () => {
    const req = new Request("https://dev.kevinellen.com/_inspect");

    const result = inspectRequest(req, envProd, { appState, routing });

    expect(result).toBeNull();
  });

  it("returns null for non-inspect paths", () => {
    const req = new Request("https://dev.kevinellen.com/about");

    const result = inspectRequest(req, envDev, { appState, routing });

    expect(result).toBeNull();
  });

  it("returns the inspect index route", async () => {
    const req = new Request("https://dev.kevinellen.com/_inspect");

    const result = inspectRequest(req, envDev, {});

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(200);
    expect(result?.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );

    await expect(result?.json()).resolves.toEqual({
      available: [
        "/_inspect/app-state",
        "/_inspect/routing",
        "/_inspect/app-context",
        "/_inspect/render-context",
      ],
    });
  });

  it("returns the app-state inspect payload", async () => {
    const req = new Request("https://dev.kevinellen.com/_inspect/app-state");

    const result = inspectRequest(req, envDev, { appState });

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(200);

    await expect(result?.json()).resolves.toEqual(appState.inspect);
  });

  it("returns a 409 response when app-state is not available", async () => {
    const req = new Request("https://dev.kevinellen.com/_inspect/app-state");

    const result = inspectRequest(req, envDev, {});

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(409);

    await expect(result?.json()).resolves.toEqual({
      error: "Inspect target 'app-state' is not available at this stage.",
    });
  });

  it("returns the routing payload", async () => {
    const req = new Request("https://dev.kevinellen.com/_inspect/routing");

    const result = inspectRequest(req, envDev, { routing });

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(200);

    await expect(result?.json()).resolves.toEqual(routing);
  });

  it("returns a 409 response when routing is not available", async () => {
    const req = new Request("https://dev.kevinellen.com/_inspect/routing");

    const result = inspectRequest(req, envDev, {});

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(409);

    await expect(result?.json()).resolves.toEqual({
      error: "Inspect target 'routing' is not available at this stage.",
    });
  });

  it("returns a 409 response when app-context is not available", async () => {
    const req = new Request("https://dev.kevinellen.com/_inspect/app-context");

    const result = inspectRequest(req, envDev, {});

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(409);

    await expect(result?.json()).resolves.toEqual({
      error: "Inspect target 'app-context' is not available at this stage.",
    });
  });

  it("returns a 409 response when render-context is not available", async () => {
    const req = new Request(
      "https://dev.kevinellen.com/_inspect/render-context",
    );

    const result = inspectRequest(req, envDev, {});

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(409);

    await expect(result?.json()).resolves.toEqual({
      error: "Inspect target 'render-context' is not available at this stage.",
    });
  });

  it("returns 404 for an unknown inspect route", async () => {
    const req = new Request("https://dev.kevinellen.com/_inspect/not-real");

    const result = inspectRequest(req, envDev, {});

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(404);

    await expect(result?.json()).resolves.toEqual({
      error: "Unknown inspect route.",
    });
  });

  it("returns the app-context inspect payload", async () => {
    const req = new Request("https://dev.kevinellen.com/_inspect/app-context");

    const appContext = {
      inspect: {
        navigation: {
          header: {
            primary: [],
            social: [],
          },
          footer: {
            sections: [],
          },
        },
        globalFooter: {
          affiliations: {
            kind: "affiliations",
            title: "Conservation",
            description: "Supporting organisations.",
            items: [],
          },
          colophon: {
            kind: "colophon",
            copyrightName: "Kevin Ellen",
            copyrightYear: 2026,
            allRightsReserved: true,
          },
        },
        assets: {
          scripts: [],
          svg: [],
        },
        structuredData: [],
        breadcrumbs: {
          items: [],
          current: "Home",
        },
        page: {
          id: "home",
          kind: "home",
          slug: "/",
          label: "Home",
          content: {
            head: {
              eyebrow: "Kevin Ellen",
              title: "Home",
              intro: "A personal platform.",
            },
            body: [],
            footer: [],
          },
        },
      },
    };

    const result = inspectRequest(req, envDev, {
      appContext: appContext as never,
    });

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(200);
    expect(result?.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );

    await expect(result?.json()).resolves.toEqual(appContext.inspect);
  });

  it("returns the render-context payload", async () => {
    const req = new Request(
      "https://dev.kevinellen.com/_inspect/render-context",
    );

    const renderContext = {
      page: {
        title: "Home",
      },
      content: {
        body: [],
      },
    };

    const result = inspectRequest(req, envDev, { renderContext });

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(200);
    expect(result?.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );

    await expect(result?.json()).resolves.toEqual(renderContext);
  });
});
