// src/tools/authored-content-generator/publish/photo/prepare.photo.publish.test.ts

import { readFile } from "node:fs/promises";
import sharp from "sharp";

import { prepareImageForUpload } from "./prepare.photo.publish";

jest.mock("node:fs/promises", () => ({
  readFile: jest.fn(),
}));

jest.mock("sharp", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockedReadFile = jest.mocked(readFile);
const mockedSharp = jest.mocked(sharp);

const mockJpeg = jest.fn();
const mockToBuffer = jest.fn();

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;

describe("Photo upload preparation", () => {
  const imagePath = "/journals/example/photos/forest-fox.jpg";

  const createBuffer = (bytes: number): Buffer<ArrayBuffer> =>
    Buffer.alloc(bytes);

  let logSpy: jest.SpiedFunction<typeof console.log>;

  beforeEach(() => {
    jest.resetAllMocks();

    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    mockedSharp.mockImplementation(
      () =>
        ({
          jpeg: mockJpeg,
        }) as unknown as ReturnType<typeof sharp>,
    );

    mockJpeg.mockImplementation(() => ({
      toBuffer: mockToBuffer,
    }));

    mockToBuffer.mockResolvedValue(createBuffer(MAX_IMAGE_BYTES - 1));
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  describe("Original image handling", () => {
    it("returns an image smaller than 20 MiB unchanged", async () => {
      const original = createBuffer(5 * 1024 * 1024);

      mockedReadFile.mockResolvedValue(original);

      const result = await prepareImageForUpload(imagePath);

      expect(result).toBe(original);

      expect(mockedReadFile).toHaveBeenCalledWith(imagePath);
      expect(mockedSharp).not.toHaveBeenCalled();
      expect(logSpy).not.toHaveBeenCalled();
    });

    it("returns an image exactly 20 MiB unchanged", async () => {
      const original = createBuffer(MAX_IMAGE_BYTES);

      mockedReadFile.mockResolvedValue(original);

      const result = await prepareImageForUpload(imagePath);

      expect(result).toBe(original);
      expect(result.byteLength).toBe(MAX_IMAGE_BYTES);

      expect(mockedSharp).not.toHaveBeenCalled();
    });

    it("returns an empty image buffer unchanged", async () => {
      const original = Buffer.alloc(0);

      mockedReadFile.mockResolvedValue(original);

      const result = await prepareImageForUpload(imagePath);

      expect(result).toBe(original);
      expect(mockedSharp).not.toHaveBeenCalled();
    });

    it("propagates image read failures", async () => {
      const error = new Error("Image file unavailable");

      mockedReadFile.mockRejectedValue(error);

      await expect(prepareImageForUpload(imagePath)).rejects.toBe(error);

      expect(mockedSharp).not.toHaveBeenCalled();
    });
  });

  describe("JPEG optimisation", () => {
    const original = createBuffer(MAX_IMAGE_BYTES + 1);

    beforeEach(() => {
      mockedReadFile.mockResolvedValue(original);
    });

    it("optimises an image exceeding 20 MiB", async () => {
      const optimised = createBuffer(MAX_IMAGE_BYTES - 1);

      mockToBuffer.mockResolvedValue(optimised);

      const result = await prepareImageForUpload(imagePath);

      expect(result).toBe(optimised);

      expect(mockedSharp).toHaveBeenCalledWith(original);
      expect(mockedSharp).toHaveBeenCalledTimes(1);

      expect(mockJpeg).toHaveBeenCalledWith({
        quality: 99,
        mozjpeg: true,
      });

      expect(mockToBuffer).toHaveBeenCalledTimes(1);
    });

    it("accepts an optimised image exactly 20 MiB", async () => {
      const optimised = createBuffer(MAX_IMAGE_BYTES);

      mockToBuffer.mockResolvedValue(optimised);

      const result = await prepareImageForUpload(imagePath);

      expect(result).toBe(optimised);
      expect(mockJpeg).toHaveBeenCalledTimes(1);
    });

    it("starts optimisation at 99% quality", async () => {
      await prepareImageForUpload(imagePath);

      expect(mockJpeg).toHaveBeenNthCalledWith(1, {
        quality: 99,
        mozjpeg: true,
      });
    });

    it("reduces quality until the image fits", async () => {
      const tooLarge = createBuffer(MAX_IMAGE_BYTES + 1);
      const optimised = createBuffer(MAX_IMAGE_BYTES - 1);

      mockToBuffer
        .mockResolvedValueOnce(tooLarge)
        .mockResolvedValueOnce(tooLarge)
        .mockResolvedValueOnce(optimised);

      const result = await prepareImageForUpload(imagePath);

      expect(result).toBe(optimised);

      expect(mockJpeg.mock.calls).toEqual([
        [{ quality: 99, mozjpeg: true }],
        [{ quality: 98, mozjpeg: true }],
        [{ quality: 97, mozjpeg: true }],
      ]);

      expect(mockedSharp).toHaveBeenCalledTimes(3);
      expect(mockToBuffer).toHaveBeenCalledTimes(3);
    });

    it("stops immediately after successful optimisation", async () => {
      const optimised = createBuffer(MAX_IMAGE_BYTES - 1);

      mockToBuffer
        .mockResolvedValueOnce(createBuffer(MAX_IMAGE_BYTES + 1))
        .mockResolvedValueOnce(optimised);

      await prepareImageForUpload(imagePath);

      expect(mockJpeg).toHaveBeenCalledTimes(2);
      expect(mockJpeg).not.toHaveBeenCalledWith({
        quality: 97,
        mozjpeg: true,
      });
    });

    it("accepts an image that only fits at 1% quality", async () => {
      const tooLarge = createBuffer(MAX_IMAGE_BYTES + 1);
      const optimised = createBuffer(MAX_IMAGE_BYTES);

      mockToBuffer.mockImplementation(async () => {
        const quality = mockJpeg.mock.lastCall?.[0] as
          | { quality: number }
          | undefined;

        return quality?.quality === 1 ? optimised : tooLarge;
      });

      const result = await prepareImageForUpload(imagePath);

      expect(result).toBe(optimised);
      expect(mockJpeg).toHaveBeenCalledTimes(99);

      expect(mockJpeg).toHaveBeenLastCalledWith({
        quality: 1,
        mozjpeg: true,
      });
    });

    it("throws if no JPEG quality produces an image below 20 MiB", async () => {
      mockToBuffer.mockResolvedValue(createBuffer(MAX_IMAGE_BYTES + 1));

      await expect(prepareImageForUpload(imagePath)).rejects.toThrow(
        `Unable to reduce image below 20 MiB: ${imagePath}`,
      );

      expect(mockJpeg).toHaveBeenCalledTimes(99);

      expect(mockJpeg).toHaveBeenNthCalledWith(1, {
        quality: 99,
        mozjpeg: true,
      });

      expect(mockJpeg).toHaveBeenLastCalledWith({
        quality: 1,
        mozjpeg: true,
      });

      expect(logSpy).not.toHaveBeenCalled();
    });

    it("logs the successful quality and size reduction", async () => {
      const optimised = createBuffer(10 * 1024 * 1024);

      mockToBuffer.mockResolvedValue(optimised);

      await prepareImageForUpload(imagePath);

      expect(logSpy).toHaveBeenCalledWith(
        "✓ Image optimised: 99% quality, 20.00 → 10.00 MiB",
      );

      expect(logSpy).toHaveBeenCalledTimes(1);
    });

    it("logs the actual quality that succeeded", async () => {
      mockToBuffer
        .mockResolvedValueOnce(createBuffer(MAX_IMAGE_BYTES + 1))
        .mockResolvedValueOnce(createBuffer(15 * 1024 * 1024));

      await prepareImageForUpload(imagePath);

      expect(logSpy).toHaveBeenCalledWith(
        "✓ Image optimised: 98% quality, 20.00 → 15.00 MiB",
      );
    });

    it("propagates Sharp encoding failures", async () => {
      const error = new Error("JPEG encoding failed");

      mockToBuffer.mockRejectedValue(error);

      await expect(prepareImageForUpload(imagePath)).rejects.toBe(error);

      expect(mockJpeg).toHaveBeenCalledTimes(1);
      expect(logSpy).not.toHaveBeenCalled();
    });

    it("propagates Sharp initialisation failures", async () => {
      const error = new Error("Unsupported image format");

      mockedSharp.mockImplementation(() => {
        throw error;
      });

      await expect(prepareImageForUpload(imagePath)).rejects.toBe(error);

      expect(mockJpeg).not.toHaveBeenCalled();
    });
  });
});
