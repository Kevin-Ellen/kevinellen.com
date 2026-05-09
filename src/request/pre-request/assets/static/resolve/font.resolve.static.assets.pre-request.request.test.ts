// src/request/pre-request/assets/static/resolve/font.resolve.static.assets.pre-request.request.test.ts

import { staticAssetResolverFont } from "@request/pre-request/assets/static/resolve/font.resolve.static.assets.pre-request.request";

describe("staticAssetResolverFont", () => {
  it("returns null outside assets fonts", () => {
    expect(staticAssetResolverFont("/assets/images/test.woff2")).toBeNull();
  });

  it("returns null for non-woff2 font paths", () => {
    expect(staticAssetResolverFont("/assets/fonts/test.ttf")).toBeNull();
  });

  it("resolves woff2 font assets", () => {
    expect(staticAssetResolverFont("/assets/fonts/body.woff2")).toEqual({
      family: "font",
      requestPath: "/assets/fonts/body.woff2",
      assetPath: "/assets/fonts/body.woff2",
      fileName: "body.woff2",
      extension: "woff2",
      contentType: "font/woff2",
      cacheProfile: "font",
    });
  });
});
