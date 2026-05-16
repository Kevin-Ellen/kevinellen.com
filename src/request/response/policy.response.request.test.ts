// src/request/response/policy.response.request.test.ts

import { createResponsePolicyHeaders } from "@request/response/policy.response.request";
import { resolveHtmlCacheControlHeader } from "@request/response/cache.response.request";
import { applyBaseResponseHeaders } from "@request/response/headers.response.request";
import { resolveRobotsResponseHeader } from "@request/response/robots.response.request";

jest.mock("@request/response/cache.response.request", () => ({
  resolveHtmlCacheControlHeader: jest.fn(),
}));

jest.mock("@request/response/headers.response.request", () => ({
  applyBaseResponseHeaders: jest.fn((headers: Headers) => headers),
}));

jest.mock("@request/response/robots.response.request", () => ({
  resolveRobotsResponseHeader: jest.fn(),
}));

const createEnv = (appEnv: Env["APP_ENV"] = "prod"): Env =>
  ({ APP_ENV: appEnv }) as Env;

describe("createResponsePolicyHeaders", () => {
  const mockedResolveHtmlCacheControlHeader = jest.mocked(
    resolveHtmlCacheControlHeader,
  );
  const mockedApplyBaseResponseHeaders = jest.mocked(applyBaseResponseHeaders);
  const mockedResolveRobotsResponseHeader = jest.mocked(
    resolveRobotsResponseHeader,
  );

  beforeEach(() => {
    jest.clearAllMocks();

    mockedResolveHtmlCacheControlHeader.mockReturnValue(
      "public, max-age=0, must-revalidate",
    );
  });

  it("applies base headers, cache policy, runtime marker, and robots header when present", () => {
    const env = createEnv();

    mockedResolveRobotsResponseHeader.mockReturnValue("noindex");

    const headers = createResponsePolicyHeaders(
      {
        status: 200,
        nonce: "test-nonce",
        robots: ["noindex"],
      } as never,
      env,
    );

    expect(mockedApplyBaseResponseHeaders).toHaveBeenCalledWith(
      headers,
      "test-nonce",
    );

    expect(mockedResolveHtmlCacheControlHeader).toHaveBeenCalledWith(env, 200);

    expect(mockedResolveRobotsResponseHeader).toHaveBeenCalledWith(
      ["noindex"],
      env,
    );

    expect(headers.get("cache-control")).toBe(
      "public, max-age=0, must-revalidate",
    );
    expect(headers.get("x-runtime-policy")).toBe("html");
    expect(headers.get("x-robots-tag")).toBe("noindex");
  });

  it("does not set robots header when robots resolves to null", () => {
    const env = createEnv();

    mockedResolveRobotsResponseHeader.mockReturnValue(null);

    const headers = createResponsePolicyHeaders(
      {
        status: 200,
        nonce: "test-nonce",
        robots: [],
      } as never,
      env,
    );

    expect(headers.get("x-robots-tag")).toBeNull();
  });

  it("sets the resolved cache-control header", () => {
    const env = createEnv("dev");

    mockedResolveHtmlCacheControlHeader.mockReturnValue("no-store");
    mockedResolveRobotsResponseHeader.mockReturnValue(null);

    const headers = createResponsePolicyHeaders(
      {
        status: 200,
        nonce: "test-nonce",
        robots: [],
      } as never,
      env,
    );

    expect(mockedResolveHtmlCacheControlHeader).toHaveBeenCalledWith(env, 200);
    expect(headers.get("cache-control")).toBe("no-store");
  });

  it("sets the html runtime policy marker", () => {
    const env = createEnv();

    mockedResolveRobotsResponseHeader.mockReturnValue(null);

    const headers = createResponsePolicyHeaders(
      {
        status: 404,
        nonce: "test-nonce",
        robots: [],
      } as never,
      env,
    );

    expect(headers.get("x-runtime-policy")).toBe("html");
  });
});
