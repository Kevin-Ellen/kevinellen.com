// tests/src/app/policies/response/orchestrator.response.policies.test.ts

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

    expect(result.headers.get("x-test-header")).toBe("keep-me");
    expect(result.status).toBe(200);
    expect(result.statusText).toBe("OK");
  });

  it("applies base, security, robots, and csp policies to document responses in dev", () => {
    const result = orchestrateResponsePolicies(
      createDocumentContext({ APP_ENV: "dev" } as Env),
      appState,
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
    expect(result.headers.get("content-security-policy")).toContain(
      "style-src 'self' 'nonce-test-nonce'",
    );
    expect(result.headers.get("x-test-header")).toBe("keep-me");
  });

  it("applies base, security, robots, and csp policies to document responses in stg", () => {
    const result = orchestrateResponsePolicies(
      createDocumentContext({ APP_ENV: "stg" } as Env),
      appState,
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
      "script-src 'self' 'nonce-test-nonce'",
    );
  });

  it("applies base, security, and csp policies with no robots header for fully indexable prod document responses", () => {
    const result = orchestrateResponsePolicies(
      createDocumentContext({ APP_ENV: "prod" } as Env),
      appState,
    );

    expect(result.headers.get("x-content-type-options")).toBe("nosniff");
    expect(result.headers.get("referrer-policy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(result.headers.get("x-frame-options")).toBe("DENY");
    expect(result.headers.get("cross-origin-opener-policy")).toBe(
      "same-origin",
    );
    expect(result.headers.get("x-robots-tag")).toBeNull();
    expect(result.headers.get("content-security-policy")).toContain(
      "script-src 'self' 'nonce-test-nonce'",
    );
  });

  it("applies restrictive robots header for prod document responses when robots config requires it", () => {
    const result = orchestrateResponsePolicies(
      createDocumentContext({ APP_ENV: "prod" } as Env, {
        allowIndex: false,
        allowFollow: false,
        noarchive: true,
        nosnippet: true,
        noimageindex: true,
      }),
      appState,
    );

    expect(result.headers.get("x-robots-tag")).toBe(
      "noindex, nofollow, noarchive, nosnippet, noimageindex",
    );
    expect(result.headers.get("content-security-policy")).toContain(
      "script-src 'self' 'nonce-test-nonce'",
    );
  });

  it("passes the updated response through the full policy chain", () => {
    const result = orchestrateResponsePolicies(
      createDocumentContext(
        { APP_ENV: "prod" } as Env,
        { allowIndex: false },
        "abc123",
      ),
      appState,
    );

    expect(result.headers.get("x-content-type-options")).toBe("nosniff");
    expect(result.headers.get("referrer-policy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(result.headers.get("x-frame-options")).toBe("DENY");
    expect(result.headers.get("cross-origin-opener-policy")).toBe(
      "same-origin",
    );
    expect(result.headers.get("x-robots-tag")).toBe("noindex");
    expect(result.headers.get("content-security-policy")).toContain(
      "script-src 'self' 'nonce-abc123'",
    );
    expect(result.headers.get("content-security-policy")).toContain(
      "style-src 'self' 'nonce-abc123'",
    );
  });

  it("returns a new Response instance after orchestration for direct responses", () => {
    const context = createDirectContext({ APP_ENV: "dev" } as Env);
    const result = orchestrateResponsePolicies(context, appState);

    expect(result).not.toBe(context.response);
  });

  it("returns a new Response instance after orchestration for document responses", () => {
    const context = createDocumentContext({ APP_ENV: "dev" } as Env);
    const result = orchestrateResponsePolicies(context, appState);

    expect(result).not.toBe(context.response);
  });
});
