// src/request/pre-request/assets/photo/resolve/resolve.photo.assets.pre-request.request.test.ts

import { photoAssetResolver } from "@request/pre-request/assets/photo/resolve/resolve.photo.assets.pre-request.request";

describe("photoAssetResolver", () => {
  it("returns continue for non-photo asset paths", () => {
    const result = photoAssetResolver(
      new Request("https://example.com/journal/test"),
    );

    expect(result).toEqual({
      outcome: "continue",
    });
  });

  it("resolves a base photo asset using the default variant", () => {
    const result = photoAssetResolver(
      new Request("https://example.com/media/photo/test-photo"),
    );

    expect(result).toEqual({
      outcome: "asset",
      asset: {
        imageId: "test-photo",
        variant: "public",
      },
    });
  });

  it("resolves a resized photo asset variant", () => {
    const result = photoAssetResolver(
      new Request("https://example.com/media/photo/test-photo/1200/800"),
    );

    expect(result).toEqual({
      outcome: "asset",
      asset: {
        imageId: "test-photo",
        variant: "w=1200,h=800,fit=cover",
      },
    });
  });

  it("ignores query params when resolving photo assets", () => {
    const result = photoAssetResolver(
      new Request(
        "https://example.com/media/photo/test-photo/1200/800?ref=test",
      ),
    );

    expect(result).toEqual({
      outcome: "asset",
      asset: {
        imageId: "test-photo",
        variant: "w=1200,h=800,fit=cover",
      },
    });
  });

  it("supports photo IDs containing dots", () => {
    const result = photoAssetResolver(
      new Request("https://example.com/media/photo/test.photo-v2"),
    );

    expect(result).toEqual({
      outcome: "asset",
      asset: {
        imageId: "test.photo-v2",
        variant: "public",
      },
    });
  });

  it("returns continue for incomplete resize paths", () => {
    const result = photoAssetResolver(
      new Request("https://example.com/media/photo/test-photo/1200"),
    );

    expect(result).toEqual({
      outcome: "continue",
    });
  });

  it("returns continue for paths with extra segments", () => {
    const result = photoAssetResolver(
      new Request("https://example.com/media/photo/test-photo/1200/800/extra"),
    );

    expect(result).toEqual({
      outcome: "continue",
    });
  });
});
