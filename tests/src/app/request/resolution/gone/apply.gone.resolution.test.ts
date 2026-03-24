// tests/src/app/request/resolution/gone/apply.gone.resolution.test.ts

import { applyGoneResolution } from "@app/request/resolution/gone/apply.gone";
import { getRequestPath } from "@utils/request.util";
import { goneRules } from "@app/request/resolution/gone/rules.gone";

jest.mock("@utils/request.util", () => ({
  getRequestPath: jest.fn(),
}));

jest.mock("@app/request/resolution/gone/rules.gone", () => ({
  goneRules: [],
}));

describe("applyGoneResolution", () => {
  const mockedGetRequestPath = jest.mocked(getRequestPath);
  const mockedGoneRules = goneRules as string[];

  const createRequest = (): Request =>
    new Request("https://kevinellen.com/example");

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGoneRules.length = 0;
  });

  it("returns continue when the request path is not in gone rules", () => {
    const req = createRequest();

    mockedGetRequestPath.mockReturnValue("/example");
    mockedGoneRules.push("/old-page");

    const result = applyGoneResolution(req);

    expect(result).toEqual({ type: "continue" });
  });

  it("returns render-error gone when the request path is in gone rules", () => {
    const req = createRequest();

    mockedGetRequestPath.mockReturnValue("/old-page");
    mockedGoneRules.push("/old-page");

    const result = applyGoneResolution(req);

    expect(result).toEqual({
      type: "render-error",
      intent: { kind: "gone" },
    });
  });

  it("matches the request path exactly", () => {
    const req = createRequest();

    mockedGetRequestPath.mockReturnValue("/old");
    mockedGoneRules.push("/old-page");

    const result = applyGoneResolution(req);

    expect(result).toEqual({ type: "continue" });
  });

  it("returns gone when duplicate matching paths exist in the rules", () => {
    const req = createRequest();

    mockedGetRequestPath.mockReturnValue("/old-page");
    mockedGoneRules.push("/old-page", "/old-page");

    const result = applyGoneResolution(req);

    expect(result).toEqual({
      type: "render-error",
      intent: { kind: "gone" },
    });
  });

  it("always resolves to the gone render intent when matched", () => {
    const req = createRequest();

    mockedGetRequestPath.mockReturnValue("/removed-page");
    mockedGoneRules.push("/removed-page");

    const result = applyGoneResolution(req);

    expect(result).toEqual({
      type: "render-error",
      intent: { kind: "gone" },
    });
  });

  it("uses getRequestPath as the source of truth", () => {
    const req = createRequest();

    mockedGetRequestPath.mockReturnValue("/from-helper");
    mockedGoneRules.push("/from-helper");

    applyGoneResolution(req);

    expect(mockedGetRequestPath).toHaveBeenCalledTimes(1);
    expect(mockedGetRequestPath).toHaveBeenCalledWith(req);
  });

  it("checks the current request path against the gone rules on every call", () => {
    const req = createRequest();

    mockedGetRequestPath
      .mockReturnValueOnce("/first-path")
      .mockReturnValueOnce("/second-path");

    mockedGoneRules.push("/second-path");

    const firstResult = applyGoneResolution(req);
    const secondResult = applyGoneResolution(req);

    expect(firstResult).toEqual({ type: "continue" });
    expect(secondResult).toEqual({
      type: "render-error",
      intent: { kind: "gone" },
    });
  });
});
