// tests/src/app/request/pre-request/static-assets/resolve/icon.resolve.static.assets.pre-request.request.test.ts

import { staticAssetResolverIcon } from "@request/pre-request/static-assets/resolve/icon.resolve.static.assets.pre-request.request";
import {
  STATIC_ASSETS_ICON_FILE_NAMES,
  STATIC_ASSETS_ICON_ROOT_ALIASES,
} from "@request/pre-request/static-assets/config/config.static-assets.pre-request.request";

describe("staticAssetResolverIcon", () => {
  it("returns null for non-icon paths", () => {
    expect(staticAssetResolverIcon("/assets/images/example.webp")).toBeNull();
    expect(
      staticAssetResolverIcon(
        "/assets/fonts/source-sans/sourcesans3-variablefont_wght.woff2",
      ),
    ).toBeNull();
  });

  it("resolves an icon under /assets/icons when the file name is allowed", () => {
    const allowedFileName = Array.from(STATIC_ASSETS_ICON_FILE_NAMES)[0];

    expect(allowedFileName).toBeDefined();

    const result = staticAssetResolverIcon(`/assets/icons/${allowedFileName}`);

    expect(result).not.toBeNull();
    expect(result?.family).toBe("icon");
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

  it("maps content types correctly from extensions", () => {
    const pngResult = staticAssetResolverIcon(
      "/assets/icons/apple-touch-icon.png",
    );
    const icoResult = staticAssetResolverIcon("/favicon.ico");

    if (pngResult) {
      expect(pngResult.contentType).toBe("image/png");
    }

    if (icoResult) {
      expect(icoResult.contentType).toBe("image/x-icon");
    }
  });
});
