// tests/src/app/policies/request/system/evaluate.webmanifest.request.system.test.ts

import type { AppState } from "@app/appState/class.appState";

import { evaluateWebManifestRequestSystem } from "@app/policies/request/system/evaluate.webmanifest.request.system";
import { buildWebManifestSystem } from "@app/policies/request/system/build.webmanifest.request.system";

jest.mock(
  "@app/policies/request/system/build.webmanifest.request.system",
  () => ({
    buildWebManifestSystem: jest.fn(),
  }),
);

describe("evaluateWebManifestRequestSystem", () => {
  const env = {} as Env;
  const appState = {} as AppState;

  const mockedBuildWebManifestSystem =
    buildWebManifestSystem as jest.MockedFunction<
      typeof buildWebManifestSystem
    >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns continue when pathname is not /manifest.webmanifest", () => {
    const req = new Request("https://example.com/test");

    const result = evaluateWebManifestRequestSystem(req, env, appState);

    expect(result).toEqual({ kind: "continue" });
    expect(mockedBuildWebManifestSystem).not.toHaveBeenCalled();
  });

  it("returns direct-response for /manifest.webmanifest", async () => {
    const req = new Request("https://example.com/manifest.webmanifest");

    mockedBuildWebManifestSystem.mockReturnValue('{"name":"Kevin Ellen"}');

    const result = evaluateWebManifestRequestSystem(req, env, appState);

    expect(result.kind).toBe("direct-response");

    if (result.kind !== "direct-response") {
      throw new Error("Expected direct-response");
    }

    expect(result.response.status).toBe(200);
    expect(result.response.headers.get("content-type")).toBe(
      "application/manifest+json; charset=utf-8",
    );
    expect(await result.response.text()).toBe('{"name":"Kevin Ellen"}');
    expect(mockedBuildWebManifestSystem).toHaveBeenCalledWith(appState);
  });
});
