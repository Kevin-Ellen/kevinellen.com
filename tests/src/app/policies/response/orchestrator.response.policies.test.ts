import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";
import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

import { AppState } from "@app/appState/appState";
import { createTestAppSeed } from "@src/app/bootstrap/appSeed.test.create";

import { orchestrateResponsePolicies } from "@app/policies/response/orchestrator.response.policies";

describe("orchestrateResponsePolicies", () => {
  let appState: AppState;

  const createBaseResponse = (): Response =>
    new Response("body", {
      status: 200,
      statusText: "OK",
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-test-header": "keep-me",
      },
    });

  const createDocumentRender = (
    robotsOverrides?: Partial<DocumentRenderContext["robots"]>,
    nonce = "test-nonce",
  ): DocumentRenderContext =>
    ({
      security: {
        nonce,
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
        ...robotsOverrides,
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

  const createDirectContext = (env: Env): ResponsePolicyContext => ({
    response: createBaseResponse(),
    responseKind: "direct",
    responseFormat: "binary",
    status: 200,
    env,
  });

  const createDocumentContext = (
    env: Env,
    robotsOverrides?: Partial<DocumentRenderContext["robots"]>,
    nonce = "test-nonce",
  ): ResponsePolicyContext => ({
    response: createBaseResponse(),
    responseKind: "document",
    responseFormat: "json",
    status: 200,
    env,
    documentRender: createDocumentRender(robotsOverrides, nonce),
  });

  beforeEach(async () => {
    const seed = await createTestAppSeed();
    appState = new AppState(seed);
  });

  it("applies base and security response policies to direct responses", () => {
    const result = orchestrateResponsePolicies(
      createDirectContext({ APP_ENV: "dev" } as Env),
      appState,
    );

    expect(result.headers.get("content-type")).toBe("text/html; charset=utf-8");

    expect(result.headers.get("x-content-type-options")).toBe("nosniff");
    expect(result.headers.get("referrer-policy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(result.headers.get("x-frame-options")).toBe("DENY");
    expect(result.headers.get("cross-origin-opener-policy")).toBe(
      "same-origin",
    );

    expect(result.headers.get("x-robots-tag")).toBeNull();
    expect(result.headers.get("content-security-policy")).toBeNull();
    expect(result.headers.get("cache-control")).toBeNull();

    expect(result.headers.get("x-test-header")).toBe("keep-me");
  });

  it("applies full policy chain to document responses in dev", () => {
    const result = orchestrateResponsePolicies(
      createDocumentContext({ APP_ENV: "dev" } as Env),
      appState,
    );

    expect(result.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );

    expect(result.headers.get("x-content-type-options")).toBe("nosniff");
    expect(result.headers.get("referrer-policy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(result.headers.get("x-frame-options")).toBe("DENY");
    expect(result.headers.get("cross-origin-opener-policy")).toBe(
      "same-origin",
    );

    expect(result.headers.get("x-robots-tag")).toBe(
      "noindex, nofollow, noarchive, nosnippet, noimageindex",
    );

    expect(result.headers.get("content-security-policy")).toContain(
      "default-src 'self'",
    );
    expect(result.headers.get("content-security-policy")).toContain(
      "script-src 'self' 'nonce-test-nonce'",
    );

    expect(result.headers.get("cache-control")).toBe("no-store");
  });

  it("applies correct prod robots behaviour", () => {
    const result = orchestrateResponsePolicies(
      createDocumentContext({ APP_ENV: "prod" } as Env),
      appState,
    );

    expect(result.headers.get("x-robots-tag")).toBeNull();
  });

  it("applies restrictive robots in prod when required", () => {
    const result = orchestrateResponsePolicies(
      createDocumentContext({ APP_ENV: "prod" } as Env, {
        allowIndex: false,
      }),
      appState,
    );

    expect(result.headers.get("x-robots-tag")).toBe("noindex");
  });

  it("propagates nonce correctly into CSP", () => {
    const result = orchestrateResponsePolicies(
      createDocumentContext({ APP_ENV: "prod" } as Env, {}, "abc123"),
      appState,
    );

    expect(result.headers.get("content-security-policy")).toContain(
      "nonce-abc123",
    );
  });

  it("returns new Response instance", () => {
    const ctx = createDocumentContext({ APP_ENV: "dev" } as Env);
    const result = orchestrateResponsePolicies(ctx, appState);

    expect(result).not.toBe(ctx.response);
  });

  it("applies caching last", () => {
    const result = orchestrateResponsePolicies(
      createDocumentContext({ APP_ENV: "dev" } as Env),
      appState,
    );

    expect(result.headers.get("cache-control")).toBe("no-store");
  });
});
