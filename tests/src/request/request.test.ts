// tests/src/request/request.test.ts

import type { AppState } from "@app-state/class.app-state";

import { appStateCreate } from "@app-state/create.app-state";
import { appContextCreate } from "@app-context/create.app-context";
import { appRenderContextCreate } from "@app-render-context/create.app-render-context";

import { inspectRequest } from "@request/inspect/inspect.request";
import { preAppContextOrchestrator } from "@request/pre-app-context/pre-app-context.request";
import { preRequestOrchestrator } from "@request/pre-request/pre-request.request";
import { createHtmlResponse } from "@request/response/create-html.response.request";
import { requestOrchestrator } from "@request/request";
import { orchestrateRouteResolution } from "@request/routing/orchestrate.route-resolution.request";

import { render } from "@rendering/renderer";

jest.mock("@request/pre-request/pre-request.request", () => ({
  preRequestOrchestrator: jest.fn(),
}));

jest.mock("@request/pre-app-context/pre-app-context.request", () => ({
  preAppContextOrchestrator: jest.fn(),
}));

jest.mock("@app-state/create.app-state", () => ({
  appStateCreate: jest.fn(),
}));

jest.mock("@request/routing/orchestrate.route-resolution.request", () => ({
  orchestrateRouteResolution: jest.fn(),
}));

jest.mock("@app-context/create.app-context", () => ({
  appContextCreate: jest.fn(),
}));

jest.mock("@app-render-context/create.app-render-context", () => ({
  appRenderContextCreate: jest.fn(),
}));

jest.mock("@request/inspect/inspect.request", () => ({
  inspectRequest: jest.fn(),
}));

jest.mock("@rendering/renderer", () => ({
  render: jest.fn(),
}));

jest.mock("@request/response/create-html.response.request", () => ({
  createHtmlResponse: jest.fn(),
}));

const mockedPreRequestOrchestrator = jest.mocked(preRequestOrchestrator);
const mockedPreAppContextOrchestrator = jest.mocked(preAppContextOrchestrator);
const mockedAppStateCreate = jest.mocked(appStateCreate);
const mockedOrchestrateRouteResolution = jest.mocked(
  orchestrateRouteResolution,
);
const mockedAppContextCreate = jest.mocked(appContextCreate);
const mockedAppRenderContextCreate = jest.mocked(appRenderContextCreate);
const mockedInspectRequest = jest.mocked(inspectRequest);
const mockedRender = jest.mocked(render);
const mockedCreateHtmlResponse = jest.mocked(createHtmlResponse);

const buildPublicPage = (id: "home" | "about") => {
  if (id === "home") {
    return {
      id: "home",
      kind: "home",
      slug: "/",
      label: "Home",
      metadata: {
        pageTitle: "Home | Kevin Ellen",
        metaDescription: "Home page.",
      },
      robots: {
        allowIndex: true,
        allowFollow: true,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
      },
      assets: {
        scripts: [],
        svg: [],
      },
      breadcrumbs: ["home"],
      structuredData: [],
      content: {
        header: {
          eyebrow: null,
          title: "Home",
          intro: null,
        },
        content: [],
        footer: [],
      },
    };
  }

  return {
    id: "about",
    kind: "static",
    slug: "/about",
    label: "About",
    metadata: {
      pageTitle: "About | Kevin Ellen",
      metaDescription: "About page.",
    },
    robots: {
      allowIndex: true,
      allowFollow: true,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
    },
    assets: {
      scripts: [],
      svg: [],
    },
    breadcrumbs: ["home", "about"],
    structuredData: [],
    content: {
      header: {
        eyebrow: null,
        title: "About",
        intro: null,
      },
      content: [],
      footer: [],
    },
  };
};

const buildErrorPage = () => ({
  id: "error-410",
  status: 410,
  metadata: {
    pageTitle: "410 | Gone",
    metaDescription: "Gone.",
  },
  robots: {
    allowIndex: false,
    allowFollow: false,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
  },
  assets: {
    scripts: [],
    svg: [],
  },
  breadcrumbs: ["home", "error-410"] as const,
  content: {
    header: {
      eyebrow: null,
      title: "Gone",
      intro: null,
    },
    content: [],
    footer: [],
  },
});

const buildAppState = (): AppState =>
  ({
    inspect: { ok: true },
    siteConfig: {
      origin: "https://kevinellen.com",
      language: "en-GB",
      headAssets: {
        faviconIco: {
          href: "/favicon.ico",
        },
        faviconSvg: {
          href: "/favicon.svg",
          type: "image/svg+xml",
        },
        faviconPng: {
          href: "/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        appleTouchIcon: {
          href: "/apple-touch-icon.png",
        },
        manifest: {
          href: "/site.webmanifest",
        },
      },
      headerBranding: {
        href: "/",
        ariaLabel: "Kevin Ellen home",
        logo: {
          id: "logo-monogram-ke",
          width: 100,
          height: 100,
        },
      },
      preload: [],
    },
    manifest: {
      backgroundColor: "#ffffff",
    },
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
    getPublicPageById: jest.fn((id: string) => {
      if (id === "home" || id === "about") {
        return buildPublicPage(id);
      }

      return null;
    }),
    getErrorPageById: jest.fn((id: string) => {
      if (id === "error-410") {
        return buildErrorPage();
      }

      return null;
    }),
    getErrorPageByStatus: jest.fn().mockReturnValue(buildErrorPage()),
  }) as unknown as AppState;

