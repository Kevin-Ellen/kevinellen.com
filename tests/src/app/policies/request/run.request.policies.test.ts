// tests/src/app/policies/request/run.request.policies.test.ts

import { runRequestPolicies } from "@app/policies/request/run.request.policies";
import { runRequestGuardStage } from "@app/policies/request/run.request.guard.stage";
import { runRequestResolutionStage } from "@app/policies/request/run.request.resolution.stage";
import { runRequestSystemStage } from "@app/policies/request/run.request.system.stage";

import { createAppState } from "@app/appState/create.appState";

import type { RequestPolicyOutcome } from "@app/policies/request/request.policies.types";

jest.mock("@app/policies/request/run.request.guard.stage");
jest.mock("@app/policies/request/run.request.resolution.stage");
jest.mock("@app/policies/request/run.request.system.stage");

const mockRunRequestGuardStage = runRequestGuardStage as jest.MockedFunction<
  typeof runRequestGuardStage
>;

const mockRunRequestResolutionStage =
  runRequestResolutionStage as jest.MockedFunction<
    typeof runRequestResolutionStage
  >;

const mockRunRequestSystemStage = runRequestSystemStage as jest.MockedFunction<
  typeof runRequestSystemStage
>;

describe("runRequestPolicies", () => {
  const createRequest = (method = "GET"): Request =>
    new Request("https://example.com/test", { method });

  const env = {
    APP_ENV: "prod",
    APP_HOST: "kevinellen.com",
  } as Env;

  const appState = createAppState();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns continue when guard, resolution and system stages all return continue", () => {
    const request = createRequest();

    mockRunRequestGuardStage.mockReturnValue({ kind: "continue" });
    mockRunRequestResolutionStage.mockReturnValue({ kind: "continue" });
    mockRunRequestSystemStage.mockReturnValue({ kind: "continue" });

    const outcome = runRequestPolicies(request, env, appState);

    expect(outcome).toEqual({ kind: "continue" });
    expect(mockRunRequestGuardStage).toHaveBeenCalledTimes(1);
    expect(mockRunRequestGuardStage).toHaveBeenCalledWith(request);
    expect(mockRunRequestResolutionStage).toHaveBeenCalledTimes(1);
    expect(mockRunRequestResolutionStage).toHaveBeenCalledWith(
      request,
      env,
      appState,
    );
    expect(mockRunRequestSystemStage).toHaveBeenCalledTimes(1);
    expect(mockRunRequestSystemStage).toHaveBeenCalledWith(
      request,
      env,
      appState,
    );
  });

  it("returns guard outcome when guard stage blocks", () => {
    const request = createRequest("POST");

    const blockedOutcome: RequestPolicyOutcome = {
      kind: "direct-response",
      response: new Response(null, { status: 405 }),
    };

    mockRunRequestGuardStage.mockReturnValue(blockedOutcome);

    const outcome = runRequestPolicies(request, env, appState);

    expect(outcome).toBe(blockedOutcome);
    expect(mockRunRequestGuardStage).toHaveBeenCalledTimes(1);
    expect(mockRunRequestGuardStage).toHaveBeenCalledWith(request);
    expect(mockRunRequestResolutionStage).not.toHaveBeenCalled();
    expect(mockRunRequestSystemStage).not.toHaveBeenCalled();
  });

  it("returns resolution outcome when guard stage continues and resolution stage blocks", () => {
    const request = createRequest();

    const resolutionOutcome: RequestPolicyOutcome = {
      kind: "render-error",
      intent: "gone",
    };

    mockRunRequestGuardStage.mockReturnValue({ kind: "continue" });
    mockRunRequestResolutionStage.mockReturnValue(resolutionOutcome);

    const outcome = runRequestPolicies(request, env, appState);

    expect(outcome).toBe(resolutionOutcome);
    expect(mockRunRequestGuardStage).toHaveBeenCalledTimes(1);
    expect(mockRunRequestGuardStage).toHaveBeenCalledWith(request);
    expect(mockRunRequestResolutionStage).toHaveBeenCalledTimes(1);
    expect(mockRunRequestResolutionStage).toHaveBeenCalledWith(
      request,
      env,
      appState,
    );
    expect(mockRunRequestSystemStage).not.toHaveBeenCalled();
  });

  it("returns system outcome when guard and resolution continue and system stage blocks", () => {
    const request = createRequest();

    const systemOutcome: RequestPolicyOutcome = {
      kind: "direct-response",
      response: new Response("robots", { status: 200 }),
    };

    mockRunRequestGuardStage.mockReturnValue({ kind: "continue" });
    mockRunRequestResolutionStage.mockReturnValue({ kind: "continue" });
    mockRunRequestSystemStage.mockReturnValue(systemOutcome);

    const outcome = runRequestPolicies(request, env, appState);

    expect(outcome).toBe(systemOutcome);
    expect(mockRunRequestGuardStage).toHaveBeenCalledTimes(1);
    expect(mockRunRequestGuardStage).toHaveBeenCalledWith(request);
    expect(mockRunRequestResolutionStage).toHaveBeenCalledTimes(1);
    expect(mockRunRequestResolutionStage).toHaveBeenCalledWith(
      request,
      env,
      appState,
    );
    expect(mockRunRequestSystemStage).toHaveBeenCalledTimes(1);
    expect(mockRunRequestSystemStage).toHaveBeenCalledWith(
      request,
      env,
      appState,
    );
  });
});
