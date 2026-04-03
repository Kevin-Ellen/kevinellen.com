// tests/src/app/policies/request/run.request.resolution.stage.test.ts

import { runRequestResolutionStage } from "@app/policies/request/run.request.resolution.stage";
import { getRuntimeBehaviour } from "@app/runtime/get.runtime.behaviour";

import { evaluateRedirectRequestResolution } from "@app/policies/request/resolution/evaluate.redirect.request.resolution";
import { evaluateCanonicalRequestResolution } from "@app/policies/request/resolution/evaluate.canonical.request.resolution";
import { evaluateGonePathRequestResolution } from "@app/policies/request/resolution/evaluate.gone.request.resolution";

import { createAppState } from "@app/appState/create.appState";

import type { RequestPolicyOutcome } from "@app/policies/request/request.policies.types";
import type { RuntimeBehaviour } from "@app/runtime/runtime.types";

jest.mock("@app/runtime/get.runtime.behaviour");
jest.mock(
  "@app/policies/request/resolution/evaluate.redirect.request.resolution",
);
jest.mock(
  "@app/policies/request/resolution/evaluate.canonical.request.resolution",
);
jest.mock("@app/policies/request/resolution/evaluate.gone.request.resolution");

const mockGetRuntimeBehaviour = getRuntimeBehaviour as jest.MockedFunction<
  typeof getRuntimeBehaviour
>;

const mockEvaluateRedirectRequestResolution =
  evaluateRedirectRequestResolution as jest.MockedFunction<
    typeof evaluateRedirectRequestResolution
  >;

const mockEvaluateCanonicalRequestResolution =
  evaluateCanonicalRequestResolution as jest.MockedFunction<
    typeof evaluateCanonicalRequestResolution
  >;

const mockEvaluateGonePathRequestResolution =
  evaluateGonePathRequestResolution as jest.MockedFunction<
    typeof evaluateGonePathRequestResolution
  >;

describe("runRequestResolutionStage", () => {
  const createRequest = (url = "https://example.com/test"): Request =>
    new Request(url);

  const env = {
    APP_ENV: "prod",
    APP_HOST: "kevinellen.com",
  } as Env;

  const appState = createAppState();

  const runtimeBehaviour: RuntimeBehaviour = {
    appEnv: "prod",
    canonical: true,
    indexing: true,
    public: true,
    canonicalHost: "kevinellen.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetRuntimeBehaviour.mockReturnValue(runtimeBehaviour);
  });

  it("returns direct-response when redirect evaluation returns direct-response", () => {
    const request = createRequest();

    const directOutcome: RequestPolicyOutcome = {
      kind: "direct-response",
      response: new Response(null, { status: 302 }),
    };

    mockEvaluateRedirectRequestResolution.mockReturnValue(directOutcome);

    const outcome = runRequestResolutionStage(request, env, appState);

    expect(outcome).toBe(directOutcome);
    expect(mockGetRuntimeBehaviour).toHaveBeenCalledWith(env);
    expect(mockEvaluateRedirectRequestResolution).toHaveBeenCalledWith(
      request,
      appState,
    );
    expect(mockEvaluateCanonicalRequestResolution).not.toHaveBeenCalled();
    expect(mockEvaluateGonePathRequestResolution).not.toHaveBeenCalled();
  });

  it("returns render-error when internal redirect target is gone", () => {
    const request = createRequest("https://example.com/old-page");

    mockEvaluateRedirectRequestResolution.mockReturnValue({
      kind: "redirect",
      location: "/gone-page",
      status: 301,
    });

    mockEvaluateCanonicalRequestResolution.mockReturnValue({
      url: new URL("https://kevinellen.com/gone-page"),
      changed: true,
    });

    const goneOutcome: RequestPolicyOutcome = {
      kind: "render-error",
      intent: "gone",
    };

    mockEvaluateGonePathRequestResolution.mockReturnValue(goneOutcome);

    const outcome = runRequestResolutionStage(request, env, appState);

    expect(outcome).toBe(goneOutcome);
    expect(mockEvaluateCanonicalRequestResolution).toHaveBeenCalledWith(
      new URL("/gone-page", request.url),
      runtimeBehaviour,
    );
    expect(mockEvaluateGonePathRequestResolution).toHaveBeenCalledWith(
      "/gone-page",
      appState,
    );
  });

  it("returns redirect when internal redirect target is canonicalised and not gone", () => {
    const request = createRequest("https://example.com/old-page");

    mockEvaluateRedirectRequestResolution.mockReturnValue({
      kind: "redirect",
      location: "/New-Page/",
      status: 301,
    });

    mockEvaluateCanonicalRequestResolution.mockReturnValue({
      url: new URL("https://kevinellen.com/new-page"),
      changed: true,
    });

    mockEvaluateGonePathRequestResolution.mockReturnValue({ kind: "continue" });

    const outcome = runRequestResolutionStage(request, env, appState);

    expect(outcome).toEqual({
      kind: "redirect",
      location: "https://kevinellen.com/new-page",
      status: 301,
    });
    expect(mockEvaluateGonePathRequestResolution).toHaveBeenCalledWith(
      "/new-page",
      appState,
    );
  });

  it("returns render-error when canonical request pathname is gone", () => {
    const request = createRequest("https://example.com/Gone-Page/");

    mockEvaluateRedirectRequestResolution.mockReturnValue({ kind: "continue" });

    mockEvaluateCanonicalRequestResolution.mockReturnValue({
      url: new URL("https://kevinellen.com/gone-page"),
      changed: true,
    });

    const goneOutcome: RequestPolicyOutcome = {
      kind: "render-error",
      intent: "gone",
    };

    mockEvaluateGonePathRequestResolution.mockReturnValue(goneOutcome);

    const outcome = runRequestResolutionStage(request, env, appState);

    expect(outcome).toBe(goneOutcome);
    expect(mockEvaluateGonePathRequestResolution).toHaveBeenCalledWith(
      "/gone-page",
      appState,
    );
  });

  it("returns canonical redirect when request canonicalises and is not gone", () => {
    const request = createRequest("https://example.com/About/");

    mockEvaluateRedirectRequestResolution.mockReturnValue({ kind: "continue" });

    mockEvaluateCanonicalRequestResolution.mockReturnValue({
      url: new URL("https://kevinellen.com/about"),
      changed: true,
    });

    mockEvaluateGonePathRequestResolution.mockReturnValue({ kind: "continue" });

    const outcome = runRequestResolutionStage(request, env, appState);

    expect(outcome).toEqual({
      kind: "redirect",
      location: "https://kevinellen.com/about",
      status: 308,
    });
  });

  it("returns continue when no redirect, no gone and no canonical change apply", () => {
    const request = createRequest("https://example.com/about");

    mockEvaluateRedirectRequestResolution.mockReturnValue({ kind: "continue" });

    mockEvaluateCanonicalRequestResolution.mockReturnValue({
      url: new URL("https://example.com/about"),
      changed: false,
    });

    mockEvaluateGonePathRequestResolution.mockReturnValue({ kind: "continue" });

    const outcome = runRequestResolutionStage(request, env, appState);

    expect(outcome).toEqual({ kind: "continue" });
  });
});
