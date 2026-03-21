// tests/src/app/policies/response/base/apply.base.response.policies.test.ts

import { createDocumentRenderContext } from "@tests/helpers/create.documentRenderContext";

import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";

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

  const createDocumentContext = (): ResponsePolicyContext => ({
    response: createBaseResponse(),
    responseKind: "document",
    responseFormat: "json",
    status: 200,
    env: { APP_ENV: "dev" } as Env,
    documentRender: createDocumentRenderContext(),
  });

  const createDirectContext = (): ResponsePolicyContext => ({
    response: createBaseResponse(),
    responseKind: "direct",
    responseFormat: "binary",
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
