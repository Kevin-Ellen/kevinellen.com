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
        variant: "w=1200,h=800,fit=cover,format=auto",
      },
    });
  });

  it("resolves a resized photo asset variant with automatic format negotiation", () => {
    const result = photoAssetResolver(
      new Request("https://example.com/media/photo/test-photo/1200/800"),
    );

    expect(result).toEqual({
      outcome: "asset",
      asset: {
        imageId: "test-photo",
        variant: "w=1200,h=800,fit=cover,format=auto",
      },
    });
  });

  it("keeps resized photo variant delivery policy explicit", () => {
    const result = photoAssetResolver(
      new Request("https://example.com/media/photo/test-photo/801/534"),
    );

    expect(result).toEqual({
      outcome: "asset",
      asset: {
        imageId: "test-photo",
        variant: "w=801,h=534,fit=cover,format=auto",
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
        variant: "w=1200,h=800,fit=cover,format=auto",
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
        variant: "w=1200,h=800,fit=cover,format=auto",
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

  it("returns continue for non-numeric width values", () => {
    const result = photoAssetResolver(
      new Request("https://example.com/media/photo/test-photo/abc/800"),
    );

    expect(result).toEqual({
      outcome: "continue",
    });
  });

  it("returns continue for non-numeric height values", () => {
    const result = photoAssetResolver(
      new Request("https://example.com/media/photo/test-photo/1200/def"),
    );

    expect(result).toEqual({
      outcome: "continue",
    });
  });
});
