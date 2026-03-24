// tests/src/app/policies/response/security/apply.security.response.policies.test.ts

import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";
import type {
  ResponseFormat,
  ResponseKind,
} from "@app/appContext/appContext.types";

import { AppContext } from "@app/appContext/appContext";
import { applySecurityResponsePolicies } from "@app/policies/response/security/apply.security.response.policies";
import { getRuntimeBehaviour } from "@utils/runtimeEnv.util";

jest.mock("@utils/runtimeEnv.util", () => ({
  getRuntimeBehaviour: jest.fn(),
}));

describe("applySecurityResponsePolicies", () => {
  const mockedGetRuntimeBehaviour = jest.mocked(getRuntimeBehaviour);

  const createEnv = (): Env =>
    ({
      APP_ENV: "dev",
    }) as Env;

  const createAppContext = ({
    responseKind = "document",
    responseFormat = "html",
    env = createEnv(),
  }: {
    responseKind?: ResponseKind;
    responseFormat?: ResponseFormat;
    env?: Env;
  } = {}): AppContext =>
    new AppContext({
      responseKind,
      responseFormat,
      env,
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("reads runtime behaviour from the app context env", () => {
    const env = createEnv();

    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: false,
      public: false,
      indexing: false,
    });

    const context = createContext({
      appContext: createAppContext({ env }),
    });

    applySecurityResponsePolicies(context);

    expect(mockedGetRuntimeBehaviour).toHaveBeenCalledTimes(1);
    expect(mockedGetRuntimeBehaviour).toHaveBeenCalledWith(env);
  });

  it("always sets x-frame-options", () => {
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: false,
      public: false,
      indexing: false,
    });

    const context = createContext();

    const result = applySecurityResponsePolicies(context);

    expect(result.headers.get("x-frame-options")).toBe("DENY");
  });

  it("always sets cross-origin-opener-policy", () => {
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: false,
      public: false,
      indexing: false,
    });

    const context = createContext();

    const result = applySecurityResponsePolicies(context);

    expect(result.headers.get("cross-origin-opener-policy")).toBe(
      "same-origin",
    );
  });

  it("always sets cross-origin-resource-policy", () => {
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: false,
      public: false,
      indexing: false,
    });

    const context = createContext();

    const result = applySecurityResponsePolicies(context);

    expect(result.headers.get("cross-origin-resource-policy")).toBe(
      "same-origin",
    );
  });

  it("does not set cross-origin-embedder-policy when runtime is not public", () => {
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: false,
      public: false,
      indexing: false,
    });

    const context = createContext();

    const result = applySecurityResponsePolicies(context);

    expect(result.headers.get("cross-origin-embedder-policy")).toBeNull();
  });

  it("sets cross-origin-embedder-policy when runtime is public", () => {
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: true,
      public: true,
      indexing: true,
    });

    const context = createContext();

    const result = applySecurityResponsePolicies(context);

    expect(result.headers.get("cross-origin-embedder-policy")).toBe(
      "require-corp",
    );
  });

  it("preserves unrelated headers when rebuilding the response", () => {
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: true,
      public: true,
      indexing: true,
    });

    const context = createContext();

    const result = applySecurityResponsePolicies(context);

    expect(result.headers.get("x-custom-header")).toBe("value");
  });

  it("preserves status and statusText when rebuilding the response", () => {
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: true,
      public: true,
      indexing: true,
    });

    const context = createContext();

    const result = applySecurityResponsePolicies(context);

    expect(result.status).toBe(201);
    expect(result.statusText).toBe("Created");
  });

  it("preserves the response body when rebuilding the response", async () => {
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: true,
      public: true,
      indexing: true,
    });

    const context = createContext();

    const result = applySecurityResponsePolicies(context);

    await expect(result.text()).resolves.toBe("hello");
  });

  it("returns a new response instance", () => {
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: true,
      public: true,
      indexing: true,
    });

    const response = new Response("hello", { status: 200 });

    const context = createContext({ response });

    const result = applySecurityResponsePolicies(context);

    expect(result).not.toBe(response);
  });

  it("overwrites existing security headers with enforced values", () => {
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: true,
      public: true,
      indexing: true,
    });

    const response = new Response("hello", {
      status: 200,
      headers: {
        "x-frame-options": "SAMEORIGIN",
        "cross-origin-opener-policy": "unsafe-none",
        "cross-origin-resource-policy": "cross-origin",
        "cross-origin-embedder-policy": "unsafe-none",
      },
    });

    const context = createContext({ response });

    const result = applySecurityResponsePolicies(context);

    expect(result.headers.get("x-frame-options")).toBe("DENY");
    expect(result.headers.get("cross-origin-opener-policy")).toBe(
      "same-origin",
    );
    expect(result.headers.get("cross-origin-resource-policy")).toBe(
      "same-origin",
    );
    expect(result.headers.get("cross-origin-embedder-policy")).toBe(
      "require-corp",
    );
  });

  it("exposes security headers in a case-insensitive way", () => {
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: true,
      public: true,
      indexing: true,
    });

    const context = createContext();

    const result = applySecurityResponsePolicies(context);

    expect(result.headers.get("X-Frame-Options")).toBe("DENY");
    expect(result.headers.get("Cross-Origin-Opener-Policy")).toBe(
      "same-origin",
    );
    expect(result.headers.get("Cross-Origin-Resource-Policy")).toBe(
      "same-origin",
    );
    expect(result.headers.get("Cross-Origin-Embedder-Policy")).toBe(
      "require-corp",
    );
  });
});
