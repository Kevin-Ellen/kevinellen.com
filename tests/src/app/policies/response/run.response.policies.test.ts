// tests/src/app/policies/response/run.response.policies.test.ts

import { runResponsePolicies } from "@app/policies/response/run.response.policies";
import { runResponseStage } from "@app/policies/response/run.response.stage";
import { applyCacheResponsePolicy } from "@app/policies/response/cache/apply.cache.response.policy";
import { applyRobotsResponsePolicy } from "@app/policies/response/robots/apply.robots.response.policy";
import { applyCspResponsePolicy } from "@app/policies/response/security/apply.csp.response.policy";
import { applySecurityHeadersResponsePolicy } from "@app/policies/response/security/apply.security.headers.response.policy";

jest.mock("@app/policies/response/run.response.stage", () => ({
  runResponseStage: jest.fn(),
}));

describe("runResponsePolicies", () => {
  const mockRunResponseStage = jest.mocked(runResponseStage);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("passes the response policy context to the response stage", () => {
    const req = new Request("https://example.com/test");
    const env = { APP_ENV: "dev" } as Env;
    const appState = {} as never;
    const target = {} as never;
    const security = {
      nonce: "testnonce123",
    };
    const response = new Response("hello");
    const expectedResponse = new Response("decorated");

    mockRunResponseStage.mockReturnValue(expectedResponse);

    const result = runResponsePolicies(
      req,
      env,
      appState,
      target,
      security,
      response,
    );

    expect(result).toBe(expectedResponse);
    expect(mockRunResponseStage).toHaveBeenCalledWith(
      {
        req,
        env,
        appState,
        target,
        security,
      },
      response,
      [
        applyRobotsResponsePolicy,
        applyCspResponsePolicy,
        applySecurityHeadersResponsePolicy,
        applyCacheResponsePolicy,
      ],
    );
  });
});
