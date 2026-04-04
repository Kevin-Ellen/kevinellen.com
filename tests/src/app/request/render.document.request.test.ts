// tests/src/app/request/render.document.request.test.ts

import { renderDocumentRequest } from "@app/request/render.document.request";
import { createAppState } from "@app/appState/create.appState";

import type { DocumentRenderTarget } from "@app/request/request.document.types";

type RenderDocumentInspectionPayload = {
  type: "document-inspection";
  request: {
    url: string;
    method: string;
  };
  target: {
    kind: string;
    status: number;
    page: {
      id: string;
      label: string;
      kind: string;
      slug?: string;
    };
  };
  appContext: {
    site: {
      siteName: string;
      siteUrl: string;
    };
    canonicalUrl: string | null;
    navigation: {
      header: {
        primary: unknown[];
        social: unknown[];
      };
      footer: {
        sections: unknown[];
      };
    };
    breadcrumbs: unknown[];
    assets: {
      scripts: unknown[];
      svgs: unknown[];
    };
    structuredData: {
      person: unknown;
      website: unknown;
      page: unknown;
    };
    content: {
      head: {
        eyebrow: string;
        title: string;
        intro: string;
      };
      body: unknown[];
      footer: string[];
    };
    security: {
      nonce: string;
    };
  };
};

