// tests/src/app/appContext/create.appContext.test.ts

import { createAppContext } from "@app/appContext/create.appContext";
import { AppContext } from "@app/appContext/class.appContext";
import { createAppState } from "@app/appState/create.appState";

import type { DocumentRenderTarget } from "@app/request/request.document.types";

describe("createAppContext", () => {
  const appState = createAppState();

  it("returns an AppContext instance for a page target", () => {
    const req = new Request("https://example.com/");

    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const appContext = createAppContext(req, appState, target);

    expect(appContext).toBeInstanceOf(AppContext);
    expect(appContext.getRequest()).toBe(req);
    expect(appContext.getSiteConfig()).toBe(appState.getSiteConfig());
    expect(appContext.getTarget()).toBe(target);

    expect(appContext.getBreadcrumbs()).toEqual([
      {
        id: "home",
        label: "Home",
        href: "/",
      },
    ]);

    expect(appContext.getNavigation()).toEqual({
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
          {
            kind: "page",
            id: "journal",
            label: "Journal",
            href: "/journal",
            isCurrent: false,
          },
        ],
        social: [
          {
            kind: "social",
            id: "github",
            label: "GitHub",
            href: "https://github.com/Kevin-Ellen",
            isCurrent: false,
            svgId: "icon-github",
          },
          {
            kind: "social",
            id: "instagram",
            label: "Instagram",
            href: "https://www.instagram.com/photography.mallard",
            isCurrent: false,
            svgId: "icon-instagram",
          },
        ],
      },
      footer: {
        sections: [
          {
            id: "site",
            label: "Site",
            items: [
              {
                kind: "page",
                id: "journal",
                label: "Journal",
                href: "/journal",
                isCurrent: false,
              },
            ],
          },
          {
            id: "practice",
            label: "Practice",
            items: [],
          },
          {
            id: "elsewhere",
            label: "Elsewhere",
            items: [
              {
                kind: "social",
                id: "github",
                label: "GitHub",
                href: "https://github.com/Kevin-Ellen",
                isCurrent: false,
              },
              {
                kind: "social",
                id: "instagram",
                label: "Instagram",
                href: "https://www.instagram.com/photography.mallard",
                isCurrent: false,
              },
              {
                kind: "social",
                id: "linkedin",
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/kevinellen/",
                isCurrent: false,
              },
            ],
          },
          {
            id: "legal",
            label: "Legal",
            items: [],
          },
        ],
      },
    });

    expect(appContext.getStructuredData()).toEqual({
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
        knowsAbout: [
          "Wildlife photography",
          "Nature photography",
          "Bird photography",
          "Technical SEO",
          "Web performance",
          "Web architecture",
          "Cloudflare Workers",
          "Search engine optimisation",
          "Digital publishing",
        ],
      },
      website: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://kevinellen.com/#website",
        url: "https://kevinellen.com/",
        name: "Kevin Ellen",
        description:
          "Wildlife photography, field notes, and technical work exploring nature and digital publishing.",
        inLanguage: "en-GB",
        publisher: {
          "@id": "https://kevinellen.com/about#person",
        },
      },
      page: [],
    });

    expect(appContext.getAssets()).toEqual({
      scripts: expect.any(Array),
      svgs: expect.any(Array),
    });
  });

  it("returns an AppContext instance for an error-page target", () => {
    const req = new Request("https://example.com/missing");

    const target: DocumentRenderTarget = {
      kind: "error-page",
      page: appState.getErrorPageByStatus(404)!,
      status: 404,
    };

    const appContext = createAppContext(req, appState, target);

    expect(appContext).toBeInstanceOf(AppContext);
    expect(appContext.getRequest()).toBe(req);
    expect(appContext.getSiteConfig()).toBe(appState.getSiteConfig());
    expect(appContext.getTarget()).toBe(target);

    expect(appContext.getBreadcrumbs()).toEqual([]);

    expect(appContext.getNavigation()).toEqual({
      header: {
        primary: [
          {
            kind: "page",
            id: "home",
            label: "Home",
            href: "/",
            isCurrent: false,
            svgId: "icon-home",
          },
          {
            kind: "page",
            id: "journal",
            label: "Journal",
            href: "/journal",
            isCurrent: false,
          },
        ],
        social: [
          {
            kind: "social",
            id: "github",
            label: "GitHub",
            href: "https://github.com/Kevin-Ellen",
            isCurrent: false,
            svgId: "icon-github",
          },
          {
            kind: "social",
            id: "instagram",
            label: "Instagram",
            href: "https://www.instagram.com/photography.mallard",
            isCurrent: false,
            svgId: "icon-instagram",
          },
        ],
      },
      footer: {
        sections: [
          {
            id: "site",
            label: "Site",
            items: [
              {
                kind: "page",
                id: "journal",
                label: "Journal",
                href: "/journal",
                isCurrent: false,
              },
            ],
          },
          {
            id: "practice",
            label: "Practice",
            items: [],
          },
          {
            id: "elsewhere",
            label: "Elsewhere",
            items: [
              {
                kind: "social",
                id: "github",
                label: "GitHub",
                href: "https://github.com/Kevin-Ellen",
                isCurrent: false,
              },
              {
                kind: "social",
                id: "instagram",
                label: "Instagram",
                href: "https://www.instagram.com/photography.mallard",
                isCurrent: false,
              },
              {
                kind: "social",
                id: "linkedin",
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/kevinellen/",
                isCurrent: false,
              },
            ],
          },
          {
            id: "legal",
            label: "Legal",
            items: [],
          },
        ],
      },
    });

    expect(appContext.getStructuredData()).toEqual({
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
        knowsAbout: [
          "Wildlife photography",
          "Nature photography",
          "Bird photography",
          "Technical SEO",
          "Web performance",
          "Web architecture",
          "Cloudflare Workers",
          "Search engine optimisation",
          "Digital publishing",
        ],
      },
      website: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://kevinellen.com/#website",
        url: "https://kevinellen.com/",
        name: "Kevin Ellen",
        description:
          "Wildlife photography, field notes, and technical work exploring nature and digital publishing.",
        inLanguage: "en-GB",
        publisher: {
          "@id": "https://kevinellen.com/about#person",
        },
      },
      page: null,
    });

    expect(appContext.getAssets()).toEqual({
      scripts: expect.any(Array),
      svgs: expect.any(Array),
    });
  });
});
