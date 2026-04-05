// tests/src/app/appContext/class.appContext.test.ts

import { AppContext } from "@app/appContext/class.appContext";
import { createAppState } from "@app/appState/create.appState";

import type {
  AppContextConfig,
  AppContextBranding,
} from "@app/appContext/appContext.types";
import type { DocumentRenderTarget } from "@app/request/request.document.types";
import type { Person, WebSite, WithContext } from "schema-dts";

describe("AppContext", () => {
  const appState = createAppState();

  const mockFooter = {
    affiliations: null,
    colophon: {
      copyrightName: "Kevin Ellen",
      copyrightYear: 2026,
    },
  };

  const mockBranding: AppContextBranding = {
    header: {
      href: "/",
      ariaLabel: "Kevin Ellen home",
      logoSvgId: "logo-monogram-ke",
    },
  };

  it("returns the stored request, site config, target, breadcrumbs, navigation, branding, structured data, assets, content, canonical url and security", () => {
    const request = new Request("https://example.com/");

    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const config: AppContextConfig = {
      request,
      security: {
        nonce: "test-nonce",
      },
      siteConfig: appState.getSiteConfig(),
      target,
      breadcrumbs: [
        {
          id: "home",
          label: "Home",
          href: "/",
        },
      ],
      navigation: {
        header: {
          primary: [
            {
              kind: "page",
              id: "home",
              label: "Home",
              href: "/",
              isCurrent: true,
              svgIconId: "icon-home",
            },
          ],
          social: [],
        },
        footer: {
          sections: [],
        },
      },
      branding: mockBranding,
      footer: mockFooter,
      structuredData: {
        person: {
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": "https://kevinellen.com/about#person",
          url: "https://kevinellen.com/about",
          name: "Kevin Ellen",
          jobTitle: "Technical SEO Manager",
          description: "Hello world",
          address: {
            "@type": "PostalAddress",
            addressRegion: "Essex",
            addressCountry: "GB",
          },
          knowsAbout: [],
        } as WithContext<Person>,
        website: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": "https://kevinellen.com/#website",
          url: "https://kevinellen.com/",
          name: "Kevin Ellen",
          description: "Wildlife photography, field notes, and technical work.",
          inLanguage: "en-GB",
          publisher: {
            "@id": "https://kevinellen.com/about#person",
          },
        } as WithContext<WebSite>,
        page: [],
      },
      assets: {
        scripts: [],
        svgs: [],
      },
      content: {
        head: {
          eyebrow: "Kevin Ellen",
          title: "Nature photography, writing, and technical architecture",
          intro:
            "A personal platform for photography, journal entries, articles, and transparent technical thinking.",
        },
        body: [
          {
            kind: "paragraph",
            inlines: [
              {
                kind: "text",
                text: "Homepage placeholder body content.",
              },
            ],
          },
        ],
        footer: ["Homepage placeholder footer content."],
      },
      canonicalUrl: "https://kevinellen.com/",
    };

    const appContext = new AppContext(config);

    expect(appContext.getRequest()).toBe(request);
    expect(appContext.getSiteConfig()).toBe(config.siteConfig);
    expect(appContext.getTarget()).toBe(target);
    expect(appContext.getBreadcrumbs()).toEqual(config.breadcrumbs);
    expect(appContext.getNavigation()).toEqual(config.navigation);
    expect(appContext.getBranding()).toEqual(config.branding);
    expect(appContext.getFooter()).toEqual(config.footer);
    expect(appContext.getStructuredData()).toEqual(config.structuredData);
    expect(appContext.getAssets()).toEqual(config.assets);
    expect(appContext.getContent()).toEqual(config.content);
    expect(appContext.getCanonicalUrl()).toBe(config.canonicalUrl);
    expect(appContext.getSecurity()).toEqual({
      nonce: "test-nonce",
    });
  });

  it("freezes the app context instance", () => {
    const request = new Request("https://example.com/");

    const target: DocumentRenderTarget = {
      kind: "error-page",
      page: appState.getErrorPageByStatus(404)!,
      status: 404,
    };

    const appContext = new AppContext({
      request,
      security: Object.freeze({
        nonce: "test-nonce",
      }),
      siteConfig: appState.getSiteConfig(),
      target,
      breadcrumbs: [],
      navigation: {
        header: {
          primary: [],
          social: [],
        },
        footer: {
          sections: [],
        },
      },
      branding: mockBranding,
      footer: mockFooter,
      structuredData: {
        person: {
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": "https://kevinellen.com/about#person",
          url: "https://kevinellen.com/about",
          name: "Kevin Ellen",
          jobTitle: "Technical SEO Manager",
          description: "Hello world",
          address: {
            "@type": "PostalAddress",
            addressRegion: "Essex",
            addressCountry: "GB",
          },
          knowsAbout: [],
        } as WithContext<Person>,
        website: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": "https://kevinellen.com/#website",
          url: "https://kevinellen.com/",
          name: "Kevin Ellen",
          description: "Wildlife photography, field notes, and technical work.",
          inLanguage: "en-GB",
          publisher: {
            "@id": "https://kevinellen.com/about#person",
          },
        } as WithContext<WebSite>,
        page: null,
      },
      assets: {
        scripts: [],
        svgs: [],
      },
      content: {
        head: {
          eyebrow: "404",
          title: "Page not found",
          intro:
            "The page you were looking for does not exist or is no longer available at this address.",
        },
        body: [
          {
            kind: "paragraph",
            inlines: [
              {
                kind: "text",
                text: "Please check the URL, return to the homepage, or use the site navigation to continue browsing.",
              },
            ],
          },
        ],
        footer: [],
      },
      canonicalUrl: null,
    });

    expect(Object.isFrozen(appContext)).toBe(true);
    expect(Object.isFrozen(appContext.getSecurity())).toBe(true);
  });
});
