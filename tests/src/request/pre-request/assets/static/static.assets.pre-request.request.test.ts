// tests/src/request/pre-request/assets/static/static.assets.pre-request.request.test.ts

import { staticAssetResolver } from "@request/pre-request/assets/static/resolve/resolve.static.assets.pre-request.request";
import { staticAssetResponsePolicy } from "@request/pre-request/assets/static/policy/policy.static-assets.pre-request.request";
import { staticAssetOrchestrator } from "@request/pre-request/assets/static/static.assets.pre-request.request";

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

const mockedStaticAssetResolver = jest.mocked(staticAssetResolver);
const mockedStaticAssetResponsePolicy = jest.mocked(staticAssetResponsePolicy);

describe("staticAssetOrchestrator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when resolution outcome is not asset", async () => {
    const req = new Request("https://kevinellen.com/journal/example");
    const env = {
      ASSETS: {
        fetch: jest.fn(),
      },
    } as unknown as Env;
    const ctx = {} as ExecutionContext;

    mockedStaticAssetResolver.mockReturnValue({
      outcome: "continue",
    });

    const result = await staticAssetOrchestrator(req, env, ctx);

    expect(mockedStaticAssetResolver).toHaveBeenCalledTimes(1);
    expect(mockedStaticAssetResolver).toHaveBeenCalledWith(req);
    expect(env.ASSETS.fetch).not.toHaveBeenCalled();
    expect(mockedStaticAssetResponsePolicy).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it("fetches the resolved asset path and applies the response policy", async () => {
    const req = new Request("https://kevinellen.com/favicon.ico?x=1");
    const assetResponse = new Response("raw-asset", {
      status: 200,
    });
    const finalResponse = new Response("final-asset", {
      status: 200,
    });

    const fetchMock = jest.fn().mockResolvedValue(assetResponse);

    const env = {
      ASSETS: {
        fetch: fetchMock,
      },
    } as unknown as Env;

    const ctx = {} as ExecutionContext;

    const resolvedAsset = {
      family: "icon",
      requestPath: "/favicon.ico",
      assetPath: "/assets/icons/favicon.ico",
      fileName: "favicon.ico",
      extension: "ico",
      contentType: "image/x-icon",
      cacheProfile: "icon",
    } as const;

    mockedStaticAssetResolver.mockReturnValue({
      outcome: "asset",
      asset: resolvedAsset,
    });

    mockedStaticAssetResponsePolicy.mockReturnValue(finalResponse);

    const result = await staticAssetOrchestrator(req, env, ctx);

    expect(mockedStaticAssetResolver).toHaveBeenCalledTimes(1);
    expect(mockedStaticAssetResolver).toHaveBeenCalledWith(req);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const fetchedRequest = fetchMock.mock.calls[0]?.[0];
    expect(fetchedRequest).toBeInstanceOf(Request);
    expect(fetchedRequest.url).toBe(
      "https://kevinellen.com/assets/icons/favicon.ico?x=1",
    );

    expect(mockedStaticAssetResponsePolicy).toHaveBeenCalledTimes(1);
    expect(mockedStaticAssetResponsePolicy).toHaveBeenCalledWith(
      assetResponse,
      resolvedAsset,
    );

    expect(result).toBe(finalResponse);
  });

  it("preserves the original request method and headers when creating the asset request", async () => {
    const req = new Request("https://kevinellen.com/favicon.ico", {
      method: "HEAD",
      headers: {
        "x-test-header": "yes",
      },
    });

    const assetResponse = new Response(null, { status: 200 });
    const finalResponse = new Response(null, { status: 200 });

    const fetchMock = jest.fn().mockResolvedValue(assetResponse);

    const env = {
      ASSETS: {
        fetch: fetchMock,
      },
    } as unknown as Env;

    const ctx = {} as ExecutionContext;

    const resolvedAsset = {
      family: "icon",
      requestPath: "/favicon.ico",
      assetPath: "/assets/icons/favicon.ico",
      fileName: "favicon.ico",
      extension: "ico",
      contentType: "image/x-icon",
      cacheProfile: "icon",
    } as const;

    mockedStaticAssetResolver.mockReturnValue({
      outcome: "asset",
      asset: resolvedAsset,
    });

    mockedStaticAssetResponsePolicy.mockReturnValue(finalResponse);

    await staticAssetOrchestrator(req, env, ctx);

    const fetchedRequest = fetchMock.mock.calls[0]?.[0] as Request;

    expect(fetchedRequest.method).toBe("HEAD");
    expect(fetchedRequest.headers.get("x-test-header")).toBe("yes");
  });
});
