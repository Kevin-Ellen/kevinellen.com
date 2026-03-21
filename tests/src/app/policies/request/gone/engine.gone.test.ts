// tests/src/app/policies/request/gone/engine.gone.test.ts

import type { GonePath } from "@app/policies/request/gone/gone.types";

type GonePolicyOutcome =
  | { type: "continue" }
  | { type: "render-error"; intent: { kind: "gone" } };

describe("evaluateGonePolicy", () => {
  const createRequest = (url: string): Request => new Request(url);

  const loadEngineWithRules = async (
    rules: readonly GonePath[],
  ): Promise<(req: Request) => GonePolicyOutcome> => {
    jest.resetModules();

    jest.doMock("@app/policies/request/gone/rules.gone", () => ({
      goneRules: rules,
    }));

    const module = await import("@app/policies/request/gone/engine.gone");

    return module.evaluateGonePolicy as (req: Request) => GonePolicyOutcome;
  };

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.unmock("@app/policies/request/gone/rules.gone");
  });

  it("returns continue when the request path is not explicitly gone", async () => {
    const evaluateGonePolicy = await loadEngineWithRules(["/test-gone"]);

    const request = createRequest("https://example.com/not-gone");
    const outcome = evaluateGonePolicy(request);

    expect(outcome).toEqual({ type: "continue" });
  });

  it("returns render-error gone intent when the request path is explicitly gone", async () => {
    const evaluateGonePolicy = await loadEngineWithRules(["/test-gone"]);

    const request = createRequest("https://example.com/test-gone");
    const outcome = evaluateGonePolicy(request);

    expect(outcome).toEqual({
      type: "render-error",
      intent: { kind: "gone" },
    });
  });

  it("matches on pathname only and ignores the query string", async () => {
    const evaluateGonePolicy = await loadEngineWithRules(["/test-gone"]);

    const request = createRequest("https://example.com/test-gone?ref=mail");
    const outcome = evaluateGonePolicy(request);

    expect(outcome).toEqual({
      type: "render-error",
      intent: { kind: "gone" },
    });
  });

  it("does not match a different pathname", async () => {
    const evaluateGonePolicy = await loadEngineWithRules(["/test-gone"]);

    const request = createRequest("https://example.com/Test-Gone");
    const outcome = evaluateGonePolicy(request);

    expect(outcome).toEqual({ type: "continue" });
  });

  it("does not treat an unknown route as gone", async () => {
    const evaluateGonePolicy = await loadEngineWithRules(["/test-gone"]);

    const request = createRequest("https://example.com/does-not-exist");
    const outcome = evaluateGonePolicy(request);

    expect(outcome).toEqual({ type: "continue" });
  });

  it("supports multiple gone paths", async () => {
    const evaluateGonePolicy = await loadEngineWithRules([
      "/test-gone",
      "/legacy-page",
    ]);

    const request = createRequest("https://example.com/legacy-page");
    const outcome = evaluateGonePolicy(request);

    expect(outcome).toEqual({
      type: "render-error",
      intent: { kind: "gone" },
    });
  });

  it("returns continue when the gone rules list is empty", async () => {
    const evaluateGonePolicy = await loadEngineWithRules([]);

    const request = createRequest("https://example.com/test-gone");
    const outcome = evaluateGonePolicy(request);

    expect(outcome).toEqual({ type: "continue" });
  });
});
