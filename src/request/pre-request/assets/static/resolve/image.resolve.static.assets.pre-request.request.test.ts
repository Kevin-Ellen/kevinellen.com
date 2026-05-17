// src/request/pre-request/assets/static/resolve/image.resolve.static.assets.pre-request.request.test.ts

import { staticAssetResolverImage } from "@request/pre-request/assets/static/resolve/image.resolve.static.assets.pre-request.request";

describe("staticAssetResolverImage", () => {
  it("returns null outside assets images", () => {
    expect(staticAssetResolverImage("/assets/fonts/test.png")).toBeNull();
  });

  it("returns null for unsupported image extensions", () => {
    expect(staticAssetResolverImage("/assets/images/test.gif")).toBeNull();
  });

  it.each([
    ["png", "image/png"],
    ["jpg", "image/jpeg"],
    ["jpeg", "image/jpeg"],
    ["webp", "image/webp"],
    ["avif", "image/avif"],
  ] as const)("resolves %s image assets", (extension, contentType) => {
    expect(
      staticAssetResolverImage(`/assets/images/test.${extension}`),
    ).toEqual({
      family: "image",
      requestPath: `/assets/images/test.${extension}`,
      assetPath: `/assets/images/test.${extension}`,
      fileName: `test.${extension}`,
      extension,
      contentType,
      cacheProfile: "image",
    });
  });
});
