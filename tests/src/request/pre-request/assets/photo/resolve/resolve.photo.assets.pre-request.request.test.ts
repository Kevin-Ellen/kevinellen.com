// tests/src/request/pre-request/assets/photo/resolve/resolve.photo.assets.pre-request.request.test.ts

import { photoAssetResolver } from "@request/pre-request/assets/photo/resolve/resolve.photo.assets.pre-request.request";

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
    const req = new Request("https://kevinellen.com/media/photo/abc123");

    const result = photoAssetResolver(req);

    expect(result).toEqual({
      outcome: "asset",
      asset: {
        imageId: "abc123",
        variant: "public",
      },
    });
  });

  it("extracts imageId and generated variant from the pathname", () => {
    const req = new Request(
      "https://kevinellen.com/media/photo/cattle-egret-parenting-in-salbufera/640/360",
    );

    const result = photoAssetResolver(req);

    expect(result.outcome).toBe("asset");

    if (result.outcome !== "asset") {
      throw new Error("Expected photo asset resolution.");
    }

    expect(result.asset.imageId).toBe("cattle-egret-parenting-in-salbufera");
    expect(result.asset.variant).toBe("w=640,h=360,fit=cover");
  });

  it("ignores query strings and resolves from pathname only", () => {
    const req = new Request(
      "https://kevinellen.com/media/photo/example-image/960/540?v=123",
    );

    const result = photoAssetResolver(req);

    expect(result).toEqual({
      outcome: "asset",
      asset: {
        imageId: "example-image",
        variant: "w=960,h=540,fit=cover",
      },
    });
  });
});
