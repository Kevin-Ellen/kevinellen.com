// tests/src/app/appContext/create.appContext.test.ts

import { AppContext } from "@app/appContext/class.appContext";
import { createAppContext } from "@app/appContext/create.appContext";
import { createAppState } from "@app/appState/create.appState";

import type { DocumentRenderTarget } from "@app/request/request.document.types";

describe("createAppContext", () => {
  const appState = createAppState();

  const env = {
    APP_ENV: "prod",
    APP_HOST: "kevinellen.com",
  } as Env;

  it("returns an AppContext instance for a page target", () => {
    const req = new Request("https://example.com/");

    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const appContext = createAppContext(req, env, appState, target);

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

    expect(appContext.getContent()).toEqual({
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
        {
          kind: "paragraph",
          inlines: [
            {
              kind: "text",
              text: "This section will later introduce featured photography, journal entries, and technical work.",
            },
          ],
        },
      ],
      footer: ["Homepage placeholder footer content."],
    });

    expect(appContext.getCanonicalUrl()).toBe("https://kevinellen.com/");

    expect(appContext.getSecurity()).toEqual({
      nonce: expect.any(String),
    });
    expect(appContext.getSecurity().nonce).not.toHaveLength(0);
    expect(appContext.getSecurity().nonce).toMatch(/^[a-f0-9]+$/i);
    expect(Object.isFrozen(appContext.getSecurity())).toBe(true);
  });

  it("returns an AppContext instance for an error-page target", () => {
    const req = new Request("https://example.com/missing");

    const target: DocumentRenderTarget = {
      kind: "error-page",
      page: appState.getErrorPageByStatus(404)!,
      status: 404,
    };

    const appContext = createAppContext(req, env, appState, target);

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

    expect(appContext.getContent()).toEqual({
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
    });

    expect(appContext.getCanonicalUrl()).toBeNull();

    expect(appContext.getSecurity()).toEqual({
      nonce: expect.any(String),
    });
    expect(appContext.getSecurity().nonce).not.toHaveLength(0);
    expect(appContext.getSecurity().nonce).toMatch(/^[a-f0-9]+$/i);
    expect(Object.isFrozen(appContext.getSecurity())).toBe(true);
  });

  it("creates a unique nonce per app context", () => {
    const req = new Request("https://example.com/");

    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const first = createAppContext(req, env, appState, target);
    const second = createAppContext(req, env, appState, target);

    expect(first.getSecurity().nonce).not.toBe(second.getSecurity().nonce);
  });
});
