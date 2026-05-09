// src/request/pre-request/assets/static/resolve/resolve.static.assets.pre-request.request.test.ts

import { staticAssetResolver } from "@request/pre-request/assets/static/resolve/resolve.static.assets.pre-request.request";

const createRequest = (path: string): Request =>
  new Request(`https://example.com${path}`);

describe("staticAssetResolver", () => {
  it("resolves direct favicon alias as an asset", () => {
    expect(staticAssetResolver(createRequest("/favicon.ico"))).toMatchObject({
      outcome: "asset",
      asset: {
        family: "icon",
        assetPath: "/assets/icons/favicon.ico",
      },
    });
  });

  it("resolves font assets", () => {
    expect(
      staticAssetResolver(createRequest("/assets/fonts/body.woff2")),
    ).toMatchObject({
      outcome: "asset",
      asset: {
        family: "font",
        contentType: "font/woff2",
      },
    });
  });

  it("resolves image assets", () => {
    expect(
      staticAssetResolver(createRequest("/assets/images/photo.webp")),
    ).toMatchObject({
      outcome: "asset",
      asset: {
        family: "image",
        contentType: "image/webp",
      },
    });
  });

  it("returns unsupported-asset for recognised static asset path with unsupported file", () => {
    expect(
      staticAssetResolver(createRequest("/assets/documents/test.pdf")),
    ).toEqual({
      outcome: "unsupported-asset",
      pathname: "/assets/documents/test.pdf",
    });
  });

  it("returns unsupported-asset for direct static pathname that is not resolvable", () => {
    expect(
      staticAssetResolver(createRequest("/apple-touch-icon.png")),
    ).toMatchObject({
      outcome: "asset",
    });
  });

  it("returns continue for unrelated paths", () => {
    expect(staticAssetResolver(createRequest("/journal"))).toEqual({
      outcome: "continue",
    });
  });

  it("ignores query params", () => {
    expect(
      staticAssetResolver(createRequest("/assets/images/photo.webp?v=1")),
    ).toMatchObject({
      outcome: "asset",
      asset: {
        fileName: "photo.webp",
      },
    });
  });

  it("resolves apple touch icon alias as an asset", () => {
    expect(
      staticAssetResolver(createRequest("/apple-touch-icon.png")),
    ).toMatchObject({
      outcome: "asset",
      asset: {
        family: "icon",
        assetPath: "/assets/icons/apple-touch-icon.png",
      },
    });
  });
});
