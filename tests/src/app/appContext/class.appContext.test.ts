// tests/src/app/appContext/class.appContext.test.ts

import { AppContext } from "@app/appContext/class.appContext";
import { createAppState } from "@app/appState/create.appState";

import type { AppContextConfig } from "@app/appContext/appContext.types";
import type { DocumentRenderTarget } from "@app/request/request.document.types";
import type { WithContext, Person, WebSite } from "schema-dts";

describe("AppContext", () => {
  const appState = createAppState();

  it("returns the stored request, site config, target, breadcrumbs, navigation, structured data and assets", () => {
    const request = new Request("https://example.com/");

    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const config: AppContextConfig = {
      request,
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
              svgId: "icon-home",
            },
          ],
          social: [],
        },
        footer: {
          sections: [],
        },
      },
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
    };

    const appContext = new AppContext(config);

    expect(appContext.getRequest()).toBe(request);
    expect(appContext.getSiteConfig()).toBe(config.siteConfig);
    expect(appContext.getTarget()).toBe(target);
    expect(appContext.getBreadcrumbs()).toEqual(config.breadcrumbs);
    expect(appContext.getNavigation()).toEqual(config.navigation);
    expect(appContext.getStructuredData()).toEqual(config.structuredData);
    expect(appContext.getAssets()).toEqual(config.assets);
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
    });

    expect(Object.isFrozen(appContext)).toBe(true);
  });
});
