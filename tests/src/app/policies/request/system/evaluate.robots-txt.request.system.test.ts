// tests/src/app/policies/request/system/evaluate.robots-txt.request.system.test.ts

import type { AppState } from "@app/appState/class.appState";

import { evaluateRobotsTxtRequestSystem } from "@app/policies/request/system/evaluate.robots-txt.request.system";
import { buildRobotsTxtRequestSystem } from "@app/policies/request/system/build.robots-txt.request.system";

jest.mock(
  "@app/policies/request/system/build.robots-txt.request.system",
  () => ({
    buildRobotsTxtRequestSystem: jest.fn(),
  }),
);

describe("evaluateRobotsTxtRequestSystem", () => {
  const env = {} as Env;
  const appState = {} as AppState;

  const mockedBuildRobotsTxtRequestSystem =
    buildRobotsTxtRequestSystem as jest.MockedFunction<
      typeof buildRobotsTxtRequestSystem
    >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns continue when pathname is not /robots.txt", () => {
    const req = new Request("https://example.com/test");

    const result = evaluateRobotsTxtRequestSystem(req, env, appState);

    expect(result).toEqual({ kind: "continue" });
    expect(mockedBuildRobotsTxtRequestSystem).not.toHaveBeenCalled();
  });

  it("returns direct-response for /robots.txt", async () => {
    const req = new Request("https://example.com/robots.txt");

    mockedBuildRobotsTxtRequestSystem.mockReturnValue(
      "User-agent: *\nDisallow:\n",
    );

    const result = evaluateRobotsTxtRequestSystem(req, env, appState);

    expect(result.kind).toBe("direct-response");

    if (result.kind !== "direct-response") {
      throw new Error("Expected direct-response");
    }

    expect(result.response.status).toBe(200);
    expect(result.response.headers.get("content-type")).toBe(
      "text/plain; charset=utf-8",
    );
    expect(await result.response.text()).toBe("User-agent: *\nDisallow:\n");
    expect(mockedBuildRobotsTxtRequestSystem).toHaveBeenCalledWith(appState);
  });
});
