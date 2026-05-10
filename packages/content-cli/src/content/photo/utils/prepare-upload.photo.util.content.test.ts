// packages/content-cli/src/content/photo/utils/prepare-upload.photo.util.content.test.ts

import fs from "node:fs/promises";
import sharp from "sharp";

import { preparePhotoUploadFile } from "@content-cli/content/photo/utils/prepare-upload.photo.util.content";

jest.mock("node:fs/promises");
jest.mock("sharp");

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedSharp = jest.mocked(sharp);

describe("preparePhotoUploadFile", () => {
  const originalBuffer = Buffer.from("original");

  const createSharpPipeline = (buffers: Buffer[]) => {
    let index = 0;

    return {
      rotate: jest.fn().mockReturnThis(),
      jpeg: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockImplementation(async () => {
        const result = buffers[index] ?? buffers[buffers.length - 1];

        index += 1;

        return result;
      }),
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockedFs.readFile.mockResolvedValue(originalBuffer);
  });

  it("returns a prepared upload when the first compression fits", async () => {
    const compressed = Buffer.alloc(10_000_000);

    mockedSharp.mockReturnValue(createSharpPipeline([compressed]) as any);

    const result = await preparePhotoUploadFile("/photos/my-photo.CR3");

    expect(result.fileName).toBe("my-photo.jpg");
    expect(result.mimeType).toBe("image/jpeg");
    expect(result.size).toBe(10_000_000);

    expect(result.buffer).toBeInstanceOf(ArrayBuffer);

    expect(mockedFs.readFile).toHaveBeenCalledWith("/photos/my-photo.CR3");

    expect(mockedSharp).toHaveBeenCalledWith(originalBuffer);
  });

  it("retries compression until the image is below the size limit", async () => {
    const tooLarge = Buffer.alloc(25_000_000);
    const valid = Buffer.alloc(19_000_000);

    const pipeline = createSharpPipeline([tooLarge, tooLarge, valid]);

    mockedSharp.mockReturnValue(pipeline as any);

    const result = await preparePhotoUploadFile("/photos/retry.CR3");

    expect(result.size).toBe(19_000_000);

    expect(pipeline.jpeg).toHaveBeenCalledTimes(3);

    expect(pipeline.jpeg).toHaveBeenNthCalledWith(1, {
      quality: 100,
      mozjpeg: true,
    });

    expect(pipeline.jpeg).toHaveBeenNthCalledWith(2, {
      quality: 99,
      mozjpeg: true,
    });

    expect(pipeline.jpeg).toHaveBeenNthCalledWith(3, {
      quality: 98,
      mozjpeg: true,
    });
  });

  it("throws when the image never reaches the upload limit", async () => {
    const alwaysTooLarge = Buffer.alloc(25_000_000);

    mockedSharp.mockReturnValue(createSharpPipeline([alwaysTooLarge]) as any);

    await expect(preparePhotoUploadFile("/photos/huge.CR3")).rejects.toThrow(
      "Image remains above Cloudflare Images limit after compression: huge.CR3",
    );
  });
});
