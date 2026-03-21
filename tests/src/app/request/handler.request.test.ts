// tests/src/app/request/handler.request.test.ts

import type { RequestPolicyOutcome } from "@app/policies/request/request.policies.types";
import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";

import { AppState } from "@app/appState/appState";
import { createTestAppSeed } from "@src/app/bootstrap/appSeed.test.create";

import { handleRequest } from "@app/request/handler.request";
import { orchestrateRequestPolicies } from "@app/policies/request/orchestrator.request.policies";
import { orchestrateResponsePolicies } from "@app/policies/response/orchestrator.response.policies";

jest.mock("@app/policies/request/orchestrator.request.policies", () => ({
  orchestrateRequestPolicies: jest.fn(),
}));

jest.mock("@app/policies/response/orchestrator.response.policies", () => ({
  orchestrateResponsePolicies: jest.fn(
    (ctx: ResponsePolicyContext) => ctx.response,
  ),
}));

describe("handleRequest", () => {
  const mockedRequestOrchestrator = jest.mocked(orchestrateRequestPolicies);
  const mockedResponseOrchestrator = jest.mocked(orchestrateResponsePolicies);

  let appState: AppState;

  const createRequest = (path: string): Request =>
    new Request(`https://example.com${path}`);

  const getTextBody = async (response: Response): Promise<string> =>
    await response.text();

  const getFirstResponseContext = (): ResponsePolicyContext => {
    const call = mockedResponseOrchestrator.mock.calls[0];
    if (!call) throw new Error("Response orchestrator was not called");
    return call[0];
  };

  const getNthResponseContext = (index: number): ResponsePolicyContext => {
    const call = mockedResponseOrchestrator.mock.calls[index];
    if (!call) {
      throw new Error(`Response orchestrator was not called at index ${index}`);
    }
    return call[0];
  };

  const assertDocumentContext: (
    ctx: ResponsePolicyContext,
  ) => asserts ctx is Extract<
    ResponsePolicyContext,
    { responseKind: "document" }
  > = (ctx) => {
    if (ctx.responseKind !== "document") {
      throw new Error("Expected document response context");
    }
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const seed = await createTestAppSeed();
    appState = new AppState(seed);
  });

  describe("direct response outcome", () => {
    it("returns direct response unchanged", async () => {
      const directResponse = new Response(null, {
        status: 308,
        headers: {
          location: "/new-location",
          "x-runtime-policy": "redirect",
        },
      });

      mockedRequestOrchestrator.mockReturnValue({
        type: "direct-response",
        response: directResponse,
      } satisfies RequestPolicyOutcome);

      const response = await handleRequest(
        createRequest("/old"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe("/new-location");
      expect(response.headers.get("x-runtime-policy")).toBe("redirect");

      const ctx = getFirstResponseContext();
      expect(ctx.responseKind).toBe("direct");
    });
  });

  describe("render page outcome", () => {
    it("renders HTML document response", async () => {
      const homePage = appState.getPageBySlug("/")!;

      mockedRequestOrchestrator.mockReturnValue({
        type: "render-page",
        page: homePage,
        status: 200,
      } satisfies RequestPolicyOutcome);

      const response = await handleRequest(
        createRequest("/"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("x-render-mode")).toBe("document");
      expect(response.headers.get("content-type")).toBe(
        "text/html; charset=utf-8",
      );

      const body = await getTextBody(response);
      expect(body).toContain("<!doctype html>");
      expect(body).toContain("<html");
      expect(body).toContain("<body");

      const ctx = getFirstResponseContext();
      assertDocumentContext(ctx);

      expect(ctx.documentRender).toBeDefined();
      expect(ctx.documentRender.security.nonce).toBeDefined();
      expect(ctx.responseFormat).toBe("html");
    });

    it("generates a new nonce per request", async () => {
      const homePage = appState.getPageBySlug("/")!;

      mockedRequestOrchestrator.mockReturnValue({
        type: "render-page",
        page: homePage,
        status: 200,
      } satisfies RequestPolicyOutcome);

      await handleRequest(
        createRequest("/"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      await handleRequest(
        createRequest("/"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      const ctx1 = getNthResponseContext(0);
      const ctx2 = getNthResponseContext(1);

      assertDocumentContext(ctx1);
      assertDocumentContext(ctx2);

      expect(ctx1.documentRender.security.nonce).toBeDefined();
      expect(ctx2.documentRender.security.nonce).toBeDefined();
      expect(ctx1.documentRender.security.nonce).not.toBe(
        ctx2.documentRender.security.nonce,
      );
    });
  });

  describe("render error outcome", () => {
    it("renders 404 correctly", async () => {
      mockedRequestOrchestrator.mockReturnValue({
        type: "render-error",
        intent: { kind: "not-found" },
      } satisfies RequestPolicyOutcome);

      const response = await handleRequest(
        createRequest("/missing"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(response.status).toBe(404);

      const ctx = getFirstResponseContext();
      assertDocumentContext(ctx);
    });

    it("renders 410 with runtime header", async () => {
      mockedRequestOrchestrator.mockReturnValue({
        type: "render-error",
        intent: { kind: "gone" },
      } satisfies RequestPolicyOutcome);

      const response = await handleRequest(
        createRequest("/gone"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(response.status).toBe(410);
      expect(response.headers.get("x-runtime-policy")).toBe("gone");
    });
  });

  describe("unexpected failure flow", () => {
    it("renders 500 when request orchestration throws", async () => {
      mockedRequestOrchestrator.mockImplementation(() => {
        throw new Error("Boom");
      });

      const response = await handleRequest(
        createRequest("/"),
        {} as Env,
        {} as ExecutionContext,
        appState,
      );

      expect(response.status).toBe(500);

      const ctx = getFirstResponseContext();
      assertDocumentContext(ctx);
    });
  });
});
