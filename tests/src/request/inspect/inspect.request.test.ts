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
        faviconIco: { href: "/favicon.ico" },
        faviconSvg: {
          href: "/assets/icons/ke-monogram-logo.svg",
          type: "image/svg+xml",
        },
        faviconPng: {
          href: "/assets/icons/favicon-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
        appleTouchIcon: { href: "/apple-touch-icon.png" },
        manifest: { href: "/manifest.webmanifest" },
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
    pagination: null,
  };

  const appContext = {
    inspect: {
      boundary: "app-context",
      page: {
        id: "home",
      },
    },
  };

  const appRenderContext = {
    inspect: {
      boundary: "app-render-context",
      page: {
        id: "home",
      },
    },
  };

  it("returns null outside dev", () => {
    const req = new Request("https://dev.kevinellen.com/about?__inspect");

    const result = inspectRequest(req, envProd, {
      appState,
      routing,
      appContext: appContext as never,
      appRenderContext: appRenderContext as never,
    });

    expect(result).toBeNull();
  });

  it("returns null when the inspect query param is missing", () => {
    const req = new Request("https://dev.kevinellen.com/about");

    const result = inspectRequest(req, envDev, {
      appState,
      routing,
      appContext: appContext as never,
      appRenderContext: appRenderContext as never,
    });

    expect(result).toBeNull();
  });

  it("returns the available inspect targets for bare __inspect", async () => {
    const req = new Request("https://dev.kevinellen.com/about?__inspect");

    const result = inspectRequest(req, envDev, {});

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(200);
    expect(result?.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );

    await expect(result?.json()).resolves.toEqual({
      queryParam: "__inspect",
      usage: [
        "?__inspect",
        "?__inspect=available",
        "?__inspect=app-state",
        "?__inspect=routing",
        "?__inspect=app-context",
        "?__inspect=app-render-context",
      ],
      availableTargets: [
        "available",
        "app-state",
        "routing",
        "app-context",
        "app-render-context",
      ],
    });
  });

  it("returns the available inspect targets for __inspect=available", async () => {
    const req = new Request(
      "https://dev.kevinellen.com/about?__inspect=available",
    );

    const result = inspectRequest(req, envDev, {});

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(200);

    await expect(result?.json()).resolves.toMatchObject({
      queryParam: "__inspect",
      availableTargets: [
        "available",
        "app-state",
        "routing",
        "app-context",
        "app-render-context",
      ],
    });
  });

  it("returns the app-state inspect payload", async () => {
    const req = new Request(
      "https://dev.kevinellen.com/about?__inspect=app-state",
    );

    const result = inspectRequest(req, envDev, { appState });

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(200);

    await expect(result?.json()).resolves.toEqual(appState.inspect);
  });

  it("returns the routing payload", async () => {
    const req = new Request(
      "https://dev.kevinellen.com/about?__inspect=routing",
    );

    const result = inspectRequest(req, envDev, { routing });

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(200);

    await expect(result?.json()).resolves.toEqual(routing);
  });

  it("returns the app-context inspect payload", async () => {
    const req = new Request(
      "https://dev.kevinellen.com/about?__inspect=app-context",
    );

    const result = inspectRequest(req, envDev, {
      appContext: appContext as never,
    });

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(200);

    await expect(result?.json()).resolves.toEqual(appContext.inspect);
  });

  it("returns the app-render-context inspect payload", async () => {
    const req = new Request(
      "https://dev.kevinellen.com/about?__inspect=app-render-context",
    );

    const result = inspectRequest(req, envDev, {
      appRenderContext: appRenderContext as never,
    });

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(200);

    await expect(result?.json()).resolves.toEqual(appRenderContext.inspect);
  });

  it("returns 409 when app-state is requested but unavailable", async () => {
    const req = new Request(
      "https://dev.kevinellen.com/about?__inspect=app-state",
    );

    const result = inspectRequest(req, envDev, {});

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(409);

    await expect(result?.json()).resolves.toEqual({
      error: "Inspect target 'app-state' is not available at this stage.",
      availableTargets: [
        "available",
        "app-state",
        "routing",
        "app-context",
        "app-render-context",
      ],
    });
  });

  it("returns 409 when routing is requested but unavailable", async () => {
    const req = new Request(
      "https://dev.kevinellen.com/about?__inspect=routing",
    );

    const result = inspectRequest(req, envDev, {});

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(409);

    await expect(result?.json()).resolves.toEqual({
      error: "Inspect target 'routing' is not available at this stage.",
      availableTargets: [
        "available",
        "app-state",
        "routing",
        "app-context",
        "app-render-context",
      ],
    });
  });

  it("returns 409 when app-context is requested but unavailable", async () => {
    const req = new Request(
      "https://dev.kevinellen.com/about?__inspect=app-context",
    );

    const result = inspectRequest(req, envDev, {});

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(409);

    await expect(result?.json()).resolves.toEqual({
      error: "Inspect target 'app-context' is not available at this stage.",
      availableTargets: [
        "available",
        "app-state",
        "routing",
        "app-context",
        "app-render-context",
      ],
    });
  });

  it("returns 409 when app-render-context is requested but unavailable", async () => {
    const req = new Request(
      "https://dev.kevinellen.com/about?__inspect=app-render-context",
    );

    const result = inspectRequest(req, envDev, {});

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(409);

    await expect(result?.json()).resolves.toEqual({
      error:
        "Inspect target 'app-render-context' is not available at this stage.",
      availableTargets: [
        "available",
        "app-state",
        "routing",
        "app-context",
        "app-render-context",
      ],
    });
  });

  it("returns 400 for an unknown inspect target", async () => {
    const req = new Request(
      "https://dev.kevinellen.com/about?__inspect=banana",
    );

    const result = inspectRequest(req, envDev, {});

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(400);

    await expect(result?.json()).resolves.toEqual({
      error: "Unknown inspect target 'banana'.",
      availableTargets: [
        "available",
        "app-state",
        "routing",
        "app-context",
        "app-render-context",
      ],
    });
  });

  it("works independently of pathname", async () => {
    const req = new Request(
      "https://dev.kevinellen.com/old-page?__inspect=routing",
    );

    const result = inspectRequest(req, envDev, { routing });

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(200);

    await expect(result?.json()).resolves.toEqual(routing);
  });

  it("does not treat old inspect paths as inspect requests without the query param", () => {
    const req = new Request("https://dev.kevinellen.com/_inspect/app-state");

    const result = inspectRequest(req, envDev, { appState });

    expect(result).toBeNull();
  });
});
