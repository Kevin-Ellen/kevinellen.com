// tests/src/app/policies/response/security/apply.csp.response.policies.test.ts

import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";
import type {
  ResponseFormat,
  ResponseKind,
} from "@app/appContext/appContext.types";

import { AppContext } from "@app/appContext/appContext";
import { applyCspResponsePolicies } from "@app/policies/response/security/apply.csp.response.policies";

describe("applyCspResponsePolicies", () => {
  const createEnv = (): Env =>
    ({
      APP_ENV: "dev",
    }) as Env;

  const createAppContext = ({
    responseKind = "document",
    responseFormat = "html",
    env = createEnv(),
    document,
  }: {
    responseKind?: ResponseKind;
    responseFormat?: ResponseFormat;
    env?: Env;
    document?: {
      nonce?: string;
      robots?: string;
    };
  } = {}): AppContext =>
    new AppContext({
      responseKind,
      responseFormat,
      env,
      ...(document ? { document } : {}),
    });

  const createContext = ({
    response = new Response("hello", {
      status: 201,
      statusText: "Created",
      headers: {
        "x-custom-header": "value",
      },
    }),
    appContext = createAppContext(),
  }: {
    response?: Response;
    appContext?: AppContext;
  } = {}): ResponsePolicyContext => ({
    response,
    appContext,
  });

  it.each(["direct", "asset", "resource"] as const)(
    "returns the original response for non-document %s responses",
    (responseKind) => {
      const response = new Response("hello", { status: 200 });

      const context = createContext({
        response,
        appContext: createAppContext({
          responseKind,
        }),
      });

      const result = applyCspResponsePolicies(context);

      expect(result).toBe(response);
    },
  );

  it("sets the document CSP header for document responses", () => {
    const context = createContext();

    const result = applyCspResponsePolicies(context);

    expect(result.headers.get("content-security-policy")).toBe(
      "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data: https:; font-src 'self' https: data:; connect-src 'self'; form-action 'self'; manifest-src 'self'",
    );
  });

  it("includes the nonce in script-src and style-src when present", () => {
    const context = createContext({
      appContext: createAppContext({
        document: {
          nonce: "test-nonce",
        },
      }),
    });

    const result = applyCspResponsePolicies(context);

    expect(result.headers.get("content-security-policy")).toBe(
      "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'nonce-test-nonce'; style-src 'self' 'nonce-test-nonce'; img-src 'self' data: https:; font-src 'self' https: data:; connect-src 'self'; form-action 'self'; manifest-src 'self'",
    );
  });

  it("preserves unrelated headers when rebuilding the response", () => {
    const context = createContext();

    const result = applyCspResponsePolicies(context);

    expect(result.headers.get("x-custom-header")).toBe("value");
  });

  it("preserves status and statusText when rebuilding the response", () => {
    const context = createContext();

    const result = applyCspResponsePolicies(context);

    expect(result.status).toBe(201);
    expect(result.statusText).toBe("Created");
  });

  it("preserves the response body when rebuilding the response", async () => {
    const context = createContext();

    const result = applyCspResponsePolicies(context);

    await expect(result.text()).resolves.toBe("hello");
  });

  it("returns a new response instance for document responses", () => {
    const response = new Response("hello", { status: 200 });

    const context = createContext({ response });

    const result = applyCspResponsePolicies(context);

    expect(result).not.toBe(response);
  });

  it("overwrites an existing content-security-policy header", () => {
    const response = new Response("hello", {
      status: 200,
      headers: {
        "content-security-policy": "default-src *",
      },
    });

    const context = createContext({ response });

    const result = applyCspResponsePolicies(context);

    expect(result.headers.get("content-security-policy")).toBe(
      "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data: https:; font-src 'self' https: data:; connect-src 'self'; form-action 'self'; manifest-src 'self'",
    );
  });

  it("exposes content-security-policy in a case-insensitive way", () => {
    const context = createContext();

    const result = applyCspResponsePolicies(context);

    expect(result.headers.get("Content-Security-Policy")).toBe(
      "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data: https:; font-src 'self' https: data:; connect-src 'self'; form-action 'self'; manifest-src 'self'",
    );
  });
});
