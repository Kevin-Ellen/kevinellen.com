// tests/src/app/policies/redirects/engine.redirects.test.ts

import type {
  RedirectCode,
  RedirectRule,
} from "@app/policies/request/redirects/redirects.types";

type RedirectPolicyOutcome =
  | { type: "continue" }
  | { type: "direct-response"; response: Response }
  | { type: "render-error"; intent: { kind: "gone" } };

describe("evaluateRedirectPolicy", () => {
  const createRequest = (url: string): Request => new Request(url);

  const createRedirectRule = (
    status: RedirectCode,
    fromPath = "/old",
    toPath = "/new",
  ): RedirectRule => ({
    fromPath,
    toPath,
    status,
  });

  const loadEngineWithRules = async (
    rules: readonly RedirectRule[],
  ): Promise<(req: Request) => RedirectPolicyOutcome> => {
    jest.resetModules();

    jest.doMock("@app/policies/redirects/rules.redirects", () => ({
      redirectRules: rules,
    }));

    const module =
      await import("@app/policies/request/redirects/engine.redirects");

    return module.evaluateRedirectPolicy as (
      req: Request,
    ) => RedirectPolicyOutcome;
  };

  const expectDirectRedirect = (
    outcome: RedirectPolicyOutcome,
    expectedStatus: RedirectCode,
    expectedLocation: string,
  ): void => {
    expect(outcome.type).toBe("direct-response");

    if (outcome.type !== "direct-response") {
      throw new Error(
        'Test setup failed: expected redirect policy to return "direct-response".',
      );
    }

    expect(outcome.response.status).toBe(expectedStatus);
    expect(outcome.response.headers.get("location")).toBe(expectedLocation);
    expect(outcome.response.headers.get("x-runtime-policy")).toBe("redirect");
    expect(outcome.response.headers.get("content-type")).toBeNull();
  };

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.unmock("@app/policies/redirects/rules.redirects");
  });

  it("returns continue when no redirect rule matches", async () => {
    const evaluateRedirectPolicy = await loadEngineWithRules([
      createRedirectRule(301),
    ]);

    const request = createRequest("https://example.com/no-match");
    const outcome = evaluateRedirectPolicy(request);

    expect(outcome).toEqual({ type: "continue" });
  });

  it.each([301, 302, 307, 308] as const)(
    "returns direct redirect response with status %i for an exact pathname match",
    async (statusCode) => {
      const evaluateRedirectPolicy = await loadEngineWithRules([
        createRedirectRule(statusCode),
      ]);

      const request = createRequest("https://example.com/old");
      const outcome = evaluateRedirectPolicy(request);

      expectDirectRedirect(outcome, statusCode, "/new");
    },
  );

  it.each([301, 302, 307, 308] as const)(
    "matches on pathname only and ignores the query string for status %i",
    async (statusCode) => {
      const evaluateRedirectPolicy = await loadEngineWithRules([
        createRedirectRule(statusCode),
      ]);

      const request = createRequest("https://example.com/old?ref=mail&utm=x");
      const outcome = evaluateRedirectPolicy(request);

      expectDirectRedirect(outcome, statusCode, "/new");
    },
  );

  it("does not match a different pathname", async () => {
    const evaluateRedirectPolicy = await loadEngineWithRules([
      createRedirectRule(301),
    ]);

    const request = createRequest("https://example.com/Old");
    const outcome = evaluateRedirectPolicy(request);

    expect(outcome).toEqual({ type: "continue" });
  });

  it("sets the location header from the matched rule", async () => {
    const evaluateRedirectPolicy = await loadEngineWithRules([
      createRedirectRule(308, "/legacy", "/modern"),
    ]);

    const request = createRequest("https://example.com/legacy");
    const outcome = evaluateRedirectPolicy(request);

    expectDirectRedirect(outcome, 308, "/modern");
  });

  it("sets the runtime policy response header", async () => {
    const evaluateRedirectPolicy = await loadEngineWithRules([
      createRedirectRule(301),
    ]);

    const request = createRequest("https://example.com/old");
    const outcome = evaluateRedirectPolicy(request);

    expect(outcome.type).toBe("direct-response");

    if (outcome.type !== "direct-response") {
      throw new Error(
        'Test setup failed: expected redirect policy to return "direct-response".',
      );
    }

    expect(outcome.response.headers.get("x-runtime-policy")).toBe("redirect");
  });

  it("returns continue for the target path rather than redirecting recursively", async () => {
    const evaluateRedirectPolicy = await loadEngineWithRules([
      createRedirectRule(301),
    ]);

    const request = createRequest("https://example.com/new");
    const outcome = evaluateRedirectPolicy(request);

    expect(outcome).toEqual({ type: "continue" });
  });

  it("uses the first matching rule when rule order matters", async () => {
    const evaluateRedirectPolicy = await loadEngineWithRules([
      createRedirectRule(301, "/old", "/first"),
      createRedirectRule(308, "/old", "/second"),
    ]);

    const request = createRequest("https://example.com/old");
    const outcome = evaluateRedirectPolicy(request);

    expectDirectRedirect(outcome, 301, "/first");
  });
});
