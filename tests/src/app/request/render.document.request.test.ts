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

    const rendered = await renderDocumentRequest(
      req,
      env,
      ctx,
      appState,
      target,
    );

    const response = rendered.response;

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );
    expect(response.headers.get("x-render-mode")).toBe("document-inspection");

    const payload = (await response.json()) as RenderDocumentInspectionPayload;

    expect(payload.appContext.navigation.header.primary).toEqual([
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
    ]);
  });

  it("returns a JSON inspection response for an error-page target", async () => {
    const req = new Request("https://example.com/missing?debug=document");

    const target: DocumentRenderTarget = {
      kind: "error-page",
      page: appState.getErrorPageByStatus(404)!,
      status: 404,
    };

    const rendered = await renderDocumentRequest(
      req,
      env,
      ctx,
      appState,
      target,
    );

    const response = rendered.response;

    const payload = (await response.json()) as RenderDocumentInspectionPayload;

    expect(payload.appContext.navigation.header.primary).toEqual([
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
    ]);
  });
});
