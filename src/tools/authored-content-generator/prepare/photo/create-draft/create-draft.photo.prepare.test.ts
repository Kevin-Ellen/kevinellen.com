// src/tools/authored-content-generator/prepare/photo/create-draft/create-draft.photo.prepare.test.ts

import type { ExtractedPhotoExif } from "../exif/exif.photo.prepare";
import type { PhotoResolvedLocationAuthored } from "../../../../../content-schema/assets/photo/photo.asset.content-schema.authored.type";

import { personConfigAuthored } from "../../../../../shared/config/person.config.shared.authored";
import { resolvePhotoTimezone } from "../location/location.photo.prepare";

import {
  createDraftPhotoMetadata,
  toPhotoId,
  toTitleFromFileName,
} from "./create-draft.photo.prepare";

jest.mock("../location/location.photo.prepare", () => ({
  resolvePhotoTimezone: jest.fn(),
}));

const mockedResolvePhotoTimezone = jest.mocked(resolvePhotoTimezone);

describe("Draft photo metadata", () => {
  const sourceFileName = "Epping-Forest-Fox.jpg";

  const createExif = (
    overrides: Partial<ExtractedPhotoExif> = {},
  ): ExtractedPhotoExif => ({
    capturedAt: "2026-07-15T12:30:45",
    capturedAtOffset: "+01:00",

    photographer: "Kevin Ellen",
    copyright: null,

    cameraMake: "Canon",
    cameraModel: "Canon EOS R7",
    lensModel: "RF100-500mm F4.5-7.1 L IS USM",

    exposureTime: 0.001,
    aperture: 7.1,
    iso: 1600,

    focalLength: 500,
    focalLength35mm: 800,

    width: 6000,
    height: 4000,

    latitude: 51.65,
    longitude: 0.06,

    ...overrides,
  });

  const createDraft = (
    overrides: Partial<ExtractedPhotoExif> = {},
    location: PhotoResolvedLocationAuthored | null = null,
    fileName = sourceFileName,
  ) => createDraftPhotoMetadata(fileName, createExif(overrides), location);

  beforeEach(() => {
    jest.resetAllMocks();
    mockedResolvePhotoTimezone.mockReturnValue("Europe/London");
  });

  describe("Photo ID generation", () => {
    it.each([
      ["Epping-Forest-Fox.jpg", "epping-forest-fox"],
      ["Wood Pigeon In Flight.CR3", "wood-pigeon-in-flight"],
      ["  Red_Fox  .jpg", "red-fox"],
      ["Robin's Breakfast.jpg", "robins-breakfast"],
      ["Robin’s Breakfast.jpg", "robins-breakfast"],
      ["FOX___IN---FOREST.jpg", "fox-in-forest"],
      ["---Fox---.jpg", "fox"],
      ["Cattle Egret (2026).jpg", "cattle-egret-2026"],
      ["12345.jpg", "12345"],
      ["!!!.jpg", ""],
    ])("converts %s into ID %s", (input, expected) => {
      expect(toPhotoId(input)).toBe(expected);
    });

    it("removes directory paths and extensions", () => {
      expect(toPhotoId("/photographs/wildlife/Red Fox.CR3")).toBe("red-fox");
    });
  });

  describe("Photo title generation", () => {
    it.each([
      ["epping-forest-fox.jpg", "Epping Forest Fox"],
      ["wood_pigeon_in_flight.CR3", "Wood Pigeon In Flight"],
      ["red---fox.jpg", "Red Fox"],
      ["  robin   in   woodland.jpg", "Robin In Woodland"],
      ["CANON_R7.jpg", "CANON R7"],
      ["fox.jpg", "Fox"],
    ])("converts %s into title %s", (input, expected) => {
      expect(toTitleFromFileName(input)).toBe(expected);
    });
  });

  describe("Required metadata", () => {
    it("rejects filenames without a valid photo ID", () => {
      expect(() => createDraft({}, null, "!!!.jpg")).toThrow(
        "Cannot derive photo ID from !!!.jpg",
      );
    });

    it.each([null, ""])("rejects missing capture date %s", (capturedAt) => {
      expect(() => createDraft({ capturedAt })).toThrow(
        `Missing EXIF capture date in ${sourceFileName}`,
      );
    });

    it.each([
      ["exposureTime", "ExposureTime"],
      ["aperture", "FNumber"],
      ["iso", "ISO"],
      ["focalLength", "FocalLength"],
    ] as const)("rejects missing %s", (field, exifName) => {
      expect(() =>
        createDraft({
          [field]: null,
        }),
      ).toThrow(
        `Missing required EXIF field "${exifName}" in ${sourceFileName}`,
      );
    });

    it("preserves zero values for required numeric fields", () => {
      const result = createDraft({
        exposureTime: 0,
        aperture: 0,
        iso: 0,
        focalLength: 0,
      });

      expect(result.exposureTime).toBe(0);
      expect(result.aperture).toBe(0);
      expect(result.iso).toBe(0);
      expect(result.focalLength).toBe(0);
    });
  });

  describe("Authored metadata generation", () => {
    it("generates complete draft metadata", () => {
      const result = createDraft();

      expect(result).toEqual({
        id: "epping-forest-fox",
        sourceFileName,

        cloudflareImageId: null,
        cloudflareUploadedAt: null,

        title: "Epping Forest Fox",
        alt: "__REQUIRED__",
        commentary: "__REQUIRED__",
        readableLocation: "__REQUIRED__",

        capturedAt: {
          utc: "2026-07-15T11:30:45.000Z",
          timezone: "Europe/London",
        },

        photographer: "Kevin Ellen",
        copyright: `© 2026 ${personConfigAuthored.name}`,

        cameraMake: "Canon",
        cameraModel: "Canon EOS R7",
        lensModel: "RF100-500mm F4.5-7.1 L IS USM",

        exposureTime: 0.001,
        aperture: 7.1,
        iso: 1600,

        focalLength: 500,
        focalLength35mm: 800,

        width: 6000,
        height: 4000,

        latitude: 51.65,
        longitude: 0.06,

        resolvedLocation: null,
      });
    });

    it("uses resolved location information", () => {
      const location = {
        displayName: "Epping Forest, Essex",
      } as unknown as PhotoResolvedLocationAuthored;

      const result = createDraft({}, location);

      expect(result.readableLocation).toBe("Epping Forest, Essex");

      expect(result.resolvedLocation).toBe(location);
    });

    it("uses configured photographer when EXIF author is missing", () => {
      const result = createDraft({
        photographer: null,
      });

      expect(result.photographer).toBe(personConfigAuthored.name);
    });

    it("uses placeholders for missing camera metadata", () => {
      const result = createDraft({
        cameraMake: null,
        cameraModel: null,
        lensModel: null,
      });

      expect(result.cameraMake).toBe("__REQUIRED__");
      expect(result.cameraModel).toBe("__REQUIRED__");
      expect(result.lensModel).toBeNull();
    });

    it("preserves optional focal length metadata", () => {
      const result = createDraft({
        focalLength35mm: null,
      });

      expect(result.focalLength35mm).toBeNull();
    });

    it("uses capture year for copyright", () => {
      const result = createDraft({
        capturedAt: "2024-01-15T12:00:00",
      });

      expect(result.copyright).toBe(`© 2024 ${personConfigAuthored.name}`);
    });

    it("uses the configured copyright owner regardless of EXIF copyright", () => {
      const result = createDraft({
        copyright: "Different copyright",
      });

      expect(result.copyright).toBe(`© 2026 ${personConfigAuthored.name}`);
    });

    it("resolves timezone using EXIF coordinates", () => {
      createDraft();

      expect(mockedResolvePhotoTimezone).toHaveBeenCalledWith(51.65, 0.06);
      expect(mockedResolvePhotoTimezone).toHaveBeenCalledTimes(1);
    });

    it("passes missing GPS coordinates to timezone resolution", () => {
      createDraft({
        latitude: null,
        longitude: null,
      });

      expect(mockedResolvePhotoTimezone).toHaveBeenCalledWith(null, null);
    });
  });

  describe("Explicit camera timezone offsets", () => {
    it("converts positive offsets to UTC", () => {
      const result = createDraft({
        capturedAt: "2026-07-15T12:30:45",
        capturedAtOffset: "+01:00",
      });

      expect(result.capturedAt.utc).toBe("2026-07-15T11:30:45.000Z");
    });

    it("converts negative offsets to UTC", () => {
      const result = createDraft({
        capturedAt: "2026-07-15T12:30:45",
        capturedAtOffset: "-04:00",
      });

      expect(result.capturedAt.utc).toBe("2026-07-15T16:30:45.000Z");
    });

    it("handles UTC offsets", () => {
      const result = createDraft({
        capturedAtOffset: "+00:00",
      });

      expect(result.capturedAt.utc).toBe("2026-07-15T12:30:45.000Z");
    });

    it("prioritises camera offset over location timezone", () => {
      mockedResolvePhotoTimezone.mockReturnValue("Asia/Tokyo");

      const result = createDraft({
        capturedAtOffset: "+01:00",
      });

      expect(result.capturedAt.utc).toBe("2026-07-15T11:30:45.000Z");

      expect(result.capturedAt.timezone).toBe("Asia/Tokyo");
    });

    it("resolves UTC with an offset even when timezone is unavailable", () => {
      mockedResolvePhotoTimezone.mockReturnValue(null);

      const result = createDraft({
        capturedAtOffset: "+01:00",
      });

      expect(result.capturedAt.utc).toBe("2026-07-15T11:30:45.000Z");

      expect(result.capturedAt.timezone).toBeNull();
    });

    it.each(["01:00", "UTC", "+15:00", "+01:60", "+1:00", "", "invalid"])(
      "rejects invalid timezone offset %s",
      (offset) => {
        expect(() =>
          createDraft({
            capturedAtOffset: offset,
          }),
        ).toThrow(`Invalid EXIF timezone offset: ${offset}`);
      },
    );

    it("rejects invalid capture timestamps", () => {
      expect(() =>
        createDraft({
          capturedAt: "not-a-date",
        }),
      ).toThrow("Invalid EXIF capture date: not-a-date");
    });
  });

  describe("IANA timezone resolution", () => {
    beforeEach(() => {
      mockedResolvePhotoTimezone.mockReturnValue("Europe/London");
    });

    it("resolves winter GMT timestamps", () => {
      const result = createDraft({
        capturedAt: "2026-01-15T12:30:45",
        capturedAtOffset: null,
      });

      expect(result.capturedAt.utc).toBe("2026-01-15T12:30:45.000Z");
    });

    it("resolves summer BST timestamps", () => {
      const result = createDraft({
        capturedAt: "2026-07-15T12:30:45",
        capturedAtOffset: null,
      });

      expect(result.capturedAt.utc).toBe("2026-07-15T11:30:45.000Z");
    });

    it("resolves timestamps in another IANA timezone", () => {
      mockedResolvePhotoTimezone.mockReturnValue("Asia/Tokyo");

      const result = createDraft({
        capturedAt: "2026-07-15T12:30:45",
        capturedAtOffset: null,
      });

      expect(result.capturedAt.utc).toBe("2026-07-15T03:30:45.000Z");
    });

    it("rejects missing timezone and offset", () => {
      mockedResolvePhotoTimezone.mockReturnValue(null);

      expect(() =>
        createDraft({
          capturedAtOffset: null,
        }),
      ).toThrow(
        "Cannot resolve UTC capture time without an offset or timezone: 2026-07-15T12:30:45",
      );
    });

    it("rejects ambiguous autumn DST capture times", () => {
      expect(() =>
        createDraft({
          capturedAt: "2026-10-25T01:30:00",
          capturedAtOffset: null,
        }),
      ).toThrow(
        "Ambiguous or nonexistent local capture time: 2026-10-25T01:30:00 (Europe/London)",
      );
    });

    it("rejects nonexistent spring DST capture times", () => {
      expect(() =>
        createDraft({
          capturedAt: "2026-03-29T01:30:00",
          capturedAtOffset: null,
        }),
      ).toThrow(
        "Ambiguous or nonexistent local capture time: 2026-03-29T01:30:00 (Europe/London)",
      );
    });

    it("accepts a valid timestamp before the spring transition", () => {
      const result = createDraft({
        capturedAt: "2026-03-29T00:30:00",
        capturedAtOffset: null,
      });

      expect(result.capturedAt.utc).toBe("2026-03-29T00:30:00.000Z");
    });

    it("accepts a valid timestamp after the spring transition", () => {
      const result = createDraft({
        capturedAt: "2026-03-29T02:30:00",
        capturedAtOffset: null,
      });

      expect(result.capturedAt.utc).toBe("2026-03-29T01:30:00.000Z");
    });
  });
});
