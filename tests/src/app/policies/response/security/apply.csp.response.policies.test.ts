// tests/src/app/policies/response/security/apply.csp.response.policies.test.ts

import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";
import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

import { applyCspResponsePolicies } from "@app/policies/response/security/apply.csp.response.policies";

describe("applyCspResponsePolicies", () => {
  const createBaseResponse = (): Response =>
    new Response("body", {
      status: 200,
      statusText: "OK",
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-test-header": "keep-me",
      },
    });

  const createDocumentRender = (nonce = "test-nonce"): DocumentRenderContext =>
    ({
      security: { nonce },
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
      },
      pageHead: { breadcrumbs: [] },
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
    nonce = "test-nonce",
  ): ResponsePolicyContext => ({
    response: createBaseResponse(),
    responseKind: "document",
    responseFormat: "json",
    status: 200,
    env: { APP_ENV: "dev" } as Env,
    documentRender: createDocumentRender(nonce),
  });

  const createNonDocumentContext = (): ResponsePolicyContext => ({
    response: createBaseResponse(),
    responseKind: "direct",
    responseFormat: "binary",
    status: 200,
    env: { APP_ENV: "dev" } as Env,
  });

  it("returns unchanged response for non-document responses", () => {
    const context = createNonDocumentContext();
    const result = applyCspResponsePolicies(context);

    expect(result).toBe(context.response);
    expect(result.headers.get("content-security-policy")).toBeNull();
  });

  it("adds content-security-policy header for document responses", () => {
    const result = applyCspResponsePolicies(createDocumentContext());

    expect(result.headers.get("content-security-policy")).toContain(
      "default-src 'self'",
    );
  });

  it("includes the document nonce in script-src", () => {
    const result = applyCspResponsePolicies(createDocumentContext("abc123"));

    expect(result.headers.get("content-security-policy")).toContain(
      "script-src 'self' 'nonce-abc123'",
    );
  });

  it("includes the document nonce in style-src", () => {
    const result = applyCspResponsePolicies(createDocumentContext("abc123"));

    expect(result.headers.get("content-security-policy")).toContain(
      "style-src 'self' 'nonce-abc123'",
    );
  });

  it("preserves existing headers", () => {
    const result = applyCspResponsePolicies(createDocumentContext());

    expect(result.headers.get("x-test-header")).toBe("keep-me");
    expect(result.headers.get("content-type")).toBe("text/html; charset=utf-8");
  });

  it("preserves status and statusText", () => {
    const result = applyCspResponsePolicies(createDocumentContext());

    expect(result.status).toBe(200);
    expect(result.statusText).toBe("OK");
  });

  it("returns a new Response instance for document responses", () => {
    const context = createDocumentContext();
    const result = applyCspResponsePolicies(context);

    expect(result).not.toBe(context.response);
  });
});
