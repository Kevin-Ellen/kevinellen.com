// src/request/pre-request/assets/photo/config/config.photo-assets.pre-request.request.test.ts

import {
  DEFAULT_PHOTO_VARIANT,
  PHOTO_ASSET_PATH_PATTERN,
} from "@request/pre-request/assets/photo/config/config.photo-assets.pre-request.request";

describe("PHOTO_ASSET_PATH_PATTERN", () => {
  it("matches a base photo asset path", () => {
    const match = "/media/photo/test-photo".match(PHOTO_ASSET_PATH_PATTERN);

    expect(match).not.toBeNull();
    expect(Array.from(match as RegExpMatchArray)).toEqual([
      "/media/photo/test-photo",
      "test-photo",
      undefined,
      undefined,
    ]);
  });

  it("matches a photo asset path with width and height", () => {
    const match = "/media/photo/test-photo/1200/800".match(
      PHOTO_ASSET_PATH_PATTERN,
    );

    expect(match).not.toBeNull();
    expect(Array.from(match as RegExpMatchArray)).toEqual([
      "/media/photo/test-photo/1200/800",
      "test-photo",
      "1200",
      "800",
    ]);
  });

  it("does not match unrelated paths", () => {
    expect("/journal/test".match(PHOTO_ASSET_PATH_PATTERN)).toBeNull();
  });

  it("does not match incomplete dimension paths", () => {
    expect(
      "/media/photo/test-photo/1200".match(PHOTO_ASSET_PATH_PATTERN),
    ).toBeNull();
  });

  it("does not match paths with extra segments", () => {
    expect(
      "/media/photo/test-photo/1200/800/extra".match(PHOTO_ASSET_PATH_PATTERN),
    ).toBeNull();
  });
});

describe("DEFAULT_PHOTO_VARIANT", () => {
  it("defaults to the public variant", () => {
    expect(DEFAULT_PHOTO_VARIANT).toBe("public");
  });
});
