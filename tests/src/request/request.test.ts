// tests/src/request/request.test.ts

import type { AppState } from "@app-state/class.app-state";
import { appStateCreate } from "@app-state/create.app-state";
import { inspectRequest } from "@request/inspect/inspect.request";
import { preAppContextOrchestrator } from "@request/pre-app-context/pre-app-context.request";
import { preRequestOrchestrator } from "@request/pre-request/pre-request.request";
import { requestOrchestrator } from "@request/request";
import { orchestrateRouteResolution } from "@request/routing/orchestrate.route-resolution.request";

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

jest.mock("@request/inspect/inspect.request", () => ({
  inspectRequest: jest.fn(),
}));

const mockedPreRequestOrchestrator = jest.mocked(preRequestOrchestrator);
const mockedPreAppContextOrchestrator = jest.mocked(preAppContextOrchestrator);
const mockedAppStateCreate = jest.mocked(appStateCreate);
const mockedOrchestrateRouteResolution = jest.mocked(
  orchestrateRouteResolution,
);
const mockedInspectRequest = jest.mocked(inspectRequest);

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
    mockedAppStateCreate.mockReturnValue(appState);
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
});
