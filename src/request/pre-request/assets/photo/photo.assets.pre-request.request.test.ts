// src/request/pre-request/assets/photo/photo.assets.pre-request.request.test.ts

import { photoAssetOrchestrator } from "@request/pre-request/assets/photo/photo.assets.pre-request.request";
import { photoAssetResolver } from "@request/pre-request/assets/photo/resolve/resolve.photo.assets.pre-request.request";
import { photoAssetResponsePolicy } from "@request/pre-request/assets/photo/policy/policy.photo-assets.pre-request.request";

jest.mock(
  "@request/pre-request/assets/photo/resolve/resolve.photo.assets.pre-request.request",
  () => ({
    photoAssetResolver: jest.fn(),
  }),
);

jest.mock(
  "@request/pre-request/assets/photo/policy/policy.photo-assets.pre-request.request",
  () => ({
    photoAssetResponsePolicy: jest.fn(),
  }),
);

const createRequest = (): Request =>
  new Request("https://example.com/media/photo/test-photo");

const createEnv = (overrides: Partial<Env> = {}): Env =>
  ({
    CF_IMAGES_DELIVERY_HASH: "account-hash",
    ...overrides,
  }) as Env;

const createCtx = (): ExecutionContext => ({}) as ExecutionContext;

describe("photoAssetOrchestrator", () => {
  const mockedPhotoAssetResolver = jest.mocked(photoAssetResolver);
  const mockedPhotoAssetResponsePolicy = jest.mocked(photoAssetResponsePolicy);
  const mockedFetch = jest.fn<
    ReturnType<typeof fetch>,
    Parameters<typeof fetch>
  >();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = mockedFetch;
  });

  it("returns null when request does not resolve to a photo asset", async () => {
    mockedPhotoAssetResolver.mockReturnValue({ outcome: "continue" });

    await expect(
      photoAssetOrchestrator(createRequest(), createEnv(), createCtx()),
    ).resolves.toBeNull();

    expect(mockedFetch).not.toHaveBeenCalled();
    expect(mockedPhotoAssetResponsePolicy).not.toHaveBeenCalled();
  });

  it("throws when Cloudflare Images delivery hash is missing", async () => {
    mockedPhotoAssetResolver.mockReturnValue({
      outcome: "asset",
      asset: {
        imageId: "test-photo",
        variant: "public",
      },
    });

    await expect(
      photoAssetOrchestrator(
        createRequest(),
        {
          ...createEnv(),
          CF_IMAGES_DELIVERY_HASH: "",
        } as unknown as Env,
        createCtx(),
      ),
    ).rejects.toThrow("Photo: CF_IMAGES_DELIVERY_HASH not set.");

    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("fetches the Cloudflare Images URL and applies photo response policy", async () => {
    const upstreamResponse = new Response("image-body", {
      status: 200,
      headers: {
        "content-type": "image/webp",
      },
    });

    const policyResponse = new Response("policy-body", {
      status: 200,
    });

    mockedPhotoAssetResolver.mockReturnValue({
      outcome: "asset",
      asset: {
        imageId: "test-photo",
        variant: "w=1200,h=800,fit=cover",
      },
    });

    mockedFetch.mockResolvedValue(upstreamResponse);
    mockedPhotoAssetResponsePolicy.mockReturnValue(policyResponse);

    await expect(
      photoAssetOrchestrator(createRequest(), createEnv(), createCtx()),
    ).resolves.toBe(policyResponse);

    expect(mockedFetch).toHaveBeenCalledWith(
      "https://imagedelivery.net/account-hash/test-photo/w=1200,h=800,fit=cover",
    );
    expect(mockedPhotoAssetResponsePolicy).toHaveBeenCalledWith(
      upstreamResponse,
    );
  });

  it("returns null when Cloudflare Images returns 404", async () => {
    const upstreamResponse = new Response(null, {
      status: 404,
    });

    mockedPhotoAssetResolver.mockReturnValue({
      outcome: "asset",
      asset: {
        imageId: "missing-photo",
        variant: "public",
      },
    });

    mockedFetch.mockResolvedValue(upstreamResponse);

    await expect(
      photoAssetOrchestrator(createRequest(), createEnv(), createCtx()),
    ).resolves.toBeNull();

    expect(mockedPhotoAssetResponsePolicy).not.toHaveBeenCalled();
  });
});
