// tests/src/app/policies/response/security/apply.security.response.policies.test.ts

import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";
import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

import { applySecurityResponsePolicies } from "@app/policies/response/security/apply.security.response.policies";

describe("applySecurityResponsePolicies", () => {
  const createBaseResponse = (): Response =>
    new Response("body", {
      status: 200,
      statusText: "OK",
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-test-header": "keep-me",
      },
    });

  const createDocumentRender = (): DocumentRenderContext =>
    ({
      security: { nonce: "test-nonce" },
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

  const createDirectContext = (): ResponsePolicyContext => ({
    response: createBaseResponse(),
    responseKind: "direct",
    status: 200,
    env: { APP_ENV: "dev" } as Env,
  });

  const createDocumentContext = (): ResponsePolicyContext => ({
    response: createBaseResponse(),
    responseKind: "document",
    status: 200,
    env: { APP_ENV: "dev" } as Env,
    documentRender: createDocumentRender(),
  });

  it("adds x-frame-options header", () => {
    const result = applySecurityResponsePolicies(createDirectContext());

    expect(result.headers.get("x-frame-options")).toBe("DENY");
  });

  it("adds cross-origin-opener-policy header", () => {
    const result = applySecurityResponsePolicies(createDirectContext());

    expect(result.headers.get("cross-origin-opener-policy")).toBe(
      "same-origin",
    );
  });

  it("preserves existing headers", () => {
    const result = applySecurityResponsePolicies(createDirectContext());

    expect(result.headers.get("x-test-header")).toBe("keep-me");
    expect(result.headers.get("content-type")).toBe("text/html; charset=utf-8");
  });

  it("preserves status and statusText", () => {
    const result = applySecurityResponsePolicies(createDirectContext());

    expect(result.status).toBe(200);
    expect(result.statusText).toBe("OK");
  });

  it("works for document responses", () => {
    const result = applySecurityResponsePolicies(createDocumentContext());

    expect(result.headers.get("x-frame-options")).toBe("DENY");
    expect(result.headers.get("cross-origin-opener-policy")).toBe(
      "same-origin",
    );
  });

  it("returns a new Response instance", () => {
    const context = createDirectContext();
    const result = applySecurityResponsePolicies(context);

    expect(result).not.toBe(context.response);
  });
});
