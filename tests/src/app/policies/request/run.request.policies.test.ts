// tests/src/app/policies/request/run.request.policies.test.ts

import { runRequestPolicies } from "@app/policies/request/run.request.policies";
import { runRequestGuardStage } from "@app/policies/request/run.request.guard.stage";

import type { RequestPolicyOutcome } from "@app/policies/request/request.policies.types";

jest.mock("@app/policies/request/run.request.guard.stage");

const mockRunRequestGuardStage = runRequestGuardStage as jest.MockedFunction<
  typeof runRequestGuardStage
>;

describe("runRequestPolicies", () => {
  const createRequest = (method = "GET"): Request =>
    new Request("https://example.com/test", { method });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns continue when guard stage returns continue", () => {
    const request = createRequest();

    mockRunRequestGuardStage.mockReturnValue({ kind: "continue" });

    const outcome = runRequestPolicies(request);

    expect(outcome).toEqual({ kind: "continue" });
    expect(mockRunRequestGuardStage).toHaveBeenCalledTimes(1);
    expect(mockRunRequestGuardStage).toHaveBeenCalledWith(request);
  });

  it("returns guard outcome when guard stage blocks", () => {
    const request = createRequest("POST");

    const blockedOutcome: RequestPolicyOutcome = {
      kind: "direct-response",
      response: new Response(null, { status: 405 }),
    };

    mockRunRequestGuardStage.mockReturnValue(blockedOutcome);

    const outcome = runRequestPolicies(request);

    expect(outcome).toBe(blockedOutcome);
    expect(mockRunRequestGuardStage).toHaveBeenCalledTimes(1);
    expect(mockRunRequestGuardStage).toHaveBeenCalledWith(request);
  });
});
