// tests/src/request/response/policy.response.request.test.ts

import { createResponsePolicyHeaders } from "@request/response/policy.response.request";
import { applyBaseResponseHeaders } from "@request/response/headers.response.request";
import { resolveRobotsResponseHeader } from "@request/response/robots.response.request";

jest.mock("@request/response/headers.response.request", () => ({
  applyBaseResponseHeaders: jest.fn(),
}));

jest.mock("@request/response/robots.response.request", () => ({
  resolveRobotsResponseHeader: jest.fn(),
}));

describe("createResponsePolicyHeaders", () => {
  const mockedApplyBaseResponseHeaders = jest.mocked(applyBaseResponseHeaders);
  const mockedResolveRobotsResponseHeader = jest.mocked(
    resolveRobotsResponseHeader,
  );

  const env = {
    APP_ENV: "prod",
  } as Env;

  beforeEach(() => {
    jest.clearAllMocks();

    mockedApplyBaseResponseHeaders.mockImplementation((headers) => headers);
    mockedResolveRobotsResponseHeader.mockReturnValue(null);
  });

  it("applies base response headers using the response nonce", () => {
    const responsePolicy = {
      status: 200,
      robots: [],
      nonce: "test-nonce",
    } as const;

    createResponsePolicyHeaders(responsePolicy, env);

    expect(mockedApplyBaseResponseHeaders).toHaveBeenCalledTimes(1);
    expect(mockedApplyBaseResponseHeaders).toHaveBeenCalledWith(
      expect.any(Headers),
      "test-nonce",
    );
  });

  it("sets x-robots-tag when robots resolver returns a header value", () => {
    const responsePolicy = {
      status: 200,
      robots: ["noindex"],
      nonce: "test-nonce",
    } as const;

    mockedResolveRobotsResponseHeader.mockReturnValue("noindex");

    const headers = createResponsePolicyHeaders(responsePolicy, env);

    expect(mockedResolveRobotsResponseHeader).toHaveBeenCalledWith(
      ["noindex"],
      env,
    );
    expect(headers.get("x-robots-tag")).toBe("noindex");
  });

  it("does not set x-robots-tag when robots resolver returns null", () => {
    const responsePolicy = {
      status: 200,
      robots: [],
      nonce: "test-nonce",
    } as const;

    const headers = createResponsePolicyHeaders(responsePolicy, env);

    expect(mockedResolveRobotsResponseHeader).toHaveBeenCalledWith([], env);
    expect(headers.get("x-robots-tag")).toBeNull();
  });
});
