// src/request/pre-request/assets/assets.pre-request.request.test.ts

import { orchestrateAssetsPreRequest } from "@request/pre-request/assets/assets.pre-request.request";
import { staticAssetOrchestrator } from "@request/pre-request/assets/static/static.assets.pre-request.request";
import { photoAssetOrchestrator } from "@request/pre-request/assets/photo/photo.assets.pre-request.request";

jest.mock(
  "@request/pre-request/assets/static/static.assets.pre-request.request",
  () => ({
    staticAssetOrchestrator: jest.fn(),
  }),
);

jest.mock(
  "@request/pre-request/assets/photo/photo.assets.pre-request.request",
  () => ({
    photoAssetOrchestrator: jest.fn(),
  }),
);

const createRequest = (): Request => new Request("https://example.com/");
const createEnv = (): Env => ({}) as Env;
const createCtx = (): ExecutionContext => ({}) as ExecutionContext;

describe("orchestrateAssetsPreRequest", () => {
  const mockedStaticAssetOrchestrator = jest.mocked(staticAssetOrchestrator);
  const mockedPhotoAssetOrchestrator = jest.mocked(photoAssetOrchestrator);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns static asset response first", async () => {
    const req = createRequest();
    const env = createEnv();
    const ctx = createCtx();
    const response = new Response("static");

    mockedStaticAssetOrchestrator.mockResolvedValue(response);

    await expect(orchestrateAssetsPreRequest(req, env, ctx)).resolves.toBe(
      response,
    );

    expect(mockedStaticAssetOrchestrator).toHaveBeenCalledWith(req, env, ctx);
    expect(mockedPhotoAssetOrchestrator).not.toHaveBeenCalled();
  });

  it("returns photo asset response when static asset does not match", async () => {
    const req = createRequest();
    const env = createEnv();
    const ctx = createCtx();
    const response = new Response("photo");

    mockedStaticAssetOrchestrator.mockResolvedValue(null);
    mockedPhotoAssetOrchestrator.mockResolvedValue(response);

    await expect(orchestrateAssetsPreRequest(req, env, ctx)).resolves.toBe(
      response,
    );

    expect(mockedStaticAssetOrchestrator).toHaveBeenCalledWith(req, env, ctx);
    expect(mockedPhotoAssetOrchestrator).toHaveBeenCalledWith(req, env, ctx);
  });

  it("returns null when no asset handlers match", async () => {
    const req = createRequest();
    const env = createEnv();
    const ctx = createCtx();

    mockedStaticAssetOrchestrator.mockResolvedValue(null);
    mockedPhotoAssetOrchestrator.mockResolvedValue(null);

    await expect(
      orchestrateAssetsPreRequest(req, env, ctx),
    ).resolves.toBeNull();

    expect(mockedStaticAssetOrchestrator).toHaveBeenCalledWith(req, env, ctx);
    expect(mockedPhotoAssetOrchestrator).toHaveBeenCalledWith(req, env, ctx);
  });
});
