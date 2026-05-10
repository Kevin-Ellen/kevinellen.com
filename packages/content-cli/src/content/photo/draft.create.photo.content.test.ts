// packages/content-cli/src/content/photo/draft.create.photo.content.test.ts

import { createDraftPhotoMetadata } from "@content-cli/content/photo/draft.create.photo.content";

import type { ExtractedPhotoExif } from "@content-cli/content/photo/utils/exif.photo.util.content";

const baseExif: ExtractedPhotoExif = {
  capturedAt: "2026-05-10T12:00:00.000Z",

  photographer: "Kevin Ellen",
  copyright: "Kevin Ellen",

  cameraMake: "Canon",
  cameraModel: "EOS R7",
  lensModel: "RF100-500",

  exposureTime: 0.001,
  aperture: 7.1,
  iso: 800,

  focalLength: 500,
  focalLength35mm: 800,

  width: 1000,
  height: 800,

  latitude: 51.1,
  longitude: 0.1,
};

describe("createDraftPhotoMetadata", () => {
  it("creates draft metadata from exif and location", () => {
    const result = createDraftPhotoMetadata("great-egret.jpg", baseExif, {
      displayName: "Epping Forest",
    } as any);

    expect(result.id).toBe("great-egret");
    expect(result.title).toBe("Great Egret");

    expect(result.readableLocation).toBe("Epping Forest");

    expect(result.capturedAt).toEqual({
      utc: "2026-05-10T12:00:00.000Z",
      timezone: null,
    });

    expect(result.alt).toBe("__REQUIRED__");
    expect(result.commentary).toBe("__REQUIRED__");
  });

  it("falls back to placeholders when location is missing", () => {
    const result = createDraftPhotoMetadata(
      "little-ringed-plover.jpg",
      baseExif,
      null,
    );

    expect(result.readableLocation).toBe("__REQUIRED__");
  });

  it("returns null capturedAt when exif date is missing", () => {
    const result = createDraftPhotoMetadata(
      "barn-owl.jpg",
      {
        ...baseExif,
        capturedAt: null,
      },
      null,
    );

    expect(result.capturedAt).toBeNull();
  });

  it("normalises ids correctly", () => {
    const result = createDraftPhotoMetadata(
      "Robin's_Close-Up!!.jpg",
      baseExif,
      null,
    );

    expect(result.id).toBe("robins-close-up");
    expect(result.title).toBe("Robin's Close Up!!");
  });
});
