// tests/src/app/request/handler.request.test.ts

import { AppState } from "@app/appState/appState";
import { createTestAppSeed } from "@src/app/bootstrap/appSeed.test.create";

import { handleRequest } from "@app/request/handler.request";
import { routeRequest } from "@app/request/router.request";
import { evaluateRedirectPolicy } from "@app/policies/redirects/engine.redirects";
import { evaluateGonePolicy } from "@app/policies/gone/engine.gone";
import { evaluateCanonicalPolicy } from "@app/policies/canonical/engine.canonical";
import { evaluateMethodPolicy } from "@app/policies/method/engine.method";

jest.mock("@app/request/router.request", () => ({
  routeRequest: jest.fn(),
}));

jest.mock("@app/policies/redirects/engine.redirects", () => ({
  evaluateRedirectPolicy: jest.fn(),
}));

jest.mock("@app/policies/gone/engine.gone", () => ({
  evaluateGonePolicy: jest.fn(),
}));

jest.mock("@app/policies/canonical/engine.canonical", () => ({
  evaluateCanonicalPolicy: jest.fn(),
}));

jest.mock("@app/policies/method/engine.method", () => ({
  evaluateMethodPolicy: jest.fn(),
}));

describe("handleRequest", () => {
  const mockedRouteRequest = jest.mocked(routeRequest);
  const mockedEvaluateRedirectPolicy = jest.mocked(evaluateRedirectPolicy);
  const mockedEvaluateGonePolicy = jest.mocked(evaluateGonePolicy);
  const mockedEvaluateCanonicalPolicy = jest.mocked(evaluateCanonicalPolicy);
  const mockedEvaluateMethodPolicy = jest.mocked(evaluateMethodPolicy);

  let appState: AppState;

  const createRequest = (path: string): Request =>
    new Request(`https://example.com${path}`);

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
    appState = new AppState(appSeed);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("successful routing flow", () => {
    it("returns the resolved page with status 200 when the router returns found", async () => {
      const homePage = appState.getPageBySlug("/");

      if (!homePage) {
        throw new Error('Test setup failed: expected home page at "/"');
      }

      mockedRouteRequest.mockReturnValue({ kind: "found", page: homePage });

      const response = await handleRequest(
        createRequest("/"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toBe(
        "application/json; charset=utf-8",
      );
      expect(response.headers.get("x-runtime-policy")).toBeNull();

      const body = await response.json();
      expect(body).toEqual(homePage);
    });
  });

  describe("routing miss flow", () => {
    it("returns rendered 404 error page", async () => {
      const expected = appState.getErrorPageByStatus(404);

      mockedRouteRequest.mockReturnValue({ kind: "not-found" });

      const response = await handleRequest(
        createRequest("/missing"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(response.status).toBe(404);
      expect(response.headers.get("x-runtime-policy")).toBeNull();

      const body = await response.json();
      expect(body).toEqual(expected);
    });
  });

  describe("unexpected failure flow", () => {
    it("returns rendered 500 error page", async () => {
      const expected = appState.getErrorPageByStatus(500);

      mockedRouteRequest.mockImplementation(() => {
        throw new Error("Boom");
      });

      const response = await handleRequest(
        createRequest("/"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(response.status).toBe(500);
      expect(response.headers.get("x-runtime-policy")).toBeNull();

      const body = await response.json();
      expect(body).toEqual(expected);
    });
  });

  describe("method pre-routing policy flow", () => {
    it("returns 405 and bypasses canonical, redirect, gone, and routing", async () => {
      mockedEvaluateMethodPolicy.mockReturnValue({
        type: "direct-response",
        response: createMethodResponse(),
      });

      const request = new Request("https://example.com/", {
        method: "POST",
      });

      const response = await handleRequest(
        request,
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(response.status).toBe(405);
      expect(response.headers.get("allow")).toBe("GET, HEAD");
      expect(response.headers.get("x-runtime-policy")).toBe("method");
      expect(response.headers.get("content-type")).toBeNull();

      expect(mockedEvaluateCanonicalPolicy).not.toHaveBeenCalled();
      expect(mockedEvaluateRedirectPolicy).not.toHaveBeenCalled();
      expect(mockedEvaluateGonePolicy).not.toHaveBeenCalled();
      expect(mockedRouteRequest).not.toHaveBeenCalled();
    });

    it("includes the method runtime policy header on 405 responses", async () => {
      mockedEvaluateMethodPolicy.mockReturnValue({
        type: "direct-response",
        response: createMethodResponse(),
      });

      const request = new Request("https://example.com/", {
        method: "POST",
      });

      const response = await handleRequest(
        request,
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(response.status).toBe(405);
      expect(response.headers.get("x-runtime-policy")).toBe("method");
    });
  });

  describe("canonical pre-routing policy flow", () => {
    it("returns canonical redirect and bypasses later policies and routing", async () => {
      mockedEvaluateCanonicalPolicy.mockReturnValue({
        type: "direct-response",
        response: createCanonicalResponse("https://example.com/about"),
      });

      const response = await handleRequest(
        createRequest("/About/"),
        { APP_ENV: "prod" } as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe(
        "https://example.com/about",
      );
      expect(response.headers.get("x-runtime-policy")).toBe("canonical");

      expect(mockedEvaluateRedirectPolicy).not.toHaveBeenCalled();
      expect(mockedEvaluateGonePolicy).not.toHaveBeenCalled();
      expect(mockedRouteRequest).not.toHaveBeenCalled();
    });
  });

  describe("redirect pre-routing policy flow", () => {
    it.each([301, 302, 307, 308] as const)(
      "returns redirect %i and bypasses routing",
      async (statusCode) => {
        mockedEvaluateRedirectPolicy.mockReturnValue({
          type: "direct-response",
          response: createRedirectResponse(statusCode),
        });

        const response = await handleRequest(
          createRequest("/old"),
          {} as Env,
          {} as ExecutionContext,
          appState,
        );

        expect(response.status).toBe(statusCode);
        expect(response.headers.get("location")).toBe("/new-location");
        expect(response.headers.get("x-runtime-policy")).toBe("redirect");
        expect(response.headers.get("content-type")).toBeNull();

        expect(mockedEvaluateGonePolicy).not.toHaveBeenCalled();
        expect(mockedRouteRequest).not.toHaveBeenCalled();
      },
    );

    it("redirect takes precedence over gone policy", async () => {
      mockedEvaluateRedirectPolicy.mockReturnValue({
        type: "direct-response",
        response: createRedirectResponse(308, "/preferred"),
      });

      const response = await handleRequest(
        createRequest("/conflict"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe("/preferred");
      expect(response.headers.get("x-runtime-policy")).toBe("redirect");

      expect(mockedEvaluateGonePolicy).not.toHaveBeenCalled();
    });
  });

  describe("gone pre-routing policy flow", () => {
    it("renders 410 gone error page", async () => {
      const expected = appState.getErrorPageByStatus(410);

      mockedEvaluateGonePolicy.mockReturnValue({
        type: "render-error",
        intent: { kind: "gone" },
      });

      const response = await handleRequest(
        createRequest("/gone"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(response.status).toBe(410);
      expect(response.headers.get("x-runtime-policy")).toBe("gone");
      expect(response.headers.get("content-type")).toBe(
        "application/json; charset=utf-8",
      );

      const body = await response.json();
      expect(body).toEqual(expected);
    });
  });

  describe("runtime policy headers", () => {
    it("200 responses do not include runtime policy header", async () => {
      const homePage = appState.getPageBySlug("/");

      if (!homePage) {
        throw new Error('Test setup failed: expected home page at "/"');
      }

      mockedRouteRequest.mockReturnValue({ kind: "found", page: homePage });

      const response = await handleRequest(
        createRequest("/"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(response.headers.get("x-runtime-policy")).toBeNull();
    });

    it("404 responses do not include runtime policy header", async () => {
      mockedRouteRequest.mockReturnValue({ kind: "not-found" });

      const response = await handleRequest(
        createRequest("/missing"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(response.headers.get("x-runtime-policy")).toBeNull();
    });

    it("500 responses do not include runtime policy header", async () => {
      mockedRouteRequest.mockImplementation(() => {
        throw new Error("Boom");
      });

      const response = await handleRequest(
        createRequest("/"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(response.headers.get("x-runtime-policy")).toBeNull();
    });
  });

  describe("policy ordering contract", () => {
    it("evaluates method policy before canonical, redirect, and gone policies", async () => {
      const request = createRequest("/ordering-check");

      await handleRequest(
        request,
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

    it("does not evaluate canonical, redirect, or gone policy when method policy terminates request", async () => {
      mockedEvaluateMethodPolicy.mockReturnValue({
        type: "direct-response",
        response: createMethodResponse(),
      });

      const request = new Request("https://example.com/", {
        method: "POST",
      });

      const response = await handleRequest(
        request,
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(response.status).toBe(405);

      expect(mockedEvaluateMethodPolicy).toHaveBeenCalledTimes(1);
      expect(mockedEvaluateCanonicalPolicy).not.toHaveBeenCalled();
      expect(mockedEvaluateRedirectPolicy).not.toHaveBeenCalled();
      expect(mockedEvaluateGonePolicy).not.toHaveBeenCalled();
      expect(mockedRouteRequest).not.toHaveBeenCalled();
    });

    it("does not evaluate redirect or gone policy when canonical policy terminates request", async () => {
      mockedEvaluateCanonicalPolicy.mockReturnValue({
        type: "direct-response",
        response: createCanonicalResponse("https://example.com/about"),
      });

      const response = await handleRequest(
        createRequest("/About/"),
        { APP_ENV: "prod" } as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(response.status).toBe(308);

      expect(mockedEvaluateCanonicalPolicy).toHaveBeenCalledTimes(1);
      expect(mockedEvaluateRedirectPolicy).not.toHaveBeenCalled();
      expect(mockedEvaluateGonePolicy).not.toHaveBeenCalled();
      expect(mockedRouteRequest).not.toHaveBeenCalled();
    });

    it("does not evaluate gone policy when redirect policy terminates request", async () => {
      mockedEvaluateRedirectPolicy.mockReturnValue({
        type: "direct-response",
        response: createRedirectResponse(301),
      });

      const response = await handleRequest(
        createRequest("/old"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(response.status).toBe(301);

      expect(mockedEvaluateRedirectPolicy).toHaveBeenCalledTimes(1);
      expect(mockedEvaluateGonePolicy).not.toHaveBeenCalled();
      expect(mockedRouteRequest).not.toHaveBeenCalled();
    });

    it("does not evaluate routing when gone policy terminates request", async () => {
      mockedEvaluateGonePolicy.mockReturnValue({
        type: "render-error",
        intent: { kind: "gone" },
      });

      const response = await handleRequest(
        createRequest("/gone"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(response.status).toBe(410);

      expect(mockedEvaluateMethodPolicy).toHaveBeenCalledTimes(1);
      expect(mockedEvaluateCanonicalPolicy).toHaveBeenCalledTimes(1);
      expect(mockedEvaluateRedirectPolicy).toHaveBeenCalledTimes(1);
      expect(mockedEvaluateGonePolicy).toHaveBeenCalledTimes(1);
      expect(mockedRouteRequest).not.toHaveBeenCalled();
    });

    it("only reaches routing after all pre-routing policies continue", async () => {
      const homePage = appState.getPageBySlug("/");

      if (!homePage) {
        throw new Error('Test setup failed: expected home page at "/"');
      }

      mockedRouteRequest.mockReturnValue({
        kind: "found",
        page: homePage,
      });

      const response = await handleRequest(
        createRequest("/"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(response.status).toBe(200);

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
});
