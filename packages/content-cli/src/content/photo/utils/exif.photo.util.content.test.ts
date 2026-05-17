// packages/content-cli/src/content/photo/utils/exif.photo.util.content.test.ts

import sharp from "sharp";
import exifr from "exifr";

import { extractPhotoExif } from "@content-cli/content/photo/utils/exif.photo.util.content";

jest.mock("sharp");
jest.mock("exifr");

const mockedSharp = jest.mocked(sharp);
const mockedExifrParse = jest.mocked(exifr.parse);

describe("extractPhotoExif", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedSharp.mockReturnValue({
      metadata: jest.fn().mockResolvedValue({
        width: 1200,
        height: 800,
      }),
    } as any);
  });

  it("extracts normalised EXIF and image metadata", async () => {
    mockedExifrParse.mockResolvedValue({
      DateTimeOriginal: new Date("2026-05-10T12:00:00Z"),
      Artist: " Kevin Ellen ",
      Copyright: " Copyright ",
      Make: " Canon ",
      Model: " EOS R7 ",
      LensModel: " RF 100-500 ",
      ExposureTime: 0.001,
      FNumber: 7.1,
      ISO: 800,
      FocalLength: 500,
      FocalLengthIn35mmFormat: 800,
      latitude: 51.7,
      longitude: 0.1,
    });

    await expect(extractPhotoExif("/photo.jpg")).resolves.toEqual({
      capturedAt: "2026-05-10T12:00:00.000Z",
      photographer: "Kevin Ellen",
      copyright: "Copyright",
      cameraMake: "Canon",
      cameraModel: "EOS R7",
      lensModel: "RF 100-500",
      exposureTime: 0.001,
      aperture: 7.1,
      iso: 800,
      focalLength: 500,
      focalLength35mm: 800,
      width: 1200,
      height: 800,
      latitude: 51.7,
      longitude: 0.1,
    });

    expect(mockedSharp).toHaveBeenCalledWith("/photo.jpg");
    expect(mockedExifrParse).toHaveBeenCalledWith("/photo.jpg", {
      gps: true,
      mergeOutput: true,
    });
  });

  it("falls back to CreateDate when DateTimeOriginal is missing", async () => {
    mockedExifrParse.mockResolvedValue({
      CreateDate: "2026-05-10T13:00:00Z",
    });

    const result = await extractPhotoExif("/photo.jpg");

    expect(result.capturedAt).toBe("2026-05-10T13:00:00.000Z");
  });

  it("returns nulls for blank strings, invalid dates, non-finite numbers, and missing EXIF", async () => {
    mockedExifrParse.mockResolvedValue({
      DateTimeOriginal: "not-a-date",
      Artist: "   ",
      Copyright: "",
      Make: null,
      Model: undefined,
      LensModel: 123,
      ExposureTime: Number.NaN,
      FNumber: Infinity,
      ISO: "800",
      FocalLength: null,
      FocalLengthIn35mmFormat: undefined,
      latitude: "51.7",
      longitude: Number.NaN,
    });

    const result = await extractPhotoExif("/photo.jpg");

    expect(result).toMatchObject({
      capturedAt: null,
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
      latitude: null,
      longitude: null,
    });
  });

  it("uses zero dimensions when sharp metadata is missing width or height", async () => {
    mockedSharp.mockReturnValue({
      metadata: jest.fn().mockResolvedValue({}),
    } as any);

    mockedExifrParse.mockResolvedValue(undefined);

    const result = await extractPhotoExif("/photo.jpg");

    expect(result.width).toBe(0);
    expect(result.height).toBe(0);
    expect(result.capturedAt).toBeNull();
  });
});
