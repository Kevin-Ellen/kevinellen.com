// tests/src/app/policies/response/robots/apply.robots.response.policies.test.ts

import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";
import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

import { applyRobotsResponsePolicies } from "@app/policies/response/robots/apply.robots.response.policies";

describe("applyRobotsResponsePolicies", () => {
  const createBaseResponse = (): Response =>
    new Response("body", {
      status: 200,
      headers: {
        "content-type": "text/html",
        "x-test-header": "keep-me",
      },
    });

  const createDocumentRender = (
    overrides?: Partial<DocumentRenderContext["robots"]>,
  ): DocumentRenderContext =>
    ({
      security: {
        nonce: "test-nonce",
      },
      site: {
        language: "en-GB",
        siteName: "Test Site",
        siteUrl: "https://example.com",
        socialMedia: {
          gitHub: "",
          instagram: "",
          linkedIn: "",
        },
      },
      page: {
        id: "test-page",
        kind: "static",
        slug: "/test",
        renderMode: "bundled",
      },
      seo: {
        pageTitle: "Test Page",
        metaDescription: "Test description",
        canonicalUrl: "https://example.com/test",
      },
      robots: {
        allowIndex: true,
        allowFollow: true,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
        ...overrides,
      },
      pageHead: {
        breadcrumbs: [],
      },
      content: {
        head: {
          eyebrow: "Eyebrow",
          title: "Title",
          intro: "Intro",
        },
        body: [],
        footer: [],
      },
      assets: {
        scripts: [],
        svgs: [],
      },
      structuredData: [],
    }) as DocumentRenderContext;

  const createDocumentContext = (
    env: Env,
    robotsOverrides?: Partial<DocumentRenderContext["robots"]>,
  ): ResponsePolicyContext => ({
    response: createBaseResponse(),
    responseKind: "document",
    responseFormat: "json",
    status: 200,
    env,
    documentRender: createDocumentRender(robotsOverrides),
  });

  const createNonDocumentContext = (env: Env): ResponsePolicyContext => ({
    response: createBaseResponse(),
    responseKind: "direct",
    responseFormat: "binary",
    status: 200,
    env,
  });

  /*
   --------------------------------------------------
   NON-DOCUMENT RESPONSES
   --------------------------------------------------
  */

  it("returns unchanged response for non-document responses in dev", () => {
    const ctx = createNonDocumentContext({ APP_ENV: "dev" } as Env);
    const result = applyRobotsResponsePolicies(ctx);

    expect(result.headers.get("x-robots-tag")).toBeNull();
    expect(result.headers.get("x-test-header")).toBe("keep-me");
  });

  it("returns unchanged response for non-document responses in prod", () => {
    const ctx = createNonDocumentContext({ APP_ENV: "prod" } as Env);
    const result = applyRobotsResponsePolicies(ctx);

    expect(result.headers.get("x-robots-tag")).toBeNull();
    expect(result.headers.get("x-test-header")).toBe("keep-me");
  });

  /*
   --------------------------------------------------
   DOCUMENT RESPONSES — NON PROD
   --------------------------------------------------
  */

  it("adds full restrictive robots header in dev", () => {
    const ctx = createDocumentContext({ APP_ENV: "dev" } as Env);
    const result = applyRobotsResponsePolicies(ctx);

    expect(result.headers.get("x-robots-tag")).toBe(
      "noindex, nofollow, noarchive, nosnippet, noimageindex",
    );
    expect(result.status).toBe(200);
    expect(result.headers.get("x-test-header")).toBe("keep-me");
  });

  it("adds full restrictive robots header in stg", () => {
    const ctx = createDocumentContext({ APP_ENV: "stg" } as Env);
    const result = applyRobotsResponsePolicies(ctx);

    expect(result.headers.get("x-robots-tag")).toBe(
      "noindex, nofollow, noarchive, nosnippet, noimageindex",
    );
  });

  /*
   --------------------------------------------------
   DOCUMENT RESPONSES — PROD
   --------------------------------------------------
  */

  it("does not add robots header in prod when page is fully indexable", () => {
    const ctx = createDocumentContext({ APP_ENV: "prod" } as Env);
    const result = applyRobotsResponsePolicies(ctx);

    expect(result.headers.get("x-robots-tag")).toBeNull();
  });

  it("adds noindex in prod when allowIndex is false", () => {
    const ctx = createDocumentContext({ APP_ENV: "prod" } as Env, {
      allowIndex: false,
    });
    const result = applyRobotsResponsePolicies(ctx);

    expect(result.headers.get("x-robots-tag")).toBe("noindex");
  });

  it("adds nofollow in prod when allowFollow is false", () => {
    const ctx = createDocumentContext({ APP_ENV: "prod" } as Env, {
      allowFollow: false,
    });
    const result = applyRobotsResponsePolicies(ctx);

    expect(result.headers.get("x-robots-tag")).toBe("nofollow");
  });

  it("adds combined restrictive directives in prod", () => {
    const ctx = createDocumentContext({ APP_ENV: "prod" } as Env, {
      allowIndex: false,
      allowFollow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    });
    const result = applyRobotsResponsePolicies(ctx);

    expect(result.headers.get("x-robots-tag")).toBe(
      "noindex, nofollow, noarchive, nosnippet, noimageindex",
    );
  });

  /*
   --------------------------------------------------
   IMMUTABILITY CONTRACT
   --------------------------------------------------
  */

  it("returns a new Response instance when modifying headers", () => {
    const ctx = createDocumentContext({ APP_ENV: "dev" } as Env);
    const original = ctx.response;

    const result = applyRobotsResponsePolicies(ctx);

    expect(result).not.toBe(original);
  });

  it("returns same Response instance when no change required", () => {
    const ctx = createDocumentContext({ APP_ENV: "prod" } as Env);
    const original = ctx.response;

    const result = applyRobotsResponsePolicies(ctx);

    expect(result).toBe(original);
  });
});
