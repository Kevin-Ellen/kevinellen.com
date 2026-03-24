// tests/src/app/policies/response/base/apply.base.response.policies.test.ts

import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";

import { AppContext } from "@app/appContext/appContext";
import { applyBaseResponsePolicies } from "@app/policies/response/base/apply.base.response.policies";

describe("applyBaseResponsePolicies", () => {
  const createAppContext = (): AppContext =>
    new AppContext({
      responseKind: "direct",
      responseFormat: "html",
      env: {} as Env,
    });

  const createContext = (response: Response): ResponsePolicyContext => ({
    response,
    appContext: createAppContext(),
  });

  const createBodyResponse = (): Response =>
    new Response("hello", {
      status: 201,
      statusText: "Created",
      headers: {
        "x-custom-header": "value",
      },
    });

  const createHeaderOnlyResponse = (): Response =>
    new Response(null, {
      status: 201,
      statusText: "Created",
      headers: {
        "x-custom-header": "value",
      },
    });

  it("adds base security headers", () => {
    const ctx = createContext(createHeaderOnlyResponse());

    const result = applyBaseResponsePolicies(ctx);

    expect(result.headers.get("x-content-type-options")).toBe("nosniff");
    expect(result.headers.get("referrer-policy")).toBe(
      "strict-origin-when-cross-origin",
    );
  });

  it("preserves existing headers", () => {
    const ctx = createContext(createHeaderOnlyResponse());

    const result = applyBaseResponsePolicies(ctx);

    expect(result.headers.get("x-custom-header")).toBe("value");
  });

  it("preserves status and statusText", () => {
    const ctx = createContext(createHeaderOnlyResponse());

    const result = applyBaseResponsePolicies(ctx);

    expect(result.status).toBe(201);
    expect(result.statusText).toBe("Created");
  });

  it("preserves response body", async () => {
    const ctx = createContext(createBodyResponse());

    const result = applyBaseResponsePolicies(ctx);

    await expect(result.text()).resolves.toBe("hello");
  });

  it("preserves body-derived content-type headers when present", () => {
    const ctx = createContext(createBodyResponse());

    const result = applyBaseResponsePolicies(ctx);

    expect(result.headers.get("content-type")).toBe("text/plain;charset=UTF-8");
  });

  it("does not mutate the original response", () => {
    const response = createHeaderOnlyResponse();
    const ctx = createContext(response);

    applyBaseResponsePolicies(ctx);

    expect(response.headers.get("x-content-type-options")).toBeNull();
    expect(response.headers.get("referrer-policy")).toBeNull();
  });

  it("returns a new response instance", () => {
    const response = createHeaderOnlyResponse();
    const ctx = createContext(response);

    const result = applyBaseResponsePolicies(ctx);

    expect(result).not.toBe(response);
  });

  it("is idempotent", () => {
    const ctx = createContext(createHeaderOnlyResponse());

    const once = applyBaseResponsePolicies(ctx);
    const twice = applyBaseResponsePolicies({ ...ctx, response: once });

    expect(Object.fromEntries(once.headers.entries())).toEqual(
      Object.fromEntries(twice.headers.entries()),
    );
    expect(twice.status).toBe(once.status);
    expect(twice.statusText).toBe(once.statusText);
  });

  it("sets only the expected headers when no body-derived content-type exists", () => {
    const ctx = createContext(createHeaderOnlyResponse());

    const result = applyBaseResponsePolicies(ctx);

    expect(Object.fromEntries(result.headers.entries())).toEqual({
      "x-custom-header": "value",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
    });
  });

  it("exposes enforced headers in a case-insensitive way", () => {
    const ctx = createContext(createHeaderOnlyResponse());

    const result = applyBaseResponsePolicies(ctx);

    expect(result.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(result.headers.get("Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin",
    );
  });
});
