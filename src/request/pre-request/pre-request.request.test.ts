// src/request/pre-request/pre-request.request.test.ts

import { preRequestOrchestrator } from "@request/pre-request/pre-request.request";
import { orchestrateGuardPreRequest } from "@request/pre-request/guard/guard.pre-request.request";
import { orchestrateAssetsPreRequest } from "@request/pre-request/assets/assets.pre-request.request";

jest.mock("@request/pre-request/guard/guard.pre-request.request", () => ({
  orchestrateGuardPreRequest: jest.fn(),
}));

jest.mock("@request/pre-request/assets/assets.pre-request.request", () => ({
  orchestrateAssetsPreRequest: jest.fn(),
}));

const createRequest = (): Request => new Request("https://example.com/");
const createEnv = (): Env => ({}) as Env;
const createCtx = (): ExecutionContext => ({}) as ExecutionContext;

describe("preRequestOrchestrator", () => {
  const mockedOrchestrateGuardPreRequest = jest.mocked(
    orchestrateGuardPreRequest,
  );
  const mockedOrchestrateAssetsPreRequest = jest.mocked(
    orchestrateAssetsPreRequest,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns guard result first", async () => {
    const req = createRequest();
    const env = createEnv();
    const ctx = createCtx();
    const response = new Response(null, { status: 405 });

    mockedOrchestrateGuardPreRequest.mockReturnValue(response);

    await expect(preRequestOrchestrator(req, env, ctx)).resolves.toBe(response);

    expect(mockedOrchestrateGuardPreRequest).toHaveBeenCalledWith(req);
    expect(mockedOrchestrateAssetsPreRequest).not.toHaveBeenCalled();
  });

  it("returns assets result when guard allows request", async () => {
    const req = createRequest();
    const env = createEnv();
    const ctx = createCtx();
    const response = new Response("asset");

    mockedOrchestrateGuardPreRequest.mockReturnValue(null);
    mockedOrchestrateAssetsPreRequest.mockResolvedValue(response);

    await expect(preRequestOrchestrator(req, env, ctx)).resolves.toBe(response);

    expect(mockedOrchestrateAssetsPreRequest).toHaveBeenCalledWith(
      req,
      env,
      ctx,
    );
  });

  it("returns null when guard and assets do not return a response", async () => {
    mockedOrchestrateGuardPreRequest.mockReturnValue(null);
    mockedOrchestrateAssetsPreRequest.mockResolvedValue(null);

    await expect(
      preRequestOrchestrator(createRequest(), createEnv(), createCtx()),
    ).resolves.toBeNull();
  });
});
