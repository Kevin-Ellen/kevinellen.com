// tests/src/app/request/pre-request/pre-request.request.test.ts

import { staticAssetOrchestrator } from "@request/pre-request/static-assets/static.assets.pre-request.request";
import { photoAssetOrchestrator } from "@request/pre-request/photo-assets/photo.assets.pre-request.request";
import { preRequestOrchestrator } from "@request/pre-request/pre-request.request";

jest.mock(
  "@request/pre-request/static-assets/static.assets.pre-request.request",
  () => ({
    staticAssetOrchestrator: jest.fn(),
  }),
);

jest.mock(
  "@request/pre-request/photo-assets/photo.assets.pre-request.request",
  () => ({
    photoAssetOrchestrator: jest.fn(),
  }),
);

const mockedStaticAssetOrchestrator = jest.mocked(staticAssetOrchestrator);
const mockedPhotoAssetOrchestrator = jest.mocked(photoAssetOrchestrator);

describe("preRequestOrchestrator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the static asset response and does not continue to photo assets", async () => {
    const req = new Request("https://kevinellen.com/favicon.ico");
    const env = {} as Env;
    const ctx = {} as ExecutionContext;
    const staticResponse = new Response("static");

    mockedStaticAssetOrchestrator.mockResolvedValue(staticResponse);

    const result = await preRequestOrchestrator(req, env, ctx);

    expect(mockedStaticAssetOrchestrator).toHaveBeenCalledTimes(1);
    expect(mockedStaticAssetOrchestrator).toHaveBeenCalledWith(req, env, ctx);

    expect(mockedPhotoAssetOrchestrator).not.toHaveBeenCalled();

    expect(result).toBe(staticResponse);
  });

  it("falls through to photo assets when static assets return null", async () => {
    const req = new Request("https://kevinellen.com/photo/example/content");
    const env = {} as Env;
    const ctx = {} as ExecutionContext;
    const photoResponse = new Response("photo");

    mockedStaticAssetOrchestrator.mockResolvedValue(null);
    mockedPhotoAssetOrchestrator.mockResolvedValue(photoResponse);

    const result = await preRequestOrchestrator(req, env, ctx);

    expect(mockedStaticAssetOrchestrator).toHaveBeenCalledTimes(1);
    expect(mockedStaticAssetOrchestrator).toHaveBeenCalledWith(req, env, ctx);

    expect(mockedPhotoAssetOrchestrator).toHaveBeenCalledTimes(1);
    expect(mockedPhotoAssetOrchestrator).toHaveBeenCalledWith(req, env, ctx);

    expect(result).toBe(photoResponse);
  });

  it("returns null when neither pre-request handler resolves the request", async () => {
    const req = new Request("https://kevinellen.com/");
    const env = {} as Env;
    const ctx = {} as ExecutionContext;

    mockedStaticAssetOrchestrator.mockResolvedValue(null);
    mockedPhotoAssetOrchestrator.mockResolvedValue(null);

    const result = await preRequestOrchestrator(req, env, ctx);

    expect(mockedStaticAssetOrchestrator).toHaveBeenCalledTimes(1);
    expect(mockedStaticAssetOrchestrator).toHaveBeenCalledWith(req, env, ctx);

    expect(mockedPhotoAssetOrchestrator).toHaveBeenCalledTimes(1);
    expect(mockedPhotoAssetOrchestrator).toHaveBeenCalledWith(req, env, ctx);

    expect(result).toBeNull();
  });
});
