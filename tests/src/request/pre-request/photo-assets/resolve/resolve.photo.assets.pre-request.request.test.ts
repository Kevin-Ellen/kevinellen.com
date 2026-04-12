// tests/src/request/pre-request/photo-assets/resolve/resolve.photo.assets.pre-request.request.test.ts

import { photoAssetResolver } from "@request/pre-request/photo-assets/resolve/resolve.photo.assets.pre-request.request";

describe("photoAssetResolver", () => {
  it("returns continue for a normal page request", () => {
    const req = new Request("https://kevinellen.com/journal/example");

    const result = photoAssetResolver(req);

    expect(result).toEqual({
      outcome: "continue",
    });
  });

  it("returns continue for a static asset request", () => {
    const req = new Request("https://kevinellen.com/favicon.ico");

    const result = photoAssetResolver(req);

    expect(result).toEqual({
      outcome: "continue",
    });
  });

  it("returns asset for a valid photo asset request", () => {
    const req = new Request("https://kevinellen.com/photo/abc123/hero");

    const result = photoAssetResolver(req);

    expect(result).toEqual({
      outcome: "asset",
      asset: {
        imageId: "abc123",
        variant: "hero",
      },
    });
  });

  it("extracts imageId and variant from the pathname", () => {
    const req = new Request(
      "https://kevinellen.com/photo/cattle-egret-parenting-in-salbufera/content",
    );

    const result = photoAssetResolver(req);

    expect(result.outcome).toBe("asset");

    if (result.outcome !== "asset") {
      throw new Error("Expected photo asset resolution.");
    }

    expect(result.asset.imageId).toBe("cattle-egret-parenting-in-salbufera");
    expect(result.asset.variant).toBe("content");
  });

  it("ignores query strings and resolves from pathname only", () => {
    const req = new Request(
      "https://kevinellen.com/photo/example-image/thumbnail?v=123",
    );

    const result = photoAssetResolver(req);

    expect(result).toEqual({
      outcome: "asset",
      asset: {
        imageId: "example-image",
        variant: "thumbnail",
      },
    });
  });
});
