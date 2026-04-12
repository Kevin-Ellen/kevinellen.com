// tests/src/app/request/pre-request/static-assets/resolve/font.resolve.static.assets.pre-request.request.test.ts

import { staticAssetResolverFont } from "@request/pre-request/static-assets/resolve/font.resolve.static.assets.pre-request.request";

describe("staticAssetResolverFont", () => {
  it("returns null for non-font paths", () => {
    expect(staticAssetResolverFont("/favicon.ico")).toBeNull();
    expect(staticAssetResolverFont("/assets/images/example.webp")).toBeNull();
  });

  it("returns null for files that are not woff2", () => {
    expect(
      staticAssetResolverFont("/assets/fonts/source-sans/example.woff"),
    ).toBeNull();

    expect(
      staticAssetResolverFont("/assets/fonts/source-sans/example.ttf"),
    ).toBeNull();
  });

  it("resolves a valid woff2 font request", () => {
    const result = staticAssetResolverFont(
      "/assets/fonts/source-sans/sourcesans3-variablefont_wght.woff2",
    );

    expect(result).toEqual({
      family: "font",
      requestPath:
        "/assets/fonts/source-sans/sourcesans3-variablefont_wght.woff2",
      assetPath:
        "/assets/fonts/source-sans/sourcesans3-variablefont_wght.woff2",
      fileName: "sourcesans3-variablefont_wght.woff2",
      extension: "woff2",
      contentType: "font/woff2",
      cacheProfile: "font",
    });
  });

  it("uses the final path segment as the file name", () => {
    const result = staticAssetResolverFont(
      "/assets/fonts/source-serif/sourceserif4-variablefont_opsz_wght.woff2",
    );

    expect(result?.fileName).toBe("sourceserif4-variablefont_opsz_wght.woff2");
  });
});
