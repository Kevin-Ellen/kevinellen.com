// tests/src/app-state/class.app-state.test.ts

import { AppState } from "@app-state/class.app-state";

import type { AppStateData } from "@app-state/types/app-state.types";

describe("AppState", () => {
  const data = {
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
      goneRules: [{ path: "/gone-page" }],
      redirectRules: [
        {
          fromPath: "/old-page",
          to: "/new-page",
          redirectStatusCode: 301,
        },
      ],
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
    metadataLabels: {
      location: {
        label: "Location",
      },
      shutterSpeed: {
        label: "Shutter speed",
        description: "How long the camera sensor was exposed to light.",
      },
      aperture: {
        label: "Aperture",
        description: "The size of the lens opening controlling light intake.",
      },
      focalLength: {
        label: "Focal length",
        description: "The zoom level or field of view used for the photograph.",
      },
      iso: {
        label: "ISO",
        description: "The camera’s sensitivity to light.",
      },
      publishedAt: {
        label: "Published",
      },
      lastUpdatedAt: {
        label: "Last updated",
      },
      capturedAt: {
        label: "Captured",
      },
      author: {
        label: "Author",
      },
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
      public: [
        {
          id: "home",
          kind: "home",
          slug: "/",
          label: "Home",
          metadata: {
            pageTitle: "Kevin Ellen",
            metaDescription: "Nature photography and technical architecture.",
          },
          breadcrumbs: ["home"],
          content: {
            head: {
              eyebrow: "Kevin Ellen",
              title: "Nature photography, writing, and technical architecture",
              intro: "A personal platform.",
            },
            body: [],
            footer: [],
          },
          robots: {
            allowIndex: true,
            allowFollow: true,
            noarchive: false,
            nosnippet: false,
            noimageindex: false,
          },
          robotsTxt: {
            disallow: false,
          },
          sitemapXml: {
            include: true,
          },
          assets: {
            scripts: [],
            svg: [],
          },
          structuredData: [],
        },
      ],
      error: [
        {
          id: "error-404",
          status: 404,
          label: "Not Found",
          metadata: {
            pageTitle: "404 | Page not found",
            metaDescription: "The page could not be found.",
          },
          breadcrumbs: ["home", "error-404"],
          content: {
            head: {
              eyebrow: "Error",
              title: "Page not found",
              intro: "The page you were looking for does not exist.",
            },
            body: [],
            footer: [],
          },
          robots: {
            allowIndex: false,
            allowFollow: false,
            noarchive: true,
            nosnippet: true,
            noimageindex: true,
          },
          robotsTxt: {
            disallow: true,
          },
          sitemapXml: {
            include: false,
          },
          assets: {
            scripts: [],
            svg: [],
          },
          structuredData: [],
        },
      ],
    },
  } as unknown as AppStateData;

  it("returns siteConfig", () => {
    const appState = new AppState(data);

    expect(appState.siteConfig).toBe(data.siteConfig);
  });

  it("returns goneRules", () => {
    const appState = new AppState(data);

    expect(appState.goneRules).toBe(data.system.goneRules);
  });

  it("returns redirectRules", () => {
    const appState = new AppState(data);

    expect(appState.redirectRules).toBe(data.system.redirectRules);
  });

  it("returns manifest", () => {
    const appState = new AppState(data);

    expect(appState.manifest).toBe(data.webManifest);
  });

  it("returns publicPages", () => {
    const appState = new AppState(data);

    expect(appState.publicPages).toBe(data.pages.public);
  });

  it("returns errorPages", () => {
    const appState = new AppState(data);

    expect(appState.errorPages).toBe(data.pages.error);
  });

  it("returns the matching gone rule by path", () => {
    const appState = new AppState(data);

    expect(appState.getGoneRuleByPath("/gone-page")).toBe(
      data.system.goneRules[0],
    );
  });

  it("returns null when no gone rule matches the path", () => {
    const appState = new AppState(data);

    expect(appState.getGoneRuleByPath("/missing-page")).toBeNull();
  });

  it("returns the matching redirect rule by path", () => {
    const appState = new AppState(data);

    expect(appState.getRedirectRuleByPath("/old-page")).toBe(
      data.system.redirectRules[0],
    );
  });

  it("returns null when no redirect rule matches the path", () => {
    const appState = new AppState(data);

    expect(appState.getRedirectRuleByPath("/missing-page")).toBeNull();
  });

  it("returns the matching public page by slug", () => {
    const appState = new AppState(data);

    expect(appState.getPublicPageBySlug("/")).toBe(data.pages.public[0]);
  });

  it("returns null when no public page matches the slug", () => {
    const appState = new AppState(data);

    expect(appState.getPublicPageBySlug("/missing-page")).toBeNull();
  });

  it("returns the matching error page by status", () => {
    const appState = new AppState(data);

    expect(appState.getErrorPageByStatus(404)).toBe(data.pages.error[0]);
  });

  it("returns null when no error page matches the status", () => {
    const appState = new AppState(data);

    expect(appState.getErrorPageByStatus(410)).toBeNull();
  });

  it("returns inspect", () => {
    const appState = new AppState(data);

    expect(appState.inspect).toBe(data);
  });

  it("returns social", () => {
    const appState = new AppState(data);

    expect(appState.social).toBe(data.social);
  });

  it("returns navigation", () => {
    const appState = new AppState(data);

    expect(appState.navigation).toBe(data.navigation);
  });

  it("returns globalFooter", () => {
    const appState = new AppState(data);

    expect(appState.globalFooter).toBe(data.globalFooter);
  });

  it("returns assets", () => {
    const appState = new AppState(data);

    expect(appState.assets).toBe(data.assets);
  });

  it("returns structuredData", () => {
    const appState = new AppState(data);

    expect(appState.structuredData).toBe(data.structuredData);
  });

  it("returns the matching public page by id", () => {
    const appState = new AppState(data);

    expect(appState.getPublicPageById("home")).toBe(data.pages.public[0]);
  });

  it("returns null when no public page matches the id", () => {
    const appState = new AppState(data);

    expect(appState.getPublicPageById("about" as never)).toBeNull();
  });

  it("returns the matching error page by id", () => {
    const appState = new AppState(data);

    expect(appState.getErrorPageById("error-404")).toBe(data.pages.error[0]);
  });

  it("returns null when no error page matches the id", () => {
    const appState = new AppState(data);

    expect(appState.getErrorPageById("error-410" as never)).toBeNull();
  });

  it("returns metadataLabels", () => {
    const appState = new AppState(data);

    expect(appState.metadataLabels).toBe(data.metadataLabels);
  });

  it("returns getPublicPages", () => {
    const appState = new AppState(data);

    expect(appState.getPublicPages).toBe(data.pages.public);
  });
});
