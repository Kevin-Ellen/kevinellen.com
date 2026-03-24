// tests/src/app/request/request.handler.test.ts

import type { AppState } from "@app/appState/appState";
import type { RequestResolutionOutcome } from "@app/request/resolution/apply.resolution.types";
import type { RequestPolicyOutcome } from "@app/policies/request/request.policies.types";

import { handleRequest } from "@app/request/request.handler";
import { applyRequestResolution } from "@app/request/resolution/apply.request.resolution";
import { applyRequestPolicies } from "@app/policies/request/apply.request.policies";
import { applyResponsePolicies } from "@app/policies/response/apply.response.policies";

jest.mock("@app/request/resolution/apply.request.resolution", () => ({
  applyRequestResolution: jest.fn(),
}));

jest.mock("@app/policies/request/apply.request.policies", () => ({
  applyRequestPolicies: jest.fn(),
}));

jest.mock("@app/policies/response/apply.response.policies", () => ({
  applyResponsePolicies: jest.fn(),
}));

const createContinueResolutionOutcome = (): RequestResolutionOutcome => ({
  type: "continue",
});

const createDirectResolutionOutcome = (
  response: Response,
  responseFormat: "text" | "json" | "xml" | "binary" = "text",
): RequestResolutionOutcome => ({
  type: "direct-response",
  response,
  responseFormat,
});

const createGoneRenderErrorResolutionOutcome =
  (): RequestResolutionOutcome => ({
    type: "render-error",
    intent: {
      kind: "gone",
    },
  });

const createFailureRenderErrorResolutionOutcome =
  (): RequestResolutionOutcome => ({
    type: "render-error",
    intent: {
      kind: "internal-error",
    },
  });

const createContinueRequestPolicyOutcome = (): RequestPolicyOutcome => ({
  type: "continue",
});

const createDirectRequestPolicyOutcome = (
  response: Response,
): RequestPolicyOutcome => ({
  type: "direct-response",
  response,
});

