// tests/src/request/pre-request/photo-assets/photo.assets.pre-request.request.test.ts

import { photoAssetResolver } from "@request/pre-request/photo-assets/resolve/resolve.photo.assets.pre-request.request";
import { photoAssetResponsePolicy } from "@request/pre-request/photo-assets/policy/policy.photo-assets.pre-request.request";
import { photoAssetOrchestrator } from "@request/pre-request/photo-assets/photo.assets.pre-request.request";

jest.mock(
  "@request/pre-request/photo-assets/resolve/resolve.photo.assets.pre-request.request",
  () => ({
    photoAssetResolver: jest.fn(),
  }),
);

jest.mock(
  "@request/pre-request/photo-assets/policy/policy.photo-assets.pre-request.request",
  () => ({
    photoAssetResponsePolicy: jest.fn(),
  }),
);

const mockedPhotoAssetResolver = jest.mocked(photoAssetResolver);
const mockedPhotoAssetResponsePolicy = jest.mocked(photoAssetResponsePolicy);

describe("photoAssetOrchestrator", () => {
  const originalFetch = globalThis.fetch;
  let fetchMock: jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.resetAllMocks();

    fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;
    globalThis.fetch = fetchMock;
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

  it("returns null when resolution outcome is not asset", async () => {
    const req = new Request("https://kevinellen.com/journal/example");
    const env = {} as Env;
    const ctx = {} as ExecutionContext;

    mockedPhotoAssetResolver.mockReturnValue({
      outcome: "continue",
    });

    const result = await photoAssetOrchestrator(req, env, ctx);

    expect(mockedPhotoAssetResolver).toHaveBeenCalledTimes(1);
    expect(mockedPhotoAssetResolver).toHaveBeenCalledWith(req);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(mockedPhotoAssetResponsePolicy).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it("throws when CF_IMAGES_DELIVERY_HASH is not set", async () => {
    const req = new Request("https://kevinellen.com/photo/example/hero");
    const env = {} as Env;
    const ctx = {} as ExecutionContext;

    mockedPhotoAssetResolver.mockReturnValue({
      outcome: "asset",
      asset: {
        imageId: "example",
        variant: "hero",
      },
    });

    await expect(photoAssetOrchestrator(req, env, ctx)).rejects.toThrow(
      "Photo: CF_IMAGES_DELIVERY_HASH not set.",
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(mockedPhotoAssetResponsePolicy).not.toHaveBeenCalled();
  });

  it("fetches the Cloudflare image URL and applies the response policy", async () => {
    const req = new Request("https://kevinellen.com/photo/example/hero");
    const upstreamResponse = new Response("upstream-image", {
      status: 200,
      headers: {
        "content-type": "image/jpeg",
      },
    });
    const finalResponse = new Response("final-image", {
      status: 200,
    });

    const env = {
      CF_IMAGES_DELIVERY_HASH: "account-hash-123",
    } as unknown as Env;

    const ctx = {} as ExecutionContext;

    mockedPhotoAssetResolver.mockReturnValue({
      outcome: "asset",
      asset: {
        imageId: "example",
        variant: "hero",
      },
    });

    fetchMock.mockResolvedValue(upstreamResponse);
    mockedPhotoAssetResponsePolicy.mockReturnValue(finalResponse);

    const result = await photoAssetOrchestrator(req, env, ctx);

    expect(mockedPhotoAssetResolver).toHaveBeenCalledTimes(1);
    expect(mockedPhotoAssetResolver).toHaveBeenCalledWith(req);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://imagedelivery.net/account-hash-123/example/hero",
    );

    expect(mockedPhotoAssetResponsePolicy).toHaveBeenCalledTimes(1);
    expect(mockedPhotoAssetResponsePolicy).toHaveBeenCalledWith(
      upstreamResponse,
    );

    expect(result).toBe(finalResponse);
  });

  it("uses the resolved imageId and variant exactly as provided", async () => {
    const req = new Request(
      "https://kevinellen.com/photo/cattle-egret-parenting-in-salbufera/content",
    );
    const upstreamResponse = new Response(null, { status: 200 });
    const finalResponse = new Response(null, { status: 200 });

    const env = {
      CF_IMAGES_DELIVERY_HASH: "delivery-hash",
    } as unknown as Env;

    const ctx = {} as ExecutionContext;

    mockedPhotoAssetResolver.mockReturnValue({
      outcome: "asset",
      asset: {
        imageId: "cattle-egret-parenting-in-salbufera",
        variant: "content",
      },
    });

    fetchMock.mockResolvedValue(upstreamResponse);
    mockedPhotoAssetResponsePolicy.mockReturnValue(finalResponse);

    await photoAssetOrchestrator(req, env, ctx);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://imagedelivery.net/delivery-hash/cattle-egret-parenting-in-salbufera/content",
    );
  });

  it("returns null when the upstream photo response is 404", async () => {
    const req = new Request("https://kevinellen.com/photo/example/hero");
    const upstreamResponse = new Response("not found", {
      status: 404,
      statusText: "Not Found",
    });

    const env = {
      CF_IMAGES_DELIVERY_HASH: "delivery-hash",
    } as unknown as Env;

    const ctx = {} as ExecutionContext;

    mockedPhotoAssetResolver.mockReturnValue({
      outcome: "asset",
      asset: {
        imageId: "example",
        variant: "hero",
      },
    });

    fetchMock.mockResolvedValue(upstreamResponse);

    const result = await photoAssetOrchestrator(req, env, ctx);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://imagedelivery.net/delivery-hash/example/hero",
    );

    expect(mockedPhotoAssetResponsePolicy).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
