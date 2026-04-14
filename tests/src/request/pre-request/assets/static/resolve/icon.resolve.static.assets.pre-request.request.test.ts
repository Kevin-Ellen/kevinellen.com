// tests/src/request/pre-request/assets/static/resolve/icon.resolve.static.assets.pre-request.request.test.ts

import { staticAssetResolverIcon } from "@request/pre-request/assets/static/resolve/icon.resolve.static.assets.pre-request.request";
import {
  STATIC_ASSETS_ICON_FILE_NAMES,
  STATIC_ASSETS_ICON_ROOT_ALIASES,
} from "@request/pre-request/assets/static/config/config.static-assets.pre-request.request";

describe("staticAssetResolverIcon", () => {
  it("returns null for non-icon paths", () => {
    expect(staticAssetResolverIcon("/assets/images/example.webp")).toBeNull();
    expect(
      staticAssetResolverIcon(
        "/assets/fonts/source-sans/sourcesans3-variablefont_wght.woff2",
      ),
    ).toBeNull();
  });

  it("returns null for an empty pathname", () => {
    expect(staticAssetResolverIcon("")).toBeNull();
  });

  it("returns null for the root pathname", () => {
    expect(staticAssetResolverIcon("/")).toBeNull();
  });

  it("resolves an icon under /assets/icons when the file name is allowed", () => {
    const allowedFileName = Array.from(STATIC_ASSETS_ICON_FILE_NAMES)[0];

    expect(allowedFileName).toBeDefined();

    if (!allowedFileName) {
      throw new Error("Expected at least one allowed icon file name.");
    }

    const result = staticAssetResolverIcon(`/assets/icons/${allowedFileName}`);

    expect(result).not.toBeNull();
    expect(result?.family).toBe("icon");
    expect(result?.requestPath).toBe(`/assets/icons/${allowedFileName}`);
    expect(result?.assetPath).toBe(`/assets/icons/${allowedFileName}`);
    expect(result?.fileName).toBe(allowedFileName);
    expect(result?.cacheProfile).toBe("icon");
  });

  it("returns null for an /assets/icons file that is not in the allowed set", () => {
    const result = staticAssetResolverIcon("/assets/icons/not-real-icon.svg");

    expect(result).toBeNull();
  });

  it("resolves a root alias using the configured alias map", () => {
    const aliasEntry = Object.entries(STATIC_ASSETS_ICON_ROOT_ALIASES)[0];

    expect(aliasEntry).toBeDefined();

    if (!aliasEntry) {
      throw new Error("Expected at least one icon root alias for this test.");
    }

    const [requestPath, assetPath] = aliasEntry;

    const result = staticAssetResolverIcon(requestPath);

    expect(result).not.toBeNull();
    expect(result?.family).toBe("icon");
    expect(result?.requestPath).toBe(requestPath);
    expect(result?.assetPath).toBe(assetPath);
    expect(result?.cacheProfile).toBe("icon");
  });

  it("maps png icons to image/png", () => {
    const pngFileName = Array.from(STATIC_ASSETS_ICON_FILE_NAMES).find(
      (fileName) => fileName.endsWith(".png"),
    );

    expect(pngFileName).toBeDefined();

    if (!pngFileName) {
      throw new Error(
        "Expected at least one png icon file name for this test.",
      );
    }

    const result = staticAssetResolverIcon(`/assets/icons/${pngFileName}`);

    expect(result).not.toBeNull();
    expect(result?.extension).toBe("png");
    expect(result?.contentType).toBe("image/png");
  });

  it("maps svg icons to image/svg+xml", () => {
    const svgFileName = Array.from(STATIC_ASSETS_ICON_FILE_NAMES).find(
      (fileName) => fileName.endsWith(".svg"),
    );

    expect(svgFileName).toBeDefined();

    if (!svgFileName) {
      throw new Error(
        "Expected at least one svg icon file name for this test.",
      );
    }

    const result = staticAssetResolverIcon(`/assets/icons/${svgFileName}`);

    expect(result).not.toBeNull();
    expect(result?.extension).toBe("svg");
    expect(result?.contentType).toBe("image/svg+xml");
  });

  it("maps ico icons to image/x-icon", () => {
    const icoResult = staticAssetResolverIcon("/favicon.ico");

    expect(icoResult).not.toBeNull();
    expect(icoResult?.extension).toBe("ico");
    expect(icoResult?.contentType).toBe("image/x-icon");
  });

  it("returns null when an allowed icon file has an unsupported extension", async () => {
    jest.resetModules();

    jest.doMock(
      "@request/pre-request/assets/static/config/config.static-assets.pre-request.request",
      () => ({
        STATIC_ASSETS_ICON_FILE_NAMES: new Set(["broken-icon.txt"]),
        STATIC_ASSETS_ICON_ROOT_ALIASES: {},
      }),
    );

    const { staticAssetResolverIcon: isolatedResolver } =
      await import("@request/pre-request/assets/static/resolve/icon.resolve.static.assets.pre-request.request");

    expect(isolatedResolver("/assets/icons/broken-icon.txt")).toBeNull();
  });
});