describe("requestOrchestrator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedInspectRequest.mockReturnValue(null);
  });

  it("returns the pre-request response when one is provided", async () => {
    const req = new Request("https://kevinellen.com/favicon.ico");
    const env = {
      APP_HOST: "kevinellen.com",
    } as unknown as Env;
    const ctx = {} as ExecutionContext;

    const preRequestResponse = new Response("asset");

    mockedPreRequestOrchestrator.mockResolvedValue(preRequestResponse);

    const result = await requestOrchestrator(req, env, ctx);

    expect(mockedPreRequestOrchestrator).toHaveBeenCalledTimes(1);
    expect(mockedPreRequestOrchestrator).toHaveBeenCalledWith(req, env, ctx);

    expect(mockedAppStateCreate).not.toHaveBeenCalled();
    expect(mockedPreAppContextOrchestrator).not.toHaveBeenCalled();
    expect(mockedOrchestrateRouteResolution).not.toHaveBeenCalled();
    expect(mockedInspectRequest).not.toHaveBeenCalled();

    expect(result).toBe(preRequestResponse);
  });

  it("returns the pre-app-context direct response when one is provided", async () => {
    const req = new Request("https://kevinellen.com/robots.txt");
    const env = {
      APP_HOST: "kevinellen.com",
    } as unknown as Env;
    const ctx = {} as ExecutionContext;

    const appState = buildAppState();

    const preAppContextResponse = new Response("robots", {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    });

    mockedPreRequestOrchestrator.mockResolvedValue(null);
    mockedAppStateCreate.mockResolvedValue(appState);
    mockedPreAppContextOrchestrator.mockResolvedValue({
      kind: "direct-response",
      response: preAppContextResponse,
    });

    const result = await requestOrchestrator(req, env, ctx);

    expect(mockedPreRequestOrchestrator).toHaveBeenCalledWith(req, env, ctx);
    expect(mockedAppStateCreate).toHaveBeenCalledWith(env);
    expect(mockedPreAppContextOrchestrator).toHaveBeenCalledWith(
      req,
      env,
      appState,
    );

    expect(mockedOrchestrateRouteResolution).not.toHaveBeenCalled();
    expect(mockedInspectRequest).not.toHaveBeenCalled();

    expect(result).toBe(preAppContextResponse);
  });

  it("renders the app render context and returns the HTML response", async () => {
    const req = new Request("https://kevinellen.com/about");
    const env = {
      APP_HOST: "kevinellen.com",
    } as unknown as Env;
    const ctx = {} as ExecutionContext;

    const appState = buildAppState();
    const preAppContext = { kind: "continue" };
    const routing = { kind: "found", publicPageId: "about" };
    const appContext = { page: { id: "about" } };
    const appRenderContext = {
      responsePolicy: {
        status: 200,
        robots: [],
        nonce: "test-nonce",
      },
    };

    const document = "<!doctype html><html></html>";
    const htmlResponse = new Response(document, { status: 200 });

    mockedPreRequestOrchestrator.mockResolvedValue(null);
    mockedAppStateCreate.mockResolvedValue(appState);
    mockedPreAppContextOrchestrator.mockResolvedValue(preAppContext as never);
    mockedOrchestrateRouteResolution.mockReturnValue(routing as never);
    mockedAppContextCreate.mockReturnValue(appContext as never);
    mockedAppRenderContextCreate.mockReturnValue(appRenderContext as never);
    mockedRender.mockReturnValue(document);
    mockedCreateHtmlResponse.mockReturnValue(htmlResponse);

    const result = await requestOrchestrator(req, env, ctx);

    expect(mockedOrchestrateRouteResolution).toHaveBeenCalledWith(
      req,
      appState,
      preAppContext,
    );

    expect(mockedAppContextCreate).toHaveBeenCalledWith(appState, routing);
    expect(mockedAppRenderContextCreate).toHaveBeenCalledWith(appContext, env);

    expect(mockedInspectRequest).toHaveBeenCalledWith(req, env, {
      appState,
      routing,
      appContext,
      appRenderContext,
    });

    expect(mockedRender).toHaveBeenCalledWith(appRenderContext);

    expect(mockedCreateHtmlResponse).toHaveBeenCalledWith(
      document,
      appRenderContext,
    );

    expect(result).toBe(htmlResponse);
  });

  it("returns the inspect response after app render context creation when one is provided", async () => {
    const req = new Request(
      "https://kevinellen.com/_inspect/app-render-context",
    );
    const env = {
      APP_HOST: "kevinellen.com",
    } as unknown as Env;
    const ctx = {} as ExecutionContext;

    const appState = buildAppState();
    const preAppContext = { kind: "continue" };
    const routing = { kind: "found", publicPageId: "about" };
    const appContext = { page: { id: "about" } };
    const appRenderContext = {
      responsePolicy: {
        status: 200,
        robots: [],
        nonce: "test-nonce",
      },
    };

    const inspectResponse = new Response("inspect", { status: 200 });

    mockedPreRequestOrchestrator.mockResolvedValue(null);
    mockedAppStateCreate.mockResolvedValue(appState);
    mockedPreAppContextOrchestrator.mockResolvedValue(preAppContext as never);
    mockedOrchestrateRouteResolution.mockReturnValue(routing as never);
    mockedAppContextCreate.mockReturnValue(appContext as never);
    mockedAppRenderContextCreate.mockReturnValue(appRenderContext as never);
    mockedInspectRequest.mockReturnValue(inspectResponse);

    const result = await requestOrchestrator(req, env, ctx);

    expect(mockedInspectRequest).toHaveBeenCalledWith(req, env, {
      appState,
      routing,
      appContext,
      appRenderContext,
    });

    expect(mockedRender).not.toHaveBeenCalled();
    expect(mockedCreateHtmlResponse).not.toHaveBeenCalled();

    expect(result).toBe(inspectResponse);
  });
});
