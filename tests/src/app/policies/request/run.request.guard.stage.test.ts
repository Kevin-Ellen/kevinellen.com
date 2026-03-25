// tests/src/app/policies/request/run.request.guard.stage.test.ts

import { runRequestGuardStage } from "@app/policies/request/run.request.guard.stage";
import { evaluateMethodRequestGuard } from "@app/policies/request/guards/evaluate.method.request.guard";

import type { RequestPolicyOutcome } from "@app/policies/request/request.policies.types";

jest.mock("@app/policies/request/guards/evaluate.method.request.guard");

const mockEvaluateMethodRequestGuard =
  evaluateMethodRequestGuard as jest.MockedFunction<
    typeof evaluateMethodRequestGuard
  >;

describe("runRequestGuardStage", () => {
  const createRequest = (method = "GET"): Request =>
    new Request("https://example.com/test", { method });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns continue when method guard allows", () => {
    const request = createRequest();

    mockEvaluateMethodRequestGuard.mockReturnValue({ kind: "continue" });

    const outcome = runRequestGuardStage(request);

    expect(outcome).toEqual({ kind: "continue" });
    expect(mockEvaluateMethodRequestGuard).toHaveBeenCalledTimes(1);
    expect(mockEvaluateMethodRequestGuard).toHaveBeenCalledWith(request);
  });

  it("returns guard outcome when method guard blocks", () => {
    const request = createRequest("POST");

    const blockedOutcome: RequestPolicyOutcome = {
      kind: "direct-response",
      response: new Response(null, { status: 405 }),
    };

    mockEvaluateMethodRequestGuard.mockReturnValue(blockedOutcome);

    const outcome = runRequestGuardStage(request);

    expect(outcome).toBe(blockedOutcome);
    expect(mockEvaluateMethodRequestGuard).toHaveBeenCalledTimes(1);
    expect(mockEvaluateMethodRequestGuard).toHaveBeenCalledWith(request);
  });
});
