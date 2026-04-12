// src/entry.test.ts

import { onRequest, default as entryModule } from "../../src/entry";
import { requestOrchestrator } from "@request/request";

jest.mock("@request/request", () => ({
  orchestrateRequest: jest.fn(),
}));

describe("entry", () => {
  const mockOrchestrateRequest = requestOrchestrator as jest.MockedFunction<
    typeof requestOrchestrator
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("passes req, env and ctx to orchestrateRequest", async () => {
    const req = new Request("https://kevinellen.com/");
    const env = {} as Env;
    const ctx = {} as ExecutionContext;
    const response = new Response("ok", { status: 200 });

    mockOrchestrateRequest.mockResolvedValue(response);

    const result = await onRequest(req, env, ctx);

    expect(mockOrchestrateRequest).toHaveBeenCalledTimes(1);
    expect(mockOrchestrateRequest).toHaveBeenCalledWith(req, env, ctx);
    expect(result).toBe(response);
  });

  it("exports fetch as onRequest", () => {
    expect(entryModule.fetch).toBe(onRequest);
  });
});
