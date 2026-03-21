// tests/src/app/policies/response/base/apply.base.response.policies.test.ts

import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";
import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

import { applyBaseResponsePolicies } from "@app/policies/response/base/apply.base.response.policies";

describe("applyBaseResponsePolicies", () => {
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

  const createDocumentContext = (): ResponsePolicyContext => ({
    response: createBaseResponse(),
    responseKind: "document",
    status: 200,
    env: { APP_ENV: "dev" } as Env,
    documentRender: createDocumentRender(),
  });

  const createDirectContext = (): ResponsePolicyContext => ({
    response: createBaseResponse(),
    responseKind: "direct",
    status: 200,
    env: { APP_ENV: "dev" } as Env,
  });

  it("adds x-content-type-options header", () => {
    const result = applyBaseResponsePolicies(createDirectContext());

    expect(result.headers.get("x-content-type-options")).toBe("nosniff");
  });

  it("adds referrer-policy header", () => {
    const result = applyBaseResponsePolicies(createDirectContext());

    expect(result.headers.get("referrer-policy")).toBe(
      "strict-origin-when-cross-origin",
    );
  });

  it("preserves existing headers", () => {
    const result = applyBaseResponsePolicies(createDirectContext());

    expect(result.headers.get("x-test-header")).toBe("keep-me");
    expect(result.headers.get("content-type")).toBe("text/html; charset=utf-8");
  });

  it("preserves response status and statusText", () => {
    const result = applyBaseResponsePolicies(createDirectContext());

    expect(result.status).toBe(200);
    expect(result.statusText).toBe("OK");
  });

  it("works for document responses", () => {
    const result = applyBaseResponsePolicies(createDocumentContext());

    expect(result.headers.get("x-content-type-options")).toBe("nosniff");
    expect(result.headers.get("referrer-policy")).toBe(
      "strict-origin-when-cross-origin",
    );
  });

  it("returns a new Response instance", () => {
    const ctx = createDirectContext();
    const original = ctx.response;

    const result = applyBaseResponsePolicies(ctx);

    expect(result).not.toBe(original);
  });
});
