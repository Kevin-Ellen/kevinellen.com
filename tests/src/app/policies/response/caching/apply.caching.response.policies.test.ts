// tests/src/app/policies/response/caching/apply.caching.response.policies.test.ts

import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";

import { AppContext } from "@app/appContext/appContext";
import { applyCachingResponsePolicies } from "@app/policies/response/caching/apply.caching.response.policies";
import { getRuntimeBehaviour } from "@utils/runtimeEnv.util";

jest.mock("@utils/runtimeEnv.util", () => ({
  getRuntimeBehaviour: jest.fn(),
}));

describe("applyCachingResponsePolicies", () => {
  const mockedGetRuntimeBehaviour = jest.mocked(getRuntimeBehaviour);

  const createEnv = (): Env =>
    ({
      APP_ENV: "dev",
    }) as Env;

  const createAppContext = ({
    responseKind = "document",
    env = createEnv(),
  }: {
    responseKind?: "document" | "direct" | "resource" | "asset";
    env?: Env;
  } = {}): AppContext =>
    new AppContext({
      responseKind,
      responseFormat: "html",
      env,
    });

  const createContext = ({
    response = new Response("ok", {
      status: 200,
      statusText: "OK",
      headers: {
        "x-custom-header": "value",
      },
    }),
    responseKind = "document",
    env = createEnv(),
  }: {
    response?: Response;
    responseKind?: "document" | "direct" | "resource" | "asset";
    env?: Env;
  } = {}): ResponsePolicyContext => ({
    response,
    appContext: createAppContext({ responseKind, env }),
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the original response for non-document responses", () => {
    const response = new Response("ok", { status: 200 });
    const context = createContext({
      response,
      responseKind: "direct",
    });

    const result = applyCachingResponsePolicies(context);

    expect(result).toBe(response);
    expect(mockedGetRuntimeBehaviour).not.toHaveBeenCalled();
  });

  it("reads runtime behaviour from the document response env", () => {
    const env = createEnv();
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: false,
      public: false,
      indexing: false,
    });

    const context = createContext({ env });

    applyCachingResponsePolicies(context);

    expect(mockedGetRuntimeBehaviour).toHaveBeenCalledTimes(1);
    expect(mockedGetRuntimeBehaviour).toHaveBeenCalledWith(env);
  });

  it("sets no-store for non-public runtime", () => {
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: false,
      public: false,
      indexing: false,
    });

    const context = createContext();

    const result = applyCachingResponsePolicies(context);

    expect(result.headers.get("cache-control")).toBe("no-store");
  });

  it("sets no-store for error documents even in public runtime", () => {
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: true,
      public: true,
      indexing: true,
    });

    const context = createContext({
      response: new Response("error", { status: 404 }),
    });

    const result = applyCachingResponsePolicies(context);

    expect(result.headers.get("cache-control")).toBe("no-store");
  });

  it("uses response.status as the source of truth for error detection", () => {
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: true,
      public: true,
      indexing: true,
    });

    const context = createContext({
      response: new Response("server error", { status: 500 }),
    });

    const result = applyCachingResponsePolicies(context);

    expect(result.headers.get("cache-control")).toBe("no-store");
  });

  it("sets staging cache headers for public non-indexable runtime", () => {
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: true,
      public: true,
      indexing: false,
    });

    const context = createContext();

    const result = applyCachingResponsePolicies(context);

    expect(result.headers.get("cache-control")).toBe(
      "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
    );
  });

  it("sets production cache headers for public indexable runtime", () => {
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: true,
      public: true,
      indexing: true,
    });

    const context = createContext();

    const result = applyCachingResponsePolicies(context);

    expect(result.headers.get("cache-control")).toBe(
      "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
    );
  });

  it("overwrites an existing cache-control header for document responses", () => {
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: true,
      public: true,
      indexing: true,
    });

    const context = createContext({
      response: new Response("ok", {
        status: 200,
        headers: {
          "cache-control": "private, max-age=1",
          "x-custom-header": "value",
        },
      }),
    });

    const result = applyCachingResponsePolicies(context);

    expect(result.headers.get("cache-control")).toBe(
      "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
    );
  });

  it("preserves non-cache headers when rebuilding the response", () => {
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: true,
      public: true,
      indexing: false,
    });

    const context = createContext();

    const result = applyCachingResponsePolicies(context);

    expect(result.headers.get("x-custom-header")).toBe("value");
  });

  it("preserves status and statusText for document responses", () => {
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: true,
      public: true,
      indexing: false,
    });

    const context = createContext({
      response: new Response("ok", {
        status: 201,
        statusText: "Created",
      }),
    });

    const result = applyCachingResponsePolicies(context);

    expect(result.status).toBe(201);
    expect(result.statusText).toBe("Created");
  });

  it("preserves response body for document responses", async () => {
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: true,
      public: true,
      indexing: false,
    });

    const context = createContext({
      response: new Response("hello"),
    });

    const result = applyCachingResponsePolicies(context);

    await expect(result.text()).resolves.toBe("hello");
  });

  it("returns a new response instance for document responses", () => {
    mockedGetRuntimeBehaviour.mockReturnValue({
      canonical: true,
      public: true,
      indexing: true,
    });

    const response = new Response("ok", { status: 200 });
    const context = createContext({ response });

    const result = applyCachingResponsePolicies(context);

    expect(result).not.toBe(response);
  });
});
