// tests/src/request/pre-request/assets/static/resolve/image.resolve.static.assets.pre-request.request.test.ts

import { staticAssetResolverImage } from "@request/pre-request/assets/static/resolve/image.resolve.static.assets.pre-request.request";

describe("staticAssetResolverImage", () => {
  it("returns null for non-image paths", () => {
    expect(staticAssetResolverImage("/favicon.ico")).toBeNull();
    expect(
      staticAssetResolverImage(
        "/assets/fonts/source-sans/sourcesans3-variablefont_wght.woff2",
      ),
    ).toBeNull();
  });

  it("returns null for unsupported image extensions", () => {
    expect(staticAssetResolverImage("/assets/images/example.gif")).toBeNull();
    expect(staticAssetResolverImage("/assets/images/example.bmp")).toBeNull();
  });

  it("resolves png images", () => {
    const result = staticAssetResolverImage("/assets/images/example.png");

    expect(result).toEqual({
      family: "image",
      requestPath: "/assets/images/example.png",
      assetPath: "/assets/images/example.png",
      fileName: "example.png",
      extension: "png",
      contentType: "image/png",
      cacheProfile: "image",
    });
  });

  it("resolves jpg and jpeg images as image/jpeg", () => {
    const jpgResult = staticAssetResolverImage("/assets/images/example.jpg");
    const jpegResult = staticAssetResolverImage("/assets/images/example.jpeg");

    expect(jpgResult?.extension).toBe("jpg");
    expect(jpgResult?.contentType).toBe("image/jpeg");

    expect(jpegResult?.extension).toBe("jpeg");
    expect(jpegResult?.contentType).toBe("image/jpeg");
  });

  it("resolves webp and avif images", () => {
    const webpResult = staticAssetResolverImage("/assets/images/example.webp");
    const avifResult = staticAssetResolverImage("/assets/images/example.avif");

    expect(webpResult?.contentType).toBe("image/webp");
    expect(avifResult?.contentType).toBe("image/avif");
  });
});
