// src/request/pre-request/assets/static/static.assets.pre-request.request.test.ts

import { staticAssetOrchestrator } from "@request/pre-request/assets/static/static.assets.pre-request.request";
import { staticAssetResolver } from "@request/pre-request/assets/static/resolve/resolve.static.assets.pre-request.request";
import { staticAssetResponsePolicy } from "@request/pre-request/assets/static/policy/policy.static-assets.pre-request.request";

jest.mock(
  "@request/pre-request/assets/static/resolve/resolve.static.assets.pre-request.request",
  () => ({
    staticAssetResolver: jest.fn(),
  }),
);

jest.mock(
  "@request/pre-request/assets/static/policy/policy.static-assets.pre-request.request",
  () => ({
    staticAssetResponsePolicy: jest.fn(),
  }),
);

const createRequest = (): Request =>
  new Request("https://example.com/favicon.ico?version=1", {
    headers: {
      "x-test": "yes",
    },
  });

const createCtx = (): ExecutionContext => ({}) as ExecutionContext;

const createEnv = () =>
  ({
    ASSETS: {
      fetch: jest.fn(),
    },
  }) as never as Env;

const createAsset = () =>
  ({
    family: "icon",
    requestPath: "/favicon.ico",
    assetPath: "/assets/icons/favicon.ico",
    fileName: "favicon.ico",
    extension: "ico",
    contentType: "image/x-icon",
    cacheProfile: "icon",
  }) as const;

describe("staticAssetOrchestrator", () => {
  const mockedStaticAssetResolver = jest.mocked(staticAssetResolver);
  const mockedStaticAssetResponsePolicy = jest.mocked(
    staticAssetResponsePolicy,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when request does not resolve to a static asset", async () => {
    const env = createEnv();

    mockedStaticAssetResolver.mockReturnValue({
      outcome: "continue",
    });

    await expect(
      staticAssetOrchestrator(createRequest(), env, createCtx()),
    ).resolves.toBeNull();

    expect(env.ASSETS.fetch).not.toHaveBeenCalled();
    expect(mockedStaticAssetResponsePolicy).not.toHaveBeenCalled();
  });

  it("returns null for unsupported static assets", async () => {
    const env = createEnv();

    mockedStaticAssetResolver.mockReturnValue({
      outcome: "unsupported-asset",
      pathname: "/assets/file.pdf",
    });

    await expect(
      staticAssetOrchestrator(createRequest(), env, createCtx()),
    ).resolves.toBeNull();

    expect(env.ASSETS.fetch).not.toHaveBeenCalled();
  });

  it("fetches the resolved asset path and applies static asset response policy", async () => {
    const env = createEnv();
    const asset = createAsset();
    const upstreamResponse = new Response("asset-body", { status: 200 });
    const policyResponse = new Response("policy-body", { status: 200 });

    mockedStaticAssetResolver.mockReturnValue({
      outcome: "asset",
      asset,
    });

    jest.mocked(env.ASSETS.fetch).mockResolvedValue(upstreamResponse);
    mockedStaticAssetResponsePolicy.mockReturnValue(policyResponse);

    await expect(
      staticAssetOrchestrator(createRequest(), env, createCtx()),
    ).resolves.toBe(policyResponse);

    expect(env.ASSETS.fetch).toHaveBeenCalledTimes(1);

    const forwardedRequest = jest.mocked(env.ASSETS.fetch).mock.calls[0][0];

    expect(forwardedRequest).toBeInstanceOf(Request);
    expect((forwardedRequest as Request).url).toBe(
      "https://example.com/assets/icons/favicon.ico?version=1",
    );
    expect((forwardedRequest as Request).headers.get("x-test")).toBe("yes");

    expect(mockedStaticAssetResponsePolicy).toHaveBeenCalledWith(
      upstreamResponse,
      asset,
    );
  });
});
