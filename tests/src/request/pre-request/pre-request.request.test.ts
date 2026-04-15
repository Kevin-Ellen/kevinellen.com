// tests/src/request/pre-request/pre-request.request.test.ts

import { orchestrateAssetsPreRequest } from "@request/pre-request/assets/assets.pre-request.request";
import { orchestrateGuardPreRequest } from "@request/pre-request/guard/guard.pre-request.request";
import { preRequestOrchestrator } from "@request/pre-request/pre-request.request";

jest.mock("@request/pre-request/assets/assets.pre-request.request", () => ({
  orchestrateAssetsPreRequest: jest.fn(),
}));

jest.mock("@request/pre-request/guard/guard.pre-request.request", () => ({
  orchestrateGuardPreRequest: jest.fn(),
}));

const mockedOrchestrateAssetsPreRequest = jest.mocked(
  orchestrateAssetsPreRequest,
);
const mockedOrchestrateGuardPreRequest = jest.mocked(
  orchestrateGuardPreRequest,
);

describe("preRequestOrchestrator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the guard response and does not continue to assets", async () => {
    const req = new Request("https://kevinellen.com/favicon.ico");
    const env = {} as Env;
    const ctx = {} as ExecutionContext;
    const guardResponse = new Response("guard");

    mockedOrchestrateGuardPreRequest.mockReturnValue(guardResponse);

    const result = await preRequestOrchestrator(req, env, ctx);

    expect(mockedOrchestrateGuardPreRequest).toHaveBeenCalledTimes(1);
    expect(mockedOrchestrateGuardPreRequest).toHaveBeenCalledWith(req);

    expect(mockedOrchestrateAssetsPreRequest).not.toHaveBeenCalled();

    expect(result).toBe(guardResponse);
  });

  it("falls through to assets when guard returns null", async () => {
    const req = new Request("https://kevinellen.com/photo/example/content");
    const env = {} as Env;
    const ctx = {} as ExecutionContext;
    const assetsResponse = new Response("assets");

    mockedOrchestrateGuardPreRequest.mockReturnValue(null);
    mockedOrchestrateAssetsPreRequest.mockResolvedValue(assetsResponse);

    const result = await preRequestOrchestrator(req, env, ctx);

    expect(mockedOrchestrateGuardPreRequest).toHaveBeenCalledTimes(1);
    expect(mockedOrchestrateGuardPreRequest).toHaveBeenCalledWith(req);

    expect(mockedOrchestrateAssetsPreRequest).toHaveBeenCalledTimes(1);
    expect(mockedOrchestrateAssetsPreRequest).toHaveBeenCalledWith(
      req,
      env,
      ctx,
    );

    expect(result).toBe(assetsResponse);
  });

  it("returns null when neither guard nor assets resolves the request", async () => {
    const req = new Request("https://kevinellen.com/");
    const env = {} as Env;
    const ctx = {} as ExecutionContext;

    mockedOrchestrateGuardPreRequest.mockReturnValue(null);
    mockedOrchestrateAssetsPreRequest.mockResolvedValue(null);

    const result = await preRequestOrchestrator(req, env, ctx);

    expect(mockedOrchestrateGuardPreRequest).toHaveBeenCalledTimes(1);
    expect(mockedOrchestrateGuardPreRequest).toHaveBeenCalledWith(req);

    expect(mockedOrchestrateAssetsPreRequest).toHaveBeenCalledTimes(1);
    expect(mockedOrchestrateAssetsPreRequest).toHaveBeenCalledWith(
      req,
      env,
      ctx,
    );

    expect(result).toBeNull();
  });
});
