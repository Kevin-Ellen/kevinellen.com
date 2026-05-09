// src/request/pre-request/assets/static/resolve/icon.resolve.static.assets.pre-request.request.test.ts

import { staticAssetResolverIcon } from "@request/pre-request/assets/static/resolve/icon.resolve.static.assets.pre-request.request";

describe("staticAssetResolverIcon", () => {
  it("returns null outside icon paths and aliases", () => {
    expect(staticAssetResolverIcon("/assets/images/favicon.ico")).toBeNull();
  });

  it("resolves favicon root alias", () => {
    expect(staticAssetResolverIcon("/favicon.ico")).toEqual({
      family: "icon",
      requestPath: "/favicon.ico",
      assetPath: "/assets/icons/favicon.ico",
      fileName: "favicon.ico",
      extension: "ico",
      contentType: "image/x-icon",
      cacheProfile: "icon",
    });
  });

  it("resolves apple touch icon root alias", () => {
    expect(staticAssetResolverIcon("/apple-touch-icon.png")).toEqual({
      family: "icon",
      requestPath: "/apple-touch-icon.png",
      assetPath: "/assets/icons/apple-touch-icon.png",
      fileName: "apple-touch-icon.png",
      extension: "png",
      contentType: "image/png",
      cacheProfile: "icon",
    });
  });

  it("resolves configured svg icon assets", () => {
    expect(
      staticAssetResolverIcon("/assets/icons/ke-monogram-logo.svg"),
    ).toEqual({
      family: "icon",
      requestPath: "/assets/icons/ke-monogram-logo.svg",
      assetPath: "/assets/icons/ke-monogram-logo.svg",
      fileName: "ke-monogram-logo.svg",
      extension: "svg",
      contentType: "image/svg+xml",
      cacheProfile: "icon",
    });
  });

  it("returns null for unconfigured icon files", () => {
    expect(staticAssetResolverIcon("/assets/icons/random.svg")).toBeNull();
  });

  it("returns null for configured-looking path with unsupported extension", () => {
    expect(staticAssetResolverIcon("/assets/icons/favicon.txt")).toBeNull();
  });

  it("resolves configured png icon assets", () => {
    expect(
      staticAssetResolverIcon("/assets/icons/web-app-manifest-192x192.png"),
    ).toEqual({
      family: "icon",
      requestPath: "/assets/icons/web-app-manifest-192x192.png",
      assetPath: "/assets/icons/web-app-manifest-192x192.png",
      fileName: "web-app-manifest-192x192.png",
      extension: "png",
      contentType: "image/png",
      cacheProfile: "icon",
    });
  });

  it("resolves configured ico icon assets", () => {
    expect(staticAssetResolverIcon("/assets/icons/favicon.ico")).toEqual({
      family: "icon",
      requestPath: "/assets/icons/favicon.ico",
      assetPath: "/assets/icons/favicon.ico",
      fileName: "favicon.ico",
      extension: "ico",
      contentType: "image/x-icon",
      cacheProfile: "icon",
    });
  });
});
