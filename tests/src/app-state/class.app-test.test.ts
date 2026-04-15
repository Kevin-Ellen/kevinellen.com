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
      error: [],
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

  it("returns inspect", () => {
    const appState = new AppState(data);

    expect(appState.inspect).toBe(data);
  });
});
