// src/request/response/policy.response.request.test.ts

import { createResponsePolicyHeaders } from "@request/response/policy.response.request";
import { applyBaseResponseHeaders } from "@request/response/headers.response.request";
import { resolveRobotsResponseHeader } from "@request/response/robots.response.request";

jest.mock("@request/response/headers.response.request", () => ({
  applyBaseResponseHeaders: jest.fn((headers: Headers) => headers),
}));

jest.mock("@request/response/robots.response.request", () => ({
  resolveRobotsResponseHeader: jest.fn(),
}));

const createEnv = (): Env => ({ APP_ENV: "prod" }) as Env;

describe("createResponsePolicyHeaders", () => {
  const mockedApplyBaseResponseHeaders = jest.mocked(applyBaseResponseHeaders);
  const mockedResolveRobotsResponseHeader = jest.mocked(
    resolveRobotsResponseHeader,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("applies base headers and robots header when present", () => {
    mockedResolveRobotsResponseHeader.mockReturnValue("noindex");

    const headers = createResponsePolicyHeaders(
      {
        status: 200,
        nonce: "test-nonce",
        robots: ["noindex"],
      } as never,
      createEnv(),
    );

    expect(mockedApplyBaseResponseHeaders).toHaveBeenCalledWith(
      headers,
      "test-nonce",
    );
    expect(mockedResolveRobotsResponseHeader).toHaveBeenCalledWith(
      ["noindex"],
      createEnv(),
    );
    expect(headers.get("x-robots-tag")).toBe("noindex");
  });

  it("does not set robots header when robots resolves to null", () => {
    mockedResolveRobotsResponseHeader.mockReturnValue(null);

    const headers = createResponsePolicyHeaders(
      {
        status: 200,
        nonce: "test-nonce",
        robots: [],
      } as never,
      createEnv(),
    );

    expect(headers.get("x-robots-tag")).toBeNull();
  });
});
