// tests/src/request/pre-request/guard/guard.pre-request.request.test.ts

import { evaluateMethodGuardPreRequest } from "@request/pre-request/guard/method/method.guard.pre-request.request";
import { orchestrateGuardPreRequest } from "@request/pre-request/guard/guard.pre-request.request";

jest.mock(
  "@request/pre-request/guard/method/method.guard.pre-request.request",
  () => ({
    evaluateMethodGuardPreRequest: jest.fn(),
  }),
);

const mockedEvaluateMethodGuardPreRequest = jest.mocked(
  evaluateMethodGuardPreRequest,
);

describe("orchestrateGuardPreRequest", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the method guard response when present", () => {
    const req = new Request("https://kevinellen.com/");
    const response = new Response("method");

    mockedEvaluateMethodGuardPreRequest.mockReturnValue(response);

    const result = orchestrateGuardPreRequest(req);

    expect(mockedEvaluateMethodGuardPreRequest).toHaveBeenCalledTimes(1);
    expect(mockedEvaluateMethodGuardPreRequest).toHaveBeenCalledWith(req);

    expect(result).toBe(response);
  });

  it("returns null when the method guard does not apply", () => {
    const req = new Request("https://kevinellen.com/");

    mockedEvaluateMethodGuardPreRequest.mockReturnValue(null);

    const result = orchestrateGuardPreRequest(req);

    expect(mockedEvaluateMethodGuardPreRequest).toHaveBeenCalledTimes(1);
    expect(mockedEvaluateMethodGuardPreRequest).toHaveBeenCalledWith(req);

    expect(result).toBeNull();
  });
});
