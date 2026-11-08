// src/tools/authored-content-generator/prepare/photo/exif/exif.photo.prepare.test.ts

import { readFile } from "node:fs/promises";

import exifr from "exifr";
import sharp from "sharp";

import { extractPhotoExif } from "./exif.photo.prepare";

jest.mock("node:fs/promises", () => ({
  readFile: jest.fn(),
}));

jest.mock("exifr", () => ({
  __esModule: true,
  default: {
    parse: jest.fn(),
  },
}));

jest.mock("sharp", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockedReadFile = jest.mocked(readFile);
const mockedParse = jest.mocked(exifr.parse);
const mockedSharp = jest.mocked(sharp);

describe("Photo EXIF extraction", () => {
  const imagePath = "/photos/epping-forest-fox.jpg";
  const imageBuffer = Buffer.from("test-image-data");

  const metadata = jest.fn();

  const setExif = (value: Record<string, unknown> | undefined): void => {
    mockedParse.mockResolvedValue(value);
  };

  beforeEach(() => {
    jest.resetAllMocks();

    metadata.mockResolvedValue({
      width: 6000,
      height: 4000,
    });

    mockedSharp.mockReturnValue({
      metadata,
    } as never);

    mockedReadFile.mockResolvedValue(imageBuffer);

    setExif({});
  });

  describe("Image processing", () => {
    it("reads image dimensions using Sharp", async () => {
      const result = await extractPhotoExif(imagePath);

      expect(mockedSharp).toHaveBeenCalledWith(imagePath);
      expect(metadata).toHaveBeenCalledTimes(1);

      expect(result.width).toBe(6000);
      expect(result.height).toBe(4000);
    });

    it("reads the image as a Buffer", async () => {
      await extractPhotoExif(imagePath);

      expect(mockedReadFile).toHaveBeenCalledWith(imagePath);
      expect(mockedReadFile).toHaveBeenCalledTimes(1);
    });

    it("parses EXIF with the expected configuration", async () => {
      await extractPhotoExif(imagePath);

      expect(mockedParse).toHaveBeenCalledWith(imageBuffer, {
        gps: true,
        tiff: true,
        exif: true,
        mergeOutput: true,
        reviveValues: false,
        xmp: false,
        icc: false,
      });
    });

    it.each([
      [{ width: undefined, height: 4000 }],
      [{ width: 6000, height: undefined }],
      [{ width: 0, height: 4000 }],
      [{ width: 6000, height: 0 }],
    ])("rejects missing or zero dimensions", async (dimensions) => {
      metadata.mockResolvedValue(dimensions);

      await expect(extractPhotoExif(imagePath)).rejects.toThrow(
        `Unable to determine image dimensions: ${imagePath}`,
      );

      expect(mockedParse).not.toHaveBeenCalled();
    });

    it("propagates Sharp metadata failures", async () => {
      const error = new Error("Invalid image");

      metadata.mockRejectedValue(error);

      await expect(extractPhotoExif(imagePath)).rejects.toBe(error);
    });

    it("propagates filesystem failures", async () => {
      const error = new Error("File not found");

      mockedReadFile.mockRejectedValue(error);

      await expect(extractPhotoExif(imagePath)).rejects.toBe(error);
    });

    it("propagates EXIF parser failures", async () => {
      const error = new Error("EXIF parsing failed");

      mockedParse.mockRejectedValue(error);

      await expect(extractPhotoExif(imagePath)).rejects.toBe(error);
    });
  });

  describe("Complete EXIF extraction", () => {
    it("extracts all supported EXIF fields", async () => {
      setExif({
        DateTimeOriginal: "2026:10:15 07:32:09",
        OffsetTimeOriginal: "+03:00",
        Artist: "Kevin Ellen",
        Copyright: "© Kevin Ellen",
        Make: "Canon",
        Model: "Canon EOS R7",
        LensModel: "RF100-500mm F4.5-7.1 L IS USM",
        ExposureTime: 0.001,
        FNumber: 7.1,
        ISO: 1600,
        FocalLength: 500,
        FocalLengthIn35mmFormat: 800,
        latitude: 59.1234,
        longitude: 25.5678,
      });

      const result = await extractPhotoExif(imagePath);

      expect(result).toEqual({
        capturedAt: "2026-10-15T07:32:09",
        capturedAtOffset: "+03:00",
        photographer: "Kevin Ellen",
        copyright: "© Kevin Ellen",
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
        latitude: 59.1234,
        longitude: 25.5678,
      });
    });

    it("returns null for absent EXIF fields", async () => {
      setExif(undefined);

      const result = await extractPhotoExif(imagePath);

      expect(result).toEqual({
        capturedAt: null,
        capturedAtOffset: null,
        photographer: null,
        copyright: null,
        cameraMake: null,
        cameraModel: null,
        lensModel: null,
        exposureTime: null,
        aperture: null,
        iso: null,
        focalLength: null,
        focalLength35mm: null,
        width: 6000,
        height: 4000,
        latitude: null,
        longitude: null,
      });
    });
  });

  describe("Date handling", () => {
    it("converts EXIF local timestamps to ISO-like format", async () => {
      setExif({
        DateTimeOriginal: "2026:01:03 04:05:06",
      });

      const result = await extractPhotoExif(imagePath);

      expect(result.capturedAt).toBe("2026-01-03T04:05:06");
    });

    it("falls back to CreateDate", async () => {
      setExif({
        CreateDate: "2026:11:04 16:30:00",
      });

      const result = await extractPhotoExif(imagePath);

      expect(result.capturedAt).toBe("2026-11-04T16:30:00");
    });

    it("prefers DateTimeOriginal over CreateDate", async () => {
      setExif({
        DateTimeOriginal: "2026:10:15 07:30:00",
        CreateDate: "2026:10:16 12:00:00",
      });

      const result = await extractPhotoExif(imagePath);

      expect(result.capturedAt).toBe("2026-10-15T07:30:00");
    });

    it.each([
      "",
      "not-a-date",
      "2026-11-04T16:30:00",
      "2026:11:04",
      123456,
      null,
    ])("rejects invalid EXIF date %s", async (value) => {
      setExif({
        DateTimeOriginal: value,
      });

      const result = await extractPhotoExif(imagePath);

      expect(result.capturedAt).toBeNull();
    });

    it("trims whitespace around valid EXIF dates", async () => {
      setExif({
        DateTimeOriginal: " 2026:11:04 16:30:00 ",
      });

      const result = await extractPhotoExif(imagePath);

      expect(result.capturedAt).toBe("2026-11-04T16:30:00");
    });
  });

  describe("String metadata", () => {
    it("trims whitespace from string values", async () => {
      setExif({
        Artist: "  Kevin Ellen  ",
        Make: "  Canon  ",
        Model: "  Canon EOS R7  ",
        Copyright: "  Copyright 2026  ",
        LensModel: "  RF 100-500mm  ",
        OffsetTimeOriginal: "  +01:00  ",
      });

      const result = await extractPhotoExif(imagePath);

      expect(result.photographer).toBe("Kevin Ellen");
      expect(result.cameraMake).toBe("Canon");
      expect(result.cameraModel).toBe("Canon EOS R7");
      expect(result.copyright).toBe("Copyright 2026");
      expect(result.lensModel).toBe("RF 100-500mm");
      expect(result.capturedAtOffset).toBe("+01:00");
    });

    it("falls back to alternative metadata fields", async () => {
      setExif({
        Creator: "Kevin Ellen",
        OffsetTime: "+02:00",
      });

      const result = await extractPhotoExif(imagePath);

      expect(result.photographer).toBe("Kevin Ellen");
      expect(result.capturedAtOffset).toBe("+02:00");
    });

    it("prefers primary metadata fields", async () => {
      setExif({
        Artist: "Primary photographer",
        Creator: "Fallback photographer",
        OffsetTimeOriginal: "+01:00",
        OffsetTime: "+02:00",
      });

      const result = await extractPhotoExif(imagePath);

      expect(result.photographer).toBe("Primary photographer");
      expect(result.capturedAtOffset).toBe("+01:00");
    });

    it.each(["", "   ", 123, false, {}])(
      "returns null for invalid string metadata %s",
      async (value) => {
        setExif({
          Artist: value,
          Make: value,
          Model: value,
          LensModel: value,
          Copyright: value,
          OffsetTimeOriginal: value,
        });

        const result = await extractPhotoExif(imagePath);

        expect(result.photographer).toBeNull();
        expect(result.cameraMake).toBeNull();
        expect(result.cameraModel).toBeNull();
        expect(result.lensModel).toBeNull();
        expect(result.copyright).toBeNull();
        expect(result.capturedAtOffset).toBeNull();
      },
    );
  });

  describe("Numeric metadata", () => {
    it("preserves valid numeric metadata", async () => {
      setExif({
        ExposureTime: 0.002,
        FNumber: 5.6,
        ISO: 800,
        FocalLength: 400,
        FocalLengthIn35mmFormat: 640,
        latitude: 51.65,
        longitude: -0.07,
      });

      const result = await extractPhotoExif(imagePath);

      expect(result.exposureTime).toBe(0.002);
      expect(result.aperture).toBe(5.6);
      expect(result.iso).toBe(800);
      expect(result.focalLength).toBe(400);
      expect(result.focalLength35mm).toBe(640);
      expect(result.latitude).toBe(51.65);
      expect(result.longitude).toBe(-0.07);
    });

    it("preserves zero numeric values", async () => {
      setExif({
        ExposureTime: 0,
        FNumber: 0,
        ISO: 0,
        FocalLength: 0,
        FocalLengthIn35mmFormat: 0,
        latitude: 0,
        longitude: 0,
      });

      const result = await extractPhotoExif(imagePath);

      expect(result.exposureTime).toBe(0);
      expect(result.aperture).toBe(0);
      expect(result.iso).toBe(0);
      expect(result.focalLength).toBe(0);
      expect(result.focalLength35mm).toBe(0);
      expect(result.latitude).toBe(0);
      expect(result.longitude).toBe(0);
    });

    it.each([NaN, Infinity, -Infinity, "800", null, undefined])(
      "rejects invalid numeric metadata %s",
      async (value) => {
        setExif({
          ExposureTime: value,
          FNumber: value,
          ISO: value,
          FocalLength: value,
          FocalLengthIn35mmFormat: value,
          latitude: value,
          longitude: value,
        });

        const result = await extractPhotoExif(imagePath);

        expect(result.exposureTime).toBeNull();
        expect(result.aperture).toBeNull();
        expect(result.iso).toBeNull();
        expect(result.focalLength).toBeNull();
        expect(result.focalLength35mm).toBeNull();
        expect(result.latitude).toBeNull();
        expect(result.longitude).toBeNull();
      },
    );
  });
});
