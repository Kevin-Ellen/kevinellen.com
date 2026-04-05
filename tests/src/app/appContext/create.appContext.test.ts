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

    expect(appContext.getBranding()).toEqual({
      header: {
        href: "/",
        ariaLabel: "Kevin Ellen home",
        svgId: "logo-monogram-ke",
      },
    });

    expect(appContext.getFooter()).toEqual({
      affiliations: {
        title: "Conservation",
        description:
          "Supporting organisations that protect habitats, species, and access to nature.",
        items: [
          {
            id: "rspb",
            label: "RSPB",
            href: "https://www.rspb.org.uk/",
            svgId: "logo-rspb",
          },
          {
            id: "national-trust",
            label: "National Trust",
            href: "https://www.nationaltrust.org.uk/",
            svgId: "logo-national-trust",
          },
          {
            id: "vogelbescherming-nederland",
            label: "Vogelbescherming Nederland",
            href: "https://www.vogelbescherming.nl/",
            svgId: "logo-vogelbescherming-nederland",
          },
        ],
      },
      colophon: {
        copyrightName: "Kevin Ellen",
        copyrightYear: 2026,
      },
    });

    expect(appContext.getStructuredData()).toEqual({
      person: expect.any(Object),
      website: expect.any(Object),
      page: [],
    });

    expect(appContext.getAssets()).toEqual({
      scripts: expect.any(Array),
      svgs: expect.any(Array),
    });

    expect(appContext.getContent()).toEqual({
      head: expect.any(Object),
      body: expect.any(Array),
      footer: expect.any(Array),
    });

    expect(appContext.getCanonicalUrl()).toBe("https://kevinellen.com/");

    expect(appContext.getSecurity()).toEqual({
      nonce: expect.any(String),
    });
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

    expect(appContext.getBreadcrumbs()).toEqual([]);

    expect(appContext.getFooter()).toEqual({
      affiliations: {
        title: "Conservation",
        description:
          "Supporting organisations that protect habitats, species, and access to nature.",
        items: [
          {
            id: "rspb",
            label: "RSPB",
            href: "https://www.rspb.org.uk/",
            svgId: "logo-rspb",
          },
          {
            id: "national-trust",
            label: "National Trust",
            href: "https://www.nationaltrust.org.uk/",
            svgId: "logo-national-trust",
          },
          {
            id: "vogelbescherming-nederland",
            label: "Vogelbescherming Nederland",
            href: "https://www.vogelbescherming.nl/",
            svgId: "logo-vogelbescherming-nederland",
          },
        ],
      },
      colophon: {
        copyrightName: "Kevin Ellen",
        copyrightYear: 2026,
      },
    });

    expect(appContext.getCanonicalUrl()).toBeNull();
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
