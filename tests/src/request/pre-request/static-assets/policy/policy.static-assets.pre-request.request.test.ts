// tests/src/request/pre-request/static-assets/policy/policy.static-assets.pre-request.request.test.ts

import { staticAssetResponsePolicy } from "@request/pre-request/static-assets/policy/policy.static-assets.pre-request.request";

import type { StaticAssetRequest } from "@request/pre-request/static-assets/types/static-assets.pre-request.request.types";

describe("staticAssetResponsePolicy", () => {
  const createIconAsset = (): StaticAssetRequest => ({
    family: "icon",
    requestPath: "/favicon.ico",
    assetPath: "/assets/icons/favicon.ico",
    fileName: "favicon.ico",
    extension: "ico",
    contentType: "image/x-icon",
    cacheProfile: "icon",
  });

  const createFontAsset = (): StaticAssetRequest => ({
    family: "font",
    requestPath: "/assets/fonts/source-sans/test.woff2",
    assetPath: "/assets/fonts/source-sans/test.woff2",
    fileName: "test.woff2",
    extension: "woff2",
    contentType: "font/woff2",
    cacheProfile: "font",
  });

  const createImageAsset = (): StaticAssetRequest => ({
    family: "image",
    requestPath: "/assets/images/example.webp",
    assetPath: "/assets/images/example.webp",
    fileName: "example.webp",
    extension: "webp",
    contentType: "image/webp",
    cacheProfile: "image",
  });

  it("sets content-type, cache-control, nosniff, and runtime policy for icon assets", async () => {
    const response = new Response("icon-body", {
      status: 200,
      statusText: "OK",
      headers: {
        etag: '"abc123"',
      },
    });

    const asset = createIconAsset();

    const result = staticAssetResponsePolicy(response, asset);

    expect(result.status).toBe(200);
    expect(result.statusText).toBe("OK");
    expect(result.headers.get("content-type")).toBe("image/x-icon");
    expect(result.headers.get("cache-control")).toBe(
      "public, max-age=86400, stale-while-revalidate=86400",
    );
    expect(result.headers.get("x-content-type-options")).toBe("nosniff");
    expect(result.headers.get("x-runtime-policy")).toBe("asset");
    expect(result.headers.get("etag")).toBe('"abc123"');

    await expect(result.text()).resolves.toBe("icon-body");
  });

  it("sets immutable caching for font assets", () => {
    const response = new Response(null, {
      status: 200,
    });

    const asset = createFontAsset();

    const result = staticAssetResponsePolicy(response, asset);

    expect(result.headers.get("content-type")).toBe("font/woff2");
    expect(result.headers.get("cache-control")).toBe(
      "public, max-age=31536000, immutable",
    );
    expect(result.headers.get("x-content-type-options")).toBe("nosniff");
    expect(result.headers.get("x-runtime-policy")).toBe("asset");
  });

  it("sets image caching for image assets", () => {
    const response = new Response(null, {
      status: 200,
    });

    const asset = createImageAsset();

    const result = staticAssetResponsePolicy(response, asset);

    expect(result.headers.get("content-type")).toBe("image/webp");
    expect(result.headers.get("cache-control")).toBe(
      "public, max-age=86400, stale-while-revalidate=86400",
    );
  });
});
