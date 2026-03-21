// tests/src/app/policies/request/orchestrator.request.policies.test.ts

import type { RequestPolicyOutcome } from "@app/policies/request/request.policies.types";
import type { AppState } from "@app/appState/appState";

import { AppState as AppStateClass } from "@app/appState/appState";
import { createTestAppSeed } from "@src/app/bootstrap/appSeed.test.create";

import { orchestrateRequestPolicies } from "@app/policies/request/orchestrator.request.policies";
import { routeRequest } from "@app/request/router.request";
import { evaluateRedirectPolicy } from "@app/policies/request/redirects/engine.redirects";
import { evaluateGonePolicy } from "@app/policies/request/gone/engine.gone";
import { evaluateCanonicalPolicy } from "@app/policies/request/canonical/engine.canonical";
import { evaluateMethodPolicy } from "@app/policies/request/method/engine.method";

jest.mock("@app/request/router.request", () => ({
  routeRequest: jest.fn(),
}));

jest.mock("@app/policies/request/redirects/engine.redirects", () => ({
  evaluateRedirectPolicy: jest.fn(),
}));

jest.mock("@app/policies/request/gone/engine.gone", () => ({
  evaluateGonePolicy: jest.fn(),
}));

jest.mock("@app/policies/request/canonical/engine.canonical", () => ({
  evaluateCanonicalPolicy: jest.fn(),
}));

jest.mock("@app/policies/request/method/engine.method", () => ({
  evaluateMethodPolicy: jest.fn(),
}));

