// src/request/pre-request/guard/guard.pre-request.request.test.ts

import { orchestrateGuardPreRequest } from "@request/pre-request/guard/guard.pre-request.request";
import { evaluateMethodGuardPreRequest } from "@request/pre-request/guard/method/method.guard.pre-request.request";

jest.mock(
  "@request/pre-request/guard/method/method.guard.pre-request.request",
  () => ({
    evaluateMethodGuardPreRequest: jest.fn(),
  }),
);

describe("orchestrateGuardPreRequest", () => {
  const mockedEvaluateMethodGuardPreRequest = jest.mocked(
    evaluateMethodGuardPreRequest,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns method guard response when present", () => {
    const req = new Request("https://example.com/");
    const response = new Response(null, { status: 405 });

    mockedEvaluateMethodGuardPreRequest.mockReturnValue(response);

    expect(orchestrateGuardPreRequest(req)).toBe(response);
    expect(mockedEvaluateMethodGuardPreRequest).toHaveBeenCalledWith(req);
  });

  it("returns null when no guard blocks the request", () => {
    const req = new Request("https://example.com/");

    mockedEvaluateMethodGuardPreRequest.mockReturnValue(null);

    expect(orchestrateGuardPreRequest(req)).toBeNull();
  });
});