describe("handleRequest", () => {
  const mockedApplyRequestResolution = jest.mocked(applyRequestResolution);
  const mockedApplyRequestPolicies = jest.mocked(applyRequestPolicies);
  const mockedApplyResponsePolicies = jest.mocked(applyResponsePolicies);

  const createRequest = (): Request => new Request("https://kevinellen.com/");

  const createEnv = (): Env =>
    ({
      APP_ENV: "dev",
    }) as Env;

  const createExecutionContext = (): ExecutionContext =>
    ({}) as ExecutionContext;

  const createAppState = (): AppState =>
    ({
      toJSON: jest.fn(() => ({
        site: "test-site",
      })),
    }) as unknown as AppState;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("request resolution stage", () => {
    it("returns a response-policy-decorated direct response from request resolution", async () => {
      const req = createRequest();
      const env = createEnv();
      const ctx = createExecutionContext();
      const appState = createAppState();

      const resolutionResponse = new Response("redirect", { status: 301 });
      const finalResponse = new Response("decorated redirect", { status: 301 });

      mockedApplyRequestResolution.mockResolvedValue(
        createDirectResolutionOutcome(resolutionResponse, "text"),
      );
      mockedApplyResponsePolicies.mockReturnValue(finalResponse);

      const result = await handleRequest(req, env, ctx, appState);

      expect(mockedApplyRequestResolution).toHaveBeenCalledTimes(1);
      expect(mockedApplyRequestResolution).toHaveBeenCalledWith(
        req,
        env,
        ctx,
        appState,
      );

      expect(mockedApplyRequestPolicies).not.toHaveBeenCalled();
      expect(appState.toJSON).not.toHaveBeenCalled();

      expect(mockedApplyResponsePolicies).toHaveBeenCalledTimes(1);
      expect(mockedApplyResponsePolicies).toHaveBeenCalledWith(
        expect.objectContaining({
          response: resolutionResponse,
          appContext: expect.anything(),
        }),
      );

      expect(result).toBe(finalResponse);
    });

    it("returns a 410 render-error response when resolution returns gone", async () => {
      const req = createRequest();
      const env = createEnv();
      const ctx = createExecutionContext();
      const appState = createAppState();

      mockedApplyRequestResolution.mockResolvedValue(
        createGoneRenderErrorResolutionOutcome(),
      );
      mockedApplyResponsePolicies.mockImplementation(
        ({ response }) => response,
      );

      const result = await handleRequest(req, env, ctx, appState);

      expect(mockedApplyRequestResolution).toHaveBeenCalledTimes(1);
      expect(mockedApplyRequestPolicies).not.toHaveBeenCalled();
      expect(mockedApplyResponsePolicies).toHaveBeenCalledTimes(1);
      expect(appState.toJSON).not.toHaveBeenCalled();

      expect(result.status).toBe(410);
      await expect(result.json()).resolves.toEqual({
        type: "render-error",
        intent: {
          kind: "gone",
        },
      });
    });

    it("returns a 500 render-error response when resolution returns internal-error", async () => {
      const req = createRequest();
      const env = createEnv();
      const ctx = createExecutionContext();
      const appState = createAppState();

      mockedApplyRequestResolution.mockResolvedValue(
        createFailureRenderErrorResolutionOutcome(),
      );
      mockedApplyResponsePolicies.mockImplementation(
        ({ response }) => response,
      );

      const result = await handleRequest(req, env, ctx, appState);

      expect(mockedApplyRequestResolution).toHaveBeenCalledTimes(1);
      expect(mockedApplyRequestPolicies).not.toHaveBeenCalled();
      expect(mockedApplyResponsePolicies).toHaveBeenCalledTimes(1);
      expect(appState.toJSON).not.toHaveBeenCalled();

      expect(result.status).toBe(500);
      await expect(result.json()).resolves.toEqual({
        type: "render-error",
        intent: {
          kind: "internal-error",
        },
      });
    });
  });

  describe("request policy stage", () => {
    it("continues from request resolution into request policies", async () => {
      const req = createRequest();
      const env = createEnv();
      const ctx = createExecutionContext();
      const appState = createAppState();

      const directResponse = new Response("method not allowed", {
        status: 405,
      });

      mockedApplyRequestResolution.mockResolvedValue(
        createContinueResolutionOutcome(),
      );
      mockedApplyRequestPolicies.mockReturnValue(
        createDirectRequestPolicyOutcome(directResponse),
      );
      mockedApplyResponsePolicies.mockImplementation(
        ({ response }) => response,
      );

      const result = await handleRequest(req, env, ctx, appState);

      expect(mockedApplyRequestResolution).toHaveBeenCalledTimes(1);
      expect(mockedApplyRequestPolicies).toHaveBeenCalledTimes(1);
      expect(mockedApplyRequestPolicies).toHaveBeenCalledWith(
        req,
        env,
        ctx,
        appState,
      );

      expect(appState.toJSON).not.toHaveBeenCalled();
      expect(mockedApplyResponsePolicies).toHaveBeenCalledTimes(1);

      expect(result.status).toBe(405);
      await expect(result.text()).resolves.toBe("method not allowed");
    });

    it("returns a response-policy-decorated direct response from request policies", async () => {
      const req = createRequest();
      const env = createEnv();
      const ctx = createExecutionContext();
      const appState = createAppState();

      const policyResponse = new Response("canonical redirect", {
        status: 308,
      });
      const finalResponse = new Response("decorated canonical redirect", {
        status: 308,
      });

      mockedApplyRequestResolution.mockResolvedValue(
        createContinueResolutionOutcome(),
      );
      mockedApplyRequestPolicies.mockReturnValue(
        createDirectRequestPolicyOutcome(policyResponse),
      );
      mockedApplyResponsePolicies.mockReturnValue(finalResponse);

      const result = await handleRequest(req, env, ctx, appState);

      expect(mockedApplyRequestResolution).toHaveBeenCalledTimes(1);
      expect(mockedApplyRequestPolicies).toHaveBeenCalledTimes(1);
      expect(appState.toJSON).not.toHaveBeenCalled();

      expect(mockedApplyResponsePolicies).toHaveBeenCalledTimes(1);
      expect(mockedApplyResponsePolicies).toHaveBeenCalledWith(
        expect.objectContaining({
          response: policyResponse,
          appContext: expect.anything(),
        }),
      );

      expect(result).toBe(finalResponse);
    });
  });

  describe("continue path", () => {
    it("returns a 200 JSON document response from appState when all stages continue", async () => {
      const req = createRequest();
      const env = createEnv();
      const ctx = createExecutionContext();
      const appState = createAppState();

      mockedApplyRequestResolution.mockResolvedValue(
        createContinueResolutionOutcome(),
      );
      mockedApplyRequestPolicies.mockReturnValue(
        createContinueRequestPolicyOutcome(),
      );
      mockedApplyResponsePolicies.mockImplementation(
        ({ response }) => response,
      );

      const result = await handleRequest(req, env, ctx, appState);

      expect(mockedApplyRequestResolution).toHaveBeenCalledTimes(1);
      expect(mockedApplyRequestPolicies).toHaveBeenCalledTimes(1);
      expect(appState.toJSON).toHaveBeenCalledTimes(1);
      expect(mockedApplyResponsePolicies).toHaveBeenCalledTimes(1);

      expect(result.status).toBe(200);
      await expect(result.json()).resolves.toEqual({
        site: "test-site",
      });
    });
  });

  describe("orchestration", () => {
    it("runs stages in deterministic order", async () => {
      const req = createRequest();
      const env = createEnv();
      const ctx = createExecutionContext();
      const appState = createAppState();

      const order: string[] = [];

      mockedApplyRequestResolution.mockImplementation(async () => {
        order.push("request-resolution");
        return createContinueResolutionOutcome();
      });

      mockedApplyRequestPolicies.mockImplementation(() => {
        order.push("request-policies");
        return createContinueRequestPolicyOutcome();
      });

      mockedApplyResponsePolicies.mockImplementation(({ response }) => {
        order.push("response-policies");
        return response;
      });

      await handleRequest(req, env, ctx, appState);

      expect(order).toEqual([
        "request-resolution",
        "request-policies",
        "response-policies",
      ]);
    });
  });
});
