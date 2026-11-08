// src/tools/authored-content-generator/prepare/photo/photo.prepare.test.ts

import { readdir, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { extractPhotoExif } from "./exif/exif.photo.prepare";
import { resolvePhotoLocation } from "./location/location.photo.prepare";
import {
  createDraftPhotoMetadata,
  toPhotoId,
} from "./create-draft/create-draft.photo.prepare";

import { preparePhotos } from "./photo.prepare";

jest.mock("node:fs/promises", () => ({
  readdir: jest.fn(),
  stat: jest.fn(),
  writeFile: jest.fn(),
}));

jest.mock("./exif/exif.photo.prepare", () => ({
  extractPhotoExif: jest.fn(),
}));

jest.mock("./location/location.photo.prepare", () => ({
  resolvePhotoLocation: jest.fn(),
}));

jest.mock("./create-draft/create-draft.photo.prepare", () => ({
  createDraftPhotoMetadata: jest.fn(),
  toPhotoId: jest.fn(),
}));

const mockedReaddir = jest.mocked(readdir);
const mockedStat = jest.mocked(stat);
const mockedWriteFile = jest.mocked(writeFile);

const mockedExtractPhotoExif = jest.mocked(extractPhotoExif);
const mockedResolvePhotoLocation = jest.mocked(resolvePhotoLocation);
const mockedCreateDraftPhotoMetadata = jest.mocked(createDraftPhotoMetadata);
const mockedToPhotoId = jest.mocked(toPhotoId);

describe("Photo preparation", () => {
  const directory = "/content/journal-example";
  const photosDirectory = resolve(directory, "photos");

  const missingFileError = Object.assign(new Error("File not found"), {
    code: "ENOENT",
  });

  const exif = {
    capturedAt: "2026-11-04T10:30:00",
    capturedAtOffset: "+00:00",
    photographer: "Kevin Ellen",
    copyright: null,
    cameraMake: "Canon",
    cameraModel: "Canon EOS R7",
    lensModel: "RF 100-500mm",
    exposureTime: 0.001,
    aperture: 7.1,
    iso: 800,
    focalLength: 500,
    focalLength35mm: 800,
    width: 6000,
    height: 4000,
    latitude: 51.65,
    longitude: 0.06,
  } as const;

  const draft = {
    id: "forest-fox",
    sourceFileName: "forest-fox.jpg",
    title: "Forest Fox",
  };

  let logSpy: jest.SpiedFunction<typeof console.log>;

  beforeEach(() => {
    jest.resetAllMocks();

    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    // First stat checks the photos directory.
    // Subsequent stat calls check whether draft files exist.
    mockedStat
      .mockResolvedValueOnce({
        isDirectory: () => true,
      } as never)
      .mockRejectedValue(missingFileError);

    mockedReaddir.mockResolvedValue(["forest-fox.jpg"] as never);

    mockedWriteFile.mockResolvedValue(undefined);

    mockedToPhotoId.mockImplementation((fileName) =>
      fileName
        .replace(/\.[^.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-"),
    );

    mockedExtractPhotoExif.mockResolvedValue(exif);
    mockedResolvePhotoLocation.mockResolvedValue(null);

    mockedCreateDraftPhotoMetadata.mockReturnValue(draft as never);
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  describe("Directory validation", () => {
    it("checks the photos directory", async () => {
      await preparePhotos({ directory });

      expect(mockedStat).toHaveBeenNthCalledWith(1, photosDirectory);

      expect(mockedReaddir).toHaveBeenCalledWith(photosDirectory);
    });

    it("rejects a missing photos directory", async () => {
      mockedStat.mockReset();
      mockedStat.mockRejectedValue(missingFileError);

      await expect(preparePhotos({ directory })).rejects.toThrow(
        `Photos directory not found: ${photosDirectory}`,
      );

      expect(mockedReaddir).not.toHaveBeenCalled();
    });

    it("rejects a path that is not a directory", async () => {
      mockedStat.mockReset();

      mockedStat.mockResolvedValue({
        isDirectory: () => false,
      } as never);

      await expect(preparePhotos({ directory })).rejects.toThrow(
        `Photos directory not found: ${photosDirectory}`,
      );
    });

    it("rejects other directory stat failures as missing directories", async () => {
      mockedStat.mockReset();
      mockedStat.mockRejectedValue(new Error("Permission denied"));

      await expect(preparePhotos({ directory })).rejects.toThrow(
        `Photos directory not found: ${photosDirectory}`,
      );
    });

    it("propagates directory listing failures", async () => {
      const error = new Error("Cannot read directory");

      mockedReaddir.mockRejectedValue(error);

      await expect(preparePhotos({ directory })).rejects.toBe(error);
    });
  });

  describe("Photo discovery", () => {
    it.each([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"])(
      "supports %s photographs",
      async (extension) => {
        const fileName = `forest-fox${extension}`;

        mockedReaddir.mockResolvedValue([fileName] as never);

        const result = await preparePhotos({ directory });

        expect(result).toEqual(["forest-fox"]);

        expect(mockedExtractPhotoExif).toHaveBeenCalledWith(
          resolve(photosDirectory, fileName),
        );
      },
    );

    it("accepts uppercase extensions", async () => {
      mockedReaddir.mockResolvedValue([
        "forest-fox.JPG",
        "wood-pigeon.TIFF",
      ] as never);

      const result = await preparePhotos({ directory });

      expect(result).toEqual(["forest-fox", "wood-pigeon"]);
    });

    it("ignores unsupported files", async () => {
      mockedReaddir.mockResolvedValue([
        "forest-fox.jpg",
        "notes.txt",
        "image.CR3",
        ".DS_Store",
        "metadata.json",
      ] as never);

      const result = await preparePhotos({ directory });

      expect(result).toEqual(["forest-fox"]);

      expect(mockedExtractPhotoExif).toHaveBeenCalledTimes(1);
    });

    it("rejects an empty photos directory", async () => {
      mockedReaddir.mockResolvedValue([] as never);

      await expect(preparePhotos({ directory })).rejects.toThrow(
        `No photographs found in ${photosDirectory}`,
      );
    });

    it("rejects directories containing no supported photos", async () => {
      mockedReaddir.mockResolvedValue(["notes.txt", "image.CR3"] as never);

      await expect(preparePhotos({ directory })).rejects.toThrow(
        `No photographs found in ${photosDirectory}`,
      );
    });

    it("processes photographs in alphabetical order", async () => {
      mockedReaddir.mockResolvedValue([
        "zebra.jpg",
        "apple.jpg",
        "middle.jpg",
      ] as never);

      const result = await preparePhotos({ directory });

      expect(result).toEqual(["apple", "middle", "zebra"]);

      expect(mockedExtractPhotoExif).toHaveBeenNthCalledWith(
        1,
        resolve(photosDirectory, "apple.jpg"),
      );

      expect(mockedExtractPhotoExif).toHaveBeenNthCalledWith(
        2,
        resolve(photosDirectory, "middle.jpg"),
      );

      expect(mockedExtractPhotoExif).toHaveBeenNthCalledWith(
        3,
        resolve(photosDirectory, "zebra.jpg"),
      );
    });
  });

  describe("Photo ID validation", () => {
    it("rejects empty photo IDs", async () => {
      mockedToPhotoId.mockReturnValue("");

      await expect(preparePhotos({ directory })).rejects.toThrow(
        "Invalid or duplicate photo ID: ",
      );

      expect(mockedExtractPhotoExif).not.toHaveBeenCalled();
      expect(mockedWriteFile).not.toHaveBeenCalled();
    });

    it("rejects duplicate photo IDs", async () => {
      mockedReaddir.mockResolvedValue([
        "forest-fox.jpg",
        "forest-fox.png",
      ] as never);

      await expect(preparePhotos({ directory })).rejects.toThrow(
        "Invalid or duplicate photo ID: forest-fox",
      );

      expect(mockedExtractPhotoExif).toHaveBeenCalledTimes(1);
      expect(mockedWriteFile).toHaveBeenCalledTimes(1);
    });

    it("derives photo IDs from filenames", async () => {
      await preparePhotos({ directory });

      expect(mockedToPhotoId).toHaveBeenCalledWith("forest-fox.jpg");
    });
  });

  describe("Existing drafts", () => {
    it("skips files with existing drafts", async () => {
      mockedStat.mockReset();

      mockedStat.mockResolvedValue({
        isDirectory: () => true,
      } as never);

      const result = await preparePhotos({ directory });

      expect(result).toEqual(["forest-fox"]);

      expect(mockedStat).toHaveBeenNthCalledWith(
        2,
        resolve(directory, "forest-fox.ts"),
      );

      expect(mockedExtractPhotoExif).not.toHaveBeenCalled();
      expect(mockedResolvePhotoLocation).not.toHaveBeenCalled();
      expect(mockedCreateDraftPhotoMetadata).not.toHaveBeenCalled();
      expect(mockedWriteFile).not.toHaveBeenCalled();

      expect(logSpy).toHaveBeenCalledWith("↷ Photo draft exists: forest-fox");
    });

    it("propagates unexpected draft filesystem errors", async () => {
      const error = Object.assign(new Error("Permission denied"), {
        code: "EACCES",
      });

      mockedStat.mockReset();
      mockedStat
        .mockResolvedValueOnce({
          isDirectory: () => true,
        } as never)
        .mockRejectedValueOnce(error);

      await expect(preparePhotos({ directory })).rejects.toBe(error);

      expect(mockedWriteFile).not.toHaveBeenCalled();
    });

    it("preserves existing drafts while preparing new photos", async () => {
      mockedReaddir.mockResolvedValue([
        "forest-fox.jpg",
        "wood-pigeon.jpg",
      ] as never);

      mockedStat.mockReset();
      mockedStat
        .mockResolvedValueOnce({
          isDirectory: () => true,
        } as never)
        .mockResolvedValueOnce({} as never)
        .mockRejectedValueOnce(missingFileError);

      const result = await preparePhotos({ directory });

      expect(result).toEqual(["forest-fox", "wood-pigeon"]);

      expect(mockedExtractPhotoExif).toHaveBeenCalledTimes(1);

      expect(mockedExtractPhotoExif).toHaveBeenCalledWith(
        resolve(photosDirectory, "wood-pigeon.jpg"),
      );

      expect(mockedWriteFile).toHaveBeenCalledTimes(1);
      expect(mockedWriteFile).toHaveBeenCalledWith(
        resolve(directory, "wood-pigeon.ts"),
        expect.any(String),
        {
          encoding: "utf8",
          flag: "wx",
        },
      );
    });
  });

  describe("Draft generation", () => {
    it("extracts EXIF before resolving photo location", async () => {
      await preparePhotos({ directory });

      expect(mockedExtractPhotoExif).toHaveBeenCalledWith(
        resolve(photosDirectory, "forest-fox.jpg"),
      );

      expect(mockedResolvePhotoLocation).toHaveBeenCalledWith(51.65, 0.06);

      expect(mockedCreateDraftPhotoMetadata).toHaveBeenCalledWith(
        "forest-fox.jpg",
        exif,
        null,
      );
    });

    it("writes a TypeScript authored photo draft", async () => {
      await preparePhotos({ directory });

      const expectedSource = [
        'import type { PhotoAssetAuthored } from "../../../src/content-schema/assets/photo/photo.asset.content-schema.authored.type";',
        "",
        `export const photo = ${JSON.stringify(draft, null, 2)} as const satisfies PhotoAssetAuthored;`,
        "",
      ].join("\n");

      expect(mockedWriteFile).toHaveBeenCalledWith(
        resolve(directory, "forest-fox.ts"),
        expectedSource,
        {
          encoding: "utf8",
          flag: "wx",
        },
      );
    });

    it("logs successfully prepared photographs", async () => {
      await preparePhotos({ directory });

      expect(logSpy).toHaveBeenCalledWith("✓ Prepared photo: forest-fox");
    });

    it("returns the IDs of prepared photographs", async () => {
      const result = await preparePhotos({ directory });

      expect(result).toEqual(["forest-fox"]);
    });

    it("propagates EXIF extraction failures", async () => {
      const error = new Error("Invalid EXIF");

      mockedExtractPhotoExif.mockRejectedValue(error);

      await expect(preparePhotos({ directory })).rejects.toBe(error);

      expect(mockedResolvePhotoLocation).not.toHaveBeenCalled();
      expect(mockedWriteFile).not.toHaveBeenCalled();
    });

    it("propagates location resolution failures", async () => {
      const error = new Error("Location lookup failed");

      mockedResolvePhotoLocation.mockRejectedValue(error);

      await expect(preparePhotos({ directory })).rejects.toBe(error);

      expect(mockedCreateDraftPhotoMetadata).not.toHaveBeenCalled();
      expect(mockedWriteFile).not.toHaveBeenCalled();
    });

    it("propagates metadata generation failures", async () => {
      const error = new Error("Missing required EXIF");

      mockedCreateDraftPhotoMetadata.mockImplementation(() => {
        throw error;
      });

      await expect(preparePhotos({ directory })).rejects.toBe(error);

      expect(mockedWriteFile).not.toHaveBeenCalled();
    });

    it("propagates draft write failures", async () => {
      const error = Object.assign(new Error("File already exists"), {
        code: "EEXIST",
      });

      mockedWriteFile.mockRejectedValue(error);

      await expect(preparePhotos({ directory })).rejects.toBe(error);

      expect(logSpy).not.toHaveBeenCalledWith("✓ Prepared photo: forest-fox");
    });
  });
});
