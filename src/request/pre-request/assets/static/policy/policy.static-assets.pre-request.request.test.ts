// src/request/pre-request/assets/static/policy/policy.static-assets.pre-request.request.test.ts

import { staticAssetResponsePolicy } from "@request/pre-request/assets/static/policy/policy.static-assets.pre-request.request";
import type { StaticAssetRequest } from "@request/pre-request/assets/static/types/static-assets.pre-request.request.types";

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
  requestPath: "/assets/fonts/body.woff2",
  assetPath: "/assets/fonts/body.woff2",
  fileName: "body.woff2",
  extension: "woff2",
  contentType: "font/woff2",
  cacheProfile: "font",
});

const createImageAsset = (): StaticAssetRequest => ({
  family: "image",
  requestPath: "/assets/images/photo.webp",
  assetPath: "/assets/images/photo.webp",
  fileName: "photo.webp",
  extension: "webp",
  contentType: "image/webp",
  cacheProfile: "image",
});

describe("staticAssetResponsePolicy", () => {
  it.each([
    [createIconAsset(), "public, max-age=86400, stale-while-revalidate=86400"],
    [createFontAsset(), "public, max-age=31536000, immutable"],
    [createImageAsset(), "public, max-age=86400, stale-while-revalidate=86400"],
  ] as const)("applies cache policy", (asset, cacheControl) => {
    const response = staticAssetResponsePolicy(
      new Response("body", {
        status: 201,
        statusText: "Created",
        headers: {
          "content-type": "text/plain",
        },
      }),
      asset,
    );

    expect(response.status).toBe(201);
    expect(response.statusText).toBe("Created");
    expect(response.headers.get("content-type")).toBe(asset.contentType);
    expect(response.headers.get("cache-control")).toBe(cacheControl);
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("x-runtime-policy")).toBe("asset");
  });

  it("preserves the response body", async () => {
    const response = staticAssetResponsePolicy(
      new Response("asset-body"),
      createImageAsset(),
    );

    await expect(response.text()).resolves.toBe("asset-body");
  });
});
