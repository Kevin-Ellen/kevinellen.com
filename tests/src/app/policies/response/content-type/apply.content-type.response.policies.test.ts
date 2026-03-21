// tests/src/app/policies/response/content-type/apply.content-type.response.policies.test.ts

import { createDocumentRenderContext } from "@tests/helpers/create.documentRenderContext";

import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";

import { applyContentTypeResponsePolicies } from "@app/policies/response/content-type/apply.content-type.response.policies";

describe("applyContentTypeResponsePolicies", () => {
  const createBaseResponse = (): Response =>
    new Response("body", {
      status: 200,
      statusText: "OK",
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-test-header": "keep-me",
      },
    });

  const createDirectContext = (): ResponsePolicyContext => ({
    response: createBaseResponse(),
    responseKind: "direct",
    responseFormat: "binary",
    status: 200,
    env: { APP_ENV: "dev" } as Env,
  });

  const createDocumentContext = (
    format: "json" | "html" = "json",
  ): ResponsePolicyContext => ({
    response: createBaseResponse(),
    responseKind: "document",
    responseFormat: format,
    status: 200,
    env: { APP_ENV: "dev" } as Env,
    documentRender: createDocumentRenderContext(),
  });

  it("returns unchanged response for binary responses", () => {
    const context = createDirectContext();
    const result = applyContentTypeResponsePolicies(context);

    expect(result).toBe(context.response);
    expect(result.headers.get("content-type")).toBe("text/html; charset=utf-8");
  });

  it("sets json content type for json document responses", () => {
    const result = applyContentTypeResponsePolicies(
      createDocumentContext("json"),
    );

    expect(result.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );
  });

  it("sets html content type for html document responses", () => {
    const result = applyContentTypeResponsePolicies(
      createDocumentContext("html"),
    );

    expect(result.headers.get("content-type")).toBe("text/html; charset=utf-8");
  });

  it("preserves existing headers", () => {
    const result = applyContentTypeResponsePolicies(
      createDocumentContext("json"),
    );

    expect(result.headers.get("x-test-header")).toBe("keep-me");
  });

  it("preserves status and statusText", () => {
    const result = applyContentTypeResponsePolicies(
      createDocumentContext("json"),
    );

    expect(result.status).toBe(200);
    expect(result.statusText).toBe("OK");
  });

  it("returns a new Response instance when content type is changed", () => {
    const context = createDocumentContext("json");
    const result = applyContentTypeResponsePolicies(context);

    expect(result).not.toBe(context.response);
  });
});
