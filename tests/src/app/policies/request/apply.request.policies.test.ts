// tests/src/app/policies/request/apply.request.policies.test.ts

// tests/src/app/policies/request/apply.request.policies.test.ts

import type { AppState } from "@app/appState/appState";
import type { RequestPolicyOutcome } from "@app/policies/request/request.policies.types";

import { applyRequestPolicies } from "@app/policies/request/apply.request.policies";
import { applyMethodPolicy } from "@app/policies/request/method/apply.method";
import { applyCanonicalPolicy } from "@app/policies/request/canonical/apply.canonical";

jest.mock("@app/policies/request/method/apply.method", () => ({
  applyMethodPolicy: jest.fn(),
}));

jest.mock("@app/policies/request/canonical/apply.canonical", () => ({
  applyCanonicalPolicy: jest.fn(),
}));

describe("applyRequestPolicies", () => {
  const mockedApplyMethodPolicy = jest.mocked(applyMethodPolicy);
  const mockedApplyCanonicalPolicy = jest.mocked(applyCanonicalPolicy);

  const createRequest = (): Request =>
    new Request("https://kevinellen.com/example");

  const createEnv = (): Env =>
    ({
      APP_ENV: "dev",
    }) as Env;

  const createExecutionContext = (): ExecutionContext =>
    ({}) as ExecutionContext;

  const createAppState = (): AppState => ({}) as unknown as AppState;

  const createContinueOutcome = (): RequestPolicyOutcome => ({
    type: "continue",
  });

  const createDirectResponseOutcome = (
    response: Response,
  ): RequestPolicyOutcome => ({
    type: "direct-response",
    response,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("orchestration behaviour", () => {
    it("returns the exact method outcome when method policy short-circuits", () => {
      const req = createRequest();
      const env = createEnv();
      const ctx = createExecutionContext();
      const appState = createAppState();

      const methodResponse = new Response(null, { status: 405 });
      const methodOutcome = createDirectResponseOutcome(methodResponse);

      mockedApplyMethodPolicy.mockReturnValue(methodOutcome);

      const result = applyRequestPolicies(req, env, ctx, appState);

      expect(mockedApplyMethodPolicy).toHaveBeenCalledTimes(1);
      expect(mockedApplyMethodPolicy).toHaveBeenCalledWith(req);

      expect(mockedApplyCanonicalPolicy).not.toHaveBeenCalled();

      expect(result).toBe(methodOutcome);
    });

    it("returns the exact canonical outcome when method continues and canonical short-circuits", () => {
      const req = createRequest();
      const env = createEnv();
      const ctx = createExecutionContext();
      const appState = createAppState();

      const canonicalResponse = new Response(null, { status: 308 });
      const canonicalOutcome = createDirectResponseOutcome(canonicalResponse);

      mockedApplyMethodPolicy.mockReturnValue(createContinueOutcome());
      mockedApplyCanonicalPolicy.mockReturnValue(canonicalOutcome);

      const result = applyRequestPolicies(req, env, ctx, appState);

      expect(mockedApplyMethodPolicy).toHaveBeenCalledTimes(1);
      expect(mockedApplyMethodPolicy).toHaveBeenCalledWith(req);

      expect(mockedApplyCanonicalPolicy).toHaveBeenCalledTimes(1);
      expect(mockedApplyCanonicalPolicy).toHaveBeenCalledWith(req, env);

      expect(result).toBe(canonicalOutcome);
    });

    it("returns continue when all request policies continue", () => {
      const req = createRequest();
      const env = createEnv();
      const ctx = createExecutionContext();
      const appState = createAppState();

      mockedApplyMethodPolicy.mockReturnValue(createContinueOutcome());
      mockedApplyCanonicalPolicy.mockReturnValue(createContinueOutcome());

      const result = applyRequestPolicies(req, env, ctx, appState);

      expect(mockedApplyMethodPolicy).toHaveBeenCalledTimes(1);
      expect(mockedApplyMethodPolicy).toHaveBeenCalledWith(req);

      expect(mockedApplyCanonicalPolicy).toHaveBeenCalledTimes(1);
      expect(mockedApplyCanonicalPolicy).toHaveBeenCalledWith(req, env);

      expect(result).toEqual({ type: "continue" });
    });
  });

  describe("ordering guarantees", () => {
    it("runs method before canonical", () => {
      const req = createRequest();
      const env = createEnv();
      const ctx = createExecutionContext();
      const appState = createAppState();

      const order: string[] = [];

      mockedApplyMethodPolicy.mockImplementation(() => {
        order.push("method");
        return createContinueOutcome();
      });

      mockedApplyCanonicalPolicy.mockImplementation(() => {
        order.push("canonical");
        return createContinueOutcome();
      });

      applyRequestPolicies(req, env, ctx, appState);

      expect(order).toEqual(["method", "canonical"]);
    });

    it("does not run canonical when method short-circuits", () => {
      const req = createRequest();
      const env = createEnv();
      const ctx = createExecutionContext();
      const appState = createAppState();

      mockedApplyMethodPolicy.mockReturnValue(
        createDirectResponseOutcome(new Response(null, { status: 405 })),
      );

      applyRequestPolicies(req, env, ctx, appState);

      expect(mockedApplyCanonicalPolicy).not.toHaveBeenCalled();
    });
  });
});