describe("orchestrateRequestPolicies", () => {
  const mockedRouteRequest = jest.mocked(routeRequest);
  const mockedEvaluateRedirectPolicy = jest.mocked(evaluateRedirectPolicy);
  const mockedEvaluateGonePolicy = jest.mocked(evaluateGonePolicy);
  const mockedEvaluateCanonicalPolicy = jest.mocked(evaluateCanonicalPolicy);
  const mockedEvaluateMethodPolicy = jest.mocked(evaluateMethodPolicy);

  let appState: AppState;

  const createRequest = (path: string, method = "GET"): Request =>
    new Request(`https://example.com${path}`, { method });

  const createRedirectResponse = (
    status: 301 | 302 | 307 | 308,
    location = "/new-location",
  ): Response =>
    new Response(null, {
      status,
      headers: {
        location,
        "x-runtime-policy": "redirect",
      },
    });

  const createCanonicalResponse = (location: string): Response =>
    new Response(null, {
      status: 308,
      headers: {
        location,
        "x-runtime-policy": "canonical",
      },
    });

  const createMethodResponse = (): Response =>
    new Response(null, {
      status: 405,
      headers: {
        allow: "GET, HEAD",
        "x-runtime-policy": "method",
      },
    });

  const getFirstCallOrder = (mockFn: {
    mock: { invocationCallOrder: number[] };
  }): number => {
    const callOrder = mockFn.mock.invocationCallOrder[0];

    if (callOrder === undefined) {
      throw new Error(
        "Test setup failed: expected mock to have been called at least once.",
      );
    }

    return callOrder;
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    mockedEvaluateMethodPolicy.mockReturnValue({ type: "continue" });
    mockedEvaluateCanonicalPolicy.mockReturnValue({ type: "continue" });
    mockedEvaluateRedirectPolicy.mockReturnValue({ type: "continue" });
    mockedEvaluateGonePolicy.mockReturnValue({ type: "continue" });

    const appSeed = await createTestAppSeed();
    appState = new AppStateClass(appSeed);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("successful flow", () => {
    it("returns render-page when pre-routing continues and routing finds a page", () => {
      const homePage = appState.getPageBySlug("/");

      if (!homePage) {
        throw new Error('Test setup failed: expected home page at "/"');
      }

      mockedRouteRequest.mockReturnValue({
        kind: "found",
        page: homePage,
      });

      const outcome = orchestrateRequestPolicies(
        createRequest("/"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(outcome).toEqual({
        type: "render-page",
        page: homePage,
        status: 200,
      } satisfies RequestPolicyOutcome);
    });

    it("passes pathname only to the router", () => {
      const homePage = appState.getPageBySlug("/");

      if (!homePage) {
        throw new Error('Test setup failed: expected home page at "/"');
      }

      mockedRouteRequest.mockReturnValue({
        kind: "found",
        page: homePage,
      });

      orchestrateRequestPolicies(
        createRequest("/?utm_source=test"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(mockedRouteRequest).toHaveBeenCalledWith("/", appState);
    });
  });

  describe("routing miss flow", () => {
    it("returns render-error not-found when routing misses", () => {
      mockedRouteRequest.mockReturnValue({ kind: "not-found" });

      const outcome = orchestrateRequestPolicies(
        createRequest("/missing"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(outcome).toEqual({
        type: "render-error",
        intent: { kind: "not-found" },
      } satisfies RequestPolicyOutcome);
    });
  });

  describe("method pre-routing policy flow", () => {
    it("returns direct-response and bypasses canonical, redirect, gone, and routing", () => {
      mockedEvaluateMethodPolicy.mockReturnValue({
        type: "direct-response",
        response: createMethodResponse(),
      });

      const outcome = orchestrateRequestPolicies(
        createRequest("/", "POST"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(outcome.type).toBe("direct-response");

      if (outcome.type !== "direct-response") {
        throw new Error(
          'Test setup failed: expected "direct-response" outcome.',
        );
      }

      expect(outcome.response.status).toBe(405);
      expect(outcome.response.headers.get("allow")).toBe("GET, HEAD");
      expect(outcome.response.headers.get("x-runtime-policy")).toBe("method");

      expect(mockedEvaluateCanonicalPolicy).not.toHaveBeenCalled();
      expect(mockedEvaluateRedirectPolicy).not.toHaveBeenCalled();
      expect(mockedEvaluateGonePolicy).not.toHaveBeenCalled();
      expect(mockedRouteRequest).not.toHaveBeenCalled();
    });
  });

  describe("canonical pre-routing policy flow", () => {
    it("returns direct-response and bypasses later policies and routing", () => {
      mockedEvaluateCanonicalPolicy.mockReturnValue({
        type: "direct-response",
        response: createCanonicalResponse("https://example.com/about"),
      });

      const outcome = orchestrateRequestPolicies(
        createRequest("/About/"),
        { APP_ENV: "prod" } as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(outcome.type).toBe("direct-response");

      if (outcome.type !== "direct-response") {
        throw new Error(
          'Test setup failed: expected "direct-response" outcome.',
        );
      }

      expect(outcome.response.status).toBe(308);
      expect(outcome.response.headers.get("location")).toBe(
        "https://example.com/about",
      );
      expect(outcome.response.headers.get("x-runtime-policy")).toBe(
        "canonical",
      );

      expect(mockedEvaluateRedirectPolicy).not.toHaveBeenCalled();
      expect(mockedEvaluateGonePolicy).not.toHaveBeenCalled();
      expect(mockedRouteRequest).not.toHaveBeenCalled();
    });
  });

  describe("redirect pre-routing policy flow", () => {
    it.each([301, 302, 307, 308] as const)(
      "returns direct-response %i and bypasses routing",
      (statusCode) => {
        mockedEvaluateRedirectPolicy.mockReturnValue({
          type: "direct-response",
          response: createRedirectResponse(statusCode),
        });

        const outcome = orchestrateRequestPolicies(
          createRequest("/old"),
          {} as Env,
          {} as ExecutionContext,
          appState,
        );

        expect(outcome.type).toBe("direct-response");

        if (outcome.type !== "direct-response") {
          throw new Error(
            'Test setup failed: expected "direct-response" outcome.',
          );
        }

        expect(outcome.response.status).toBe(statusCode);
        expect(outcome.response.headers.get("location")).toBe("/new-location");
        expect(outcome.response.headers.get("x-runtime-policy")).toBe(
          "redirect",
        );

        expect(mockedEvaluateGonePolicy).not.toHaveBeenCalled();
        expect(mockedRouteRequest).not.toHaveBeenCalled();
      },
    );

    it("redirect takes precedence over gone policy", () => {
      mockedEvaluateRedirectPolicy.mockReturnValue({
        type: "direct-response",
        response: createRedirectResponse(308, "/preferred"),
      });

      const outcome = orchestrateRequestPolicies(
        createRequest("/conflict"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(outcome.type).toBe("direct-response");

      if (outcome.type !== "direct-response") {
        throw new Error(
          'Test setup failed: expected "direct-response" outcome.',
        );
      }

      expect(outcome.response.status).toBe(308);
      expect(outcome.response.headers.get("location")).toBe("/preferred");
      expect(outcome.response.headers.get("x-runtime-policy")).toBe("redirect");

      expect(mockedEvaluateGonePolicy).not.toHaveBeenCalled();
    });
  });

  describe("gone pre-routing policy flow", () => {
    it("returns render-error gone and bypasses routing", () => {
      mockedEvaluateGonePolicy.mockReturnValue({
        type: "render-error",
        intent: { kind: "gone" },
      });

      const outcome = orchestrateRequestPolicies(
        createRequest("/gone"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(outcome).toEqual({
        type: "render-error",
        intent: { kind: "gone" },
      } satisfies RequestPolicyOutcome);

      expect(mockedRouteRequest).not.toHaveBeenCalled();
    });
  });

  describe("policy ordering contract", () => {
    it("evaluates method policy before canonical, redirect, and gone policies", () => {
      mockedRouteRequest.mockReturnValue({ kind: "not-found" });

      orchestrateRequestPolicies(
        createRequest("/ordering-check"),
        { APP_ENV: "prod" } as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(mockedEvaluateMethodPolicy).toHaveBeenCalledTimes(1);
      expect(mockedEvaluateCanonicalPolicy).toHaveBeenCalledTimes(1);
      expect(mockedEvaluateRedirectPolicy).toHaveBeenCalledTimes(1);
      expect(mockedEvaluateGonePolicy).toHaveBeenCalledTimes(1);

      expect(getFirstCallOrder(mockedEvaluateMethodPolicy)).toBeLessThan(
        getFirstCallOrder(mockedEvaluateCanonicalPolicy),
      );
      expect(getFirstCallOrder(mockedEvaluateCanonicalPolicy)).toBeLessThan(
        getFirstCallOrder(mockedEvaluateRedirectPolicy),
      );
      expect(getFirstCallOrder(mockedEvaluateRedirectPolicy)).toBeLessThan(
        getFirstCallOrder(mockedEvaluateGonePolicy),
      );
    });

    it("does not evaluate canonical, redirect, or gone policy when method policy terminates request", () => {
      mockedEvaluateMethodPolicy.mockReturnValue({
        type: "direct-response",
        response: createMethodResponse(),
      });

      const outcome = orchestrateRequestPolicies(
        createRequest("/", "POST"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(outcome.type).toBe("direct-response");

      expect(mockedEvaluateMethodPolicy).toHaveBeenCalledTimes(1);
      expect(mockedEvaluateCanonicalPolicy).not.toHaveBeenCalled();
      expect(mockedEvaluateRedirectPolicy).not.toHaveBeenCalled();
      expect(mockedEvaluateGonePolicy).not.toHaveBeenCalled();
      expect(mockedRouteRequest).not.toHaveBeenCalled();
    });

    it("does not evaluate redirect or gone policy when canonical policy terminates request", () => {
      mockedEvaluateCanonicalPolicy.mockReturnValue({
        type: "direct-response",
        response: createCanonicalResponse("https://example.com/about"),
      });

      const outcome = orchestrateRequestPolicies(
        createRequest("/About/"),
        { APP_ENV: "prod" } as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(outcome.type).toBe("direct-response");

      expect(mockedEvaluateCanonicalPolicy).toHaveBeenCalledTimes(1);
      expect(mockedEvaluateRedirectPolicy).not.toHaveBeenCalled();
      expect(mockedEvaluateGonePolicy).not.toHaveBeenCalled();
      expect(mockedRouteRequest).not.toHaveBeenCalled();
    });

    it("does not evaluate gone policy when redirect policy terminates request", () => {
      mockedEvaluateRedirectPolicy.mockReturnValue({
        type: "direct-response",
        response: createRedirectResponse(301),
      });

      const outcome = orchestrateRequestPolicies(
        createRequest("/old"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(outcome.type).toBe("direct-response");

      expect(mockedEvaluateRedirectPolicy).toHaveBeenCalledTimes(1);
      expect(mockedEvaluateGonePolicy).not.toHaveBeenCalled();
      expect(mockedRouteRequest).not.toHaveBeenCalled();
    });

    it("does not evaluate routing when gone policy terminates request", () => {
      mockedEvaluateGonePolicy.mockReturnValue({
        type: "render-error",
        intent: { kind: "gone" },
      });

      const outcome = orchestrateRequestPolicies(
        createRequest("/gone"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(outcome).toEqual({
        type: "render-error",
        intent: { kind: "gone" },
      } satisfies RequestPolicyOutcome);

      expect(mockedEvaluateMethodPolicy).toHaveBeenCalledTimes(1);
      expect(mockedEvaluateCanonicalPolicy).toHaveBeenCalledTimes(1);
      expect(mockedEvaluateRedirectPolicy).toHaveBeenCalledTimes(1);
      expect(mockedEvaluateGonePolicy).toHaveBeenCalledTimes(1);
      expect(mockedRouteRequest).not.toHaveBeenCalled();
    });

    it("only reaches routing after all pre-routing policies continue", () => {
      const homePage = appState.getPageBySlug("/");

      if (!homePage) {
        throw new Error('Test setup failed: expected home page at "/"');
      }

      mockedRouteRequest.mockReturnValue({
        kind: "found",
        page: homePage,
      });

      const outcome = orchestrateRequestPolicies(
        createRequest("/"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(outcome).toEqual({
        type: "render-page",
        page: homePage,
        status: 200,
      } satisfies RequestPolicyOutcome);

      expect(mockedEvaluateMethodPolicy).toHaveBeenCalledTimes(1);
      expect(mockedEvaluateCanonicalPolicy).toHaveBeenCalledTimes(1);
      expect(mockedEvaluateRedirectPolicy).toHaveBeenCalledTimes(1);
      expect(mockedEvaluateGonePolicy).toHaveBeenCalledTimes(1);
      expect(mockedRouteRequest).toHaveBeenCalledTimes(1);

      expect(getFirstCallOrder(mockedEvaluateGonePolicy)).toBeLessThan(
        getFirstCallOrder(mockedRouteRequest),
      );
    });
  });

  describe("error page guard contract", () => {
    it("does not use pages.errors for direct method responses", () => {
      const getErrorPageSpy = jest.spyOn(
        AppStateClass.prototype,
        "getErrorPageByStatus",
      );

      mockedEvaluateMethodPolicy.mockReturnValue({
        type: "direct-response",
        response: createMethodResponse(),
      });

      const outcome = orchestrateRequestPolicies(
        createRequest("/", "POST"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(outcome.type).toBe("direct-response");
      expect(getErrorPageSpy).not.toHaveBeenCalled();
    });

    it("does not use pages.errors for canonical direct responses", () => {
      const getErrorPageSpy = jest.spyOn(
        AppStateClass.prototype,
        "getErrorPageByStatus",
      );

      mockedEvaluateCanonicalPolicy.mockReturnValue({
        type: "direct-response",
        response: createCanonicalResponse("https://example.com/about"),
      });

      const outcome = orchestrateRequestPolicies(
        createRequest("/About/"),
        { APP_ENV: "prod" } as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(outcome.type).toBe("direct-response");
      expect(getErrorPageSpy).not.toHaveBeenCalled();
    });

    it("does not use pages.errors for redirect direct responses", () => {
      const getErrorPageSpy = jest.spyOn(
        AppStateClass.prototype,
        "getErrorPageByStatus",
      );

      mockedEvaluateRedirectPolicy.mockReturnValue({
        type: "direct-response",
        response: createRedirectResponse(301),
      });

      const outcome = orchestrateRequestPolicies(
        createRequest("/old"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(outcome.type).toBe("direct-response");
      expect(getErrorPageSpy).not.toHaveBeenCalled();
    });

    it("does not use pages.errors for rendered gone responses at request orchestration stage", () => {
      const getErrorPageSpy = jest.spyOn(
        AppStateClass.prototype,
        "getErrorPageByStatus",
      );

      mockedEvaluateGonePolicy.mockReturnValue({
        type: "render-error",
        intent: { kind: "gone" },
      });

      const outcome = orchestrateRequestPolicies(
        createRequest("/gone"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(outcome).toEqual({
        type: "render-error",
        intent: { kind: "gone" },
      } satisfies RequestPolicyOutcome);

      expect(getErrorPageSpy).not.toHaveBeenCalled();
    });

    it("does not use pages.errors for routing misses at request orchestration stage", () => {
      const getErrorPageSpy = jest.spyOn(
        AppStateClass.prototype,
        "getErrorPageByStatus",
      );

      mockedRouteRequest.mockReturnValue({ kind: "not-found" });

      const outcome = orchestrateRequestPolicies(
        createRequest("/missing"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(outcome).toEqual({
        type: "render-error",
        intent: { kind: "not-found" },
      } satisfies RequestPolicyOutcome);

      expect(getErrorPageSpy).not.toHaveBeenCalled();
    });
  });
});