describe("renderDocumentRequest", () => {
  const env = {
    APP_ENV: "dev",
    APP_HOST: "kevinellen.com",
  } as Env;

  const ctx = {} as ExecutionContext;
  const appState = createAppState();

  it("returns a JSON inspection response for a page target", async () => {
    const req = new Request("https://example.com/?debug=document");

    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const response = await renderDocumentRequest(
      req,
      env,
      ctx,
      appState,
      target,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );
    expect(response.headers.get("x-render-mode")).toBe("document-inspection");

    const payload = (await response.json()) as RenderDocumentInspectionPayload;

    expect(payload.type).toBe("document-inspection");

    expect(payload.request).toEqual({
      url: "https://example.com/?debug=document",
      method: "GET",
    });

    expect(payload.target).toEqual({
      kind: "page",
      status: 200,
      page: {
        id: "home",
        label: "Home",
        kind: "home",
        slug: "/",
      },
    });

    expect(payload.appContext.site).toEqual({
      siteName: appState.getSiteConfig().siteName,
      siteUrl: appState.getSiteConfig().siteUrl,
    });

    expect(payload.appContext.canonicalUrl).toBe("https://kevinellen.com/");

    expect(payload.appContext.navigation.header.primary).toEqual([
      {
        kind: "page",
        id: "home",
        label: "Home",
        href: "/",
        isCurrent: true,
        svgIcon: expect.objectContaining({
          id: "icon-home",
          viewBox: "0 0 640 640",
          width: 640,
          height: 640,
        }),
      },
      {
        kind: "page",
        id: "journal",
        label: "Journal",
        href: "/journal",
        isCurrent: false,
      },
    ]);

    expect(payload.appContext.navigation.header.social).toEqual([
      {
        kind: "social",
        id: "github",
        label: "GitHub",
        href: "https://github.com/Kevin-Ellen",
        isCurrent: false,
        svgIcon: expect.objectContaining({
          id: "icon-github",
          viewBox: "0 0 640 640",
          width: 640,
          height: 640,
        }),
      },
      {
        kind: "social",
        id: "instagram",
        label: "Instagram",
        href: "https://www.instagram.com/photography.mallard",
        isCurrent: false,
        svgIcon: expect.objectContaining({
          id: "icon-instagram",
          viewBox: "0 0 640 640",
          width: 640,
          height: 640,
        }),
      },
    ]);

    expect(payload.appContext.navigation.footer.sections).toEqual([
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
    ]);

    expect(payload.appContext.breadcrumbs).toEqual([
      {
        id: "home",
        label: "Home",
        href: "/",
      },
    ]);

    expect(payload.appContext.assets).toEqual({
      scripts: [
        {
          id: "header-condense",
          kind: "inline",
          location: "footer",
        },
      ],
      svgs: [
        {
          id: "icon-home",
          viewBox: "0 0 640 640",
        },
        {
          id: "icon-github",
          viewBox: "0 0 640 640",
        },
        {
          id: "icon-instagram",
          viewBox: "0 0 640 640",
        },
        {
          id: "icon-linkedin",
          viewBox: "0 0 640 640",
        },
        {
          id: "logo-rspb",
          viewBox: "0 0 81 81",
        },
        {
          id: "logo-national-trust",
          viewBox: "0 0 48 48",
        },
        {
          id: "logo-vogelbescherming-nederland",
          viewBox: "0 0 829 392",
        },
      ],
    });

    expect(payload.appContext.structuredData.person).toEqual({
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
    });

    expect(payload.appContext.structuredData.website).toEqual({
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
    });

    expect(payload.appContext.structuredData.page).toEqual([]);

    expect(payload.appContext.content).toEqual({
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

    expect(payload.appContext.security.nonce).toEqual(expect.any(String));
  });

  it("returns a JSON inspection response for an error-page target", async () => {
    const req = new Request("https://example.com/missing?debug=document");

    const target: DocumentRenderTarget = {
      kind: "error-page",
      page: appState.getErrorPageByStatus(404)!,
      status: 404,
    };

    const response = await renderDocumentRequest(
      req,
      env,
      ctx,
      appState,
      target,
    );

    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );
    expect(response.headers.get("x-render-mode")).toBe("document-inspection");

    const payload = (await response.json()) as RenderDocumentInspectionPayload;

    expect(payload.type).toBe("document-inspection");

    expect(payload.request).toEqual({
      url: "https://example.com/missing?debug=document",
      method: "GET",
    });

    expect(payload.target).toEqual({
      kind: "error-page",
      status: 404,
      page: {
        id: "error-404",
        label: "Page not found",
        kind: "error",
      },
    });

    expect(payload.appContext.site).toEqual({
      siteName: appState.getSiteConfig().siteName,
      siteUrl: appState.getSiteConfig().siteUrl,
    });

    expect(payload.appContext.canonicalUrl).toBeNull();

    expect(payload.appContext.navigation.header.primary).toEqual([
      {
        kind: "page",
        id: "home",
        label: "Home",
        href: "/",
        isCurrent: false,
        svgIcon: expect.objectContaining({
          id: "icon-home",
          viewBox: "0 0 640 640",
          width: 640,
          height: 640,
        }),
      },
      {
        kind: "page",
        id: "journal",
        label: "Journal",
        href: "/journal",
        isCurrent: false,
      },
    ]);

    expect(payload.appContext.navigation.header.social).toEqual([
      {
        kind: "social",
        id: "github",
        label: "GitHub",
        href: "https://github.com/Kevin-Ellen",
        isCurrent: false,
        svgIcon: expect.objectContaining({
          id: "icon-github",
          viewBox: "0 0 640 640",
          width: 640,
          height: 640,
        }),
      },
      {
        kind: "social",
        id: "instagram",
        label: "Instagram",
        href: "https://www.instagram.com/photography.mallard",
        isCurrent: false,
        svgIcon: expect.objectContaining({
          id: "icon-instagram",
          viewBox: "0 0 640 640",
          width: 640,
          height: 640,
        }),
      },
    ]);

    expect(payload.appContext.navigation.footer.sections).toEqual([
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
    ]);

    expect(payload.appContext.breadcrumbs).toEqual([]);

    expect(payload.appContext.assets).toEqual({
      scripts: [
        {
          id: "header-condense",
          kind: "inline",
          location: "footer",
        },
      ],
      svgs: [
        {
          id: "icon-home",
          viewBox: "0 0 640 640",
        },
        {
          id: "icon-github",
          viewBox: "0 0 640 640",
        },
        {
          id: "icon-instagram",
          viewBox: "0 0 640 640",
        },
        {
          id: "icon-linkedin",
          viewBox: "0 0 640 640",
        },
        {
          id: "logo-rspb",
          viewBox: "0 0 81 81",
        },
        {
          id: "logo-national-trust",
          viewBox: "0 0 48 48",
        },
        {
          id: "logo-vogelbescherming-nederland",
          viewBox: "0 0 829 392",
        },
      ],
    });

    expect(payload.appContext.structuredData.person).toEqual({
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
    });

    expect(payload.appContext.structuredData.website).toEqual({
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
    });

    expect(payload.appContext.structuredData.page).toBeNull();

    expect(payload.appContext.content).toEqual({
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

    expect(payload.appContext.security.nonce).toEqual(expect.any(String));
  });
});
