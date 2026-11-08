// src/tools/authored-content-generator/publish/photo/photo.publish.test.ts

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { PhotoAppInit } from "../../../../shared/types/assets/photo.asset.shared.app-init.type";
import { prepareImageForUpload } from "./prepare.photo.publish";
import { publishPhoto } from "./photo.publish";
jest.mock("node:fs/promises", () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
}));
jest.mock("./prepare.photo.publish", () => ({
  prepareImageForUpload: jest.fn(),
}));
const mockedReadFile = jest.mocked(readFile);
const mockedWriteFile = jest.mocked(writeFile);
const mockedPrepareImage = jest.mocked(prepareImageForUpload);
describe("Photo publishing", () => {
  const directory = "/authored-content/journals/example";
  const photoId = "forest-fox";
  const artifactPath = resolve(
    directory,
    "artifacts",
    `${photoId}.app-init.json`,
  );
  const checkpointPath = resolve(
    directory,
    "artifacts",
    `${photoId}.upload.json`,
  );
  const imagePath = resolve(directory, "photos", "forest-fox.cr3");
  const imageBuffer = Buffer.from("prepared-image");
  const uploaded = {
    id: "cloudflare-new-image",
    uploadedAt: "2026-11-04T12:00:00.000Z",
  };
  const createPhoto = (overrides: Record<string, unknown> = {}): PhotoAppInit =>
    ({
      id: photoId,
      sourceFileName: "forest-fox.cr3",
      title: "Fox in Epping Forest",
      cloudflareImageId: null,
      cloudflareUploadedAt: null,
      ...overrides,
    }) as PhotoAppInit;
  type Publisher = Parameters<typeof publishPhoto>[0]["publisher"];
  let artifact: PhotoAppInit;
  let storedPhoto: PhotoAppInit | null;
  let publisher: {
    getPhoto: jest.MockedFunction<Publisher["getPhoto"]>;
    putPhoto: jest.MockedFunction<Publisher["putPhoto"]>;
    uploadImage: jest.MockedFunction<Publisher["uploadImage"]>;
  };
  let logSpy: jest.SpiedFunction<typeof console.log>;
  const publish = (replaceImage = false) =>
    publishPhoto({
      directory,
      photoId,
      publisher,
      replaceImage,
    });
  const mockCheckpoint = (checkpoint: unknown): void => {
    mockedReadFile.mockImplementation(async (filePath) => {
      if (String(filePath) === artifactPath) {
        return JSON.stringify(artifact);
      }
      if (String(filePath) === checkpointPath) {
        return JSON.stringify(checkpoint);
      }
      throw new Error(`Unexpected file: ${String(filePath)}`);
    });
  };
  const expectNoUpload = (): void => {
    expect(mockedPrepareImage).not.toHaveBeenCalled();
    expect(publisher.uploadImage).not.toHaveBeenCalled();
    expect(mockedWriteFile).not.toHaveBeenCalled();
  };
  beforeEach(() => {
    jest.resetAllMocks();
    artifact = createPhoto();
    storedPhoto = null;
    mockedReadFile.mockImplementation(async (filePath) => {
      if (String(filePath) === artifactPath) {
        return JSON.stringify(artifact);
      }
      if (String(filePath) === checkpointPath) {
        throw Object.assign(new Error("File not found"), {
          code: "ENOENT",
        });
      }
      throw new Error(`Unexpected file: ${String(filePath)}`);
    });
    mockedWriteFile.mockResolvedValue(undefined);
    mockedPrepareImage.mockResolvedValue(imageBuffer);
    publisher = {
      getPhoto: jest.fn<
        ReturnType<Publisher["getPhoto"]>,
        Parameters<Publisher["getPhoto"]>
      >(async (_id) => storedPhoto),
      putPhoto: jest.fn<
        ReturnType<Publisher["putPhoto"]>,
        Parameters<Publisher["putPhoto"]>
      >(async (photo) => {
        storedPhoto = photo;
      }),
      uploadImage: jest.fn<
        ReturnType<Publisher["uploadImage"]>,
        Parameters<Publisher["uploadImage"]>
      >(async (_photo, _image) => uploaded),
    };
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });
  afterEach(() => {
    logSpy.mockRestore();
  });
  describe("Photo artifact", () => {
    it("reads the validated photo artifact", async () => {
      await publish();
      expect(mockedReadFile).toHaveBeenCalledWith(artifactPath, "utf8");
    });
    it("rejects an artifact with a mismatched ID", async () => {
      artifact = createPhoto({
        id: "different-photo",
      });
      await expect(publish()).rejects.toThrow(
        `Photo artifact ID mismatch: ${photoId}`,
      );
      expect(publisher.getPhoto).not.toHaveBeenCalled();
      expect(publisher.putPhoto).not.toHaveBeenCalled();
    });

    it.each([
      ["null root", null],
      ["array root", []],
      ["primitive root", "invalid"],
      ["missing ID", { sourceFileName: "forest-fox.cr3" }],
      ["numeric ID", { id: 123, sourceFileName: "forest-fox.cr3" }],
    ])(
      "rejects invalid photo artifact identity: %s",
      async (_scenario, value) => {
        mockedReadFile.mockResolvedValue(JSON.stringify(value));

        await expect(publish()).rejects.toThrow(
          `Photo artifact ID mismatch: ${photoId}`,
        );

        expect(publisher.getPhoto).not.toHaveBeenCalled();
        expect(publisher.putPhoto).not.toHaveBeenCalled();
      },
    );

    it.each([
      ["missing source filename", { id: photoId }],
      ["null source filename", { id: photoId, sourceFileName: null }],
      ["numeric source filename", { id: photoId, sourceFileName: 123 }],
      ["empty source filename", { id: photoId, sourceFileName: "" }],
    ])(
      "rejects invalid photo artifact source: %s",
      async (_scenario, value) => {
        mockedReadFile.mockResolvedValue(JSON.stringify(value));

        await expect(publish()).rejects.toThrow(
          `Invalid photo artifact: ${photoId}`,
        );

        expect(publisher.getPhoto).not.toHaveBeenCalled();
        expect(publisher.uploadImage).not.toHaveBeenCalled();
      },
    );

    it("propagates artifact read failures", async () => {
      const error = new Error("Artifact unavailable");
      mockedReadFile.mockRejectedValue(error);
      await expect(publish()).rejects.toBe(error);
      expect(publisher.getPhoto).not.toHaveBeenCalled();
      expect(publisher.uploadImage).not.toHaveBeenCalled();
    });
    it("rejects malformed artifact JSON", async () => {
      mockedReadFile.mockResolvedValue("{invalid");
      await expect(publish()).rejects.toThrow(SyntaxError);
      expect(publisher.getPhoto).not.toHaveBeenCalled();
    });
  });
  describe("Fresh image upload", () => {
    it("prepares and uploads an image when no upload exists", async () => {
      const result = await publish();
      expect(mockedPrepareImage).toHaveBeenCalledWith(imagePath);
      expect(publisher.uploadImage).toHaveBeenCalledWith(artifact, imageBuffer);
      expect(result.cloudflareImageId).toBe(uploaded.id);
      expect(result.cloudflareUploadedAt).toBe(uploaded.uploadedAt);
    });
    it("writes an upload checkpoint before updating KV", async () => {
      await publish();
      expect(mockedWriteFile).toHaveBeenCalledWith(
        checkpointPath,
        `${JSON.stringify(uploaded, null, 2)}\n`,
        "utf8",
      );
      expect(mockedWriteFile).toHaveBeenCalledTimes(1);
      expect(mockedWriteFile.mock.invocationCallOrder[0]).toBeLessThan(
        publisher.putPhoto.mock.invocationCallOrder[0],
      );
    });
    it("logs a successful image upload", async () => {
      await publish();
      expect(logSpy).toHaveBeenCalledWith(`✓ Image uploaded: ${photoId}`);
    });
    it.each([
      {
        id: "",
        uploadedAt: "2026-11-04T12:00:00.000Z",
      },
      {
        id: "cloudflare-image",
        uploadedAt: "",
      },
    ])("rejects incomplete upload metadata %#", async (result) => {
      publisher.uploadImage.mockResolvedValue(result);
      await expect(publish()).rejects.toThrow(
        `Image upload returned incomplete metadata: ${photoId}`,
      );
      expect(mockedWriteFile).not.toHaveBeenCalled();
      expect(publisher.putPhoto).not.toHaveBeenCalled();
    });
    it("propagates image preparation failures", async () => {
      const error = new Error("Image preparation failed");
      mockedPrepareImage.mockRejectedValue(error);
      await expect(publish()).rejects.toBe(error);
      expect(publisher.uploadImage).not.toHaveBeenCalled();
      expect(mockedWriteFile).not.toHaveBeenCalled();
      expect(publisher.putPhoto).not.toHaveBeenCalled();
    });
    it("propagates image upload failures", async () => {
      const error = new Error("Cloudflare Images unavailable");
      publisher.uploadImage.mockRejectedValue(error);
      await expect(publish()).rejects.toBe(error);
      expect(mockedWriteFile).not.toHaveBeenCalled();
      expect(publisher.putPhoto).not.toHaveBeenCalled();
    });
    it("does not update KV when checkpoint writing fails", async () => {
      const error = new Error("Checkpoint write failed");
      mockedWriteFile.mockRejectedValue(error);
      await expect(publish()).rejects.toBe(error);
      expect(publisher.uploadImage).toHaveBeenCalledTimes(1);
      expect(publisher.putPhoto).not.toHaveBeenCalled();
    });
  });
  describe("Existing Cloudflare image", () => {
    it("reuses image metadata from KV", async () => {
      storedPhoto = createPhoto({
        cloudflareImageId: "existing-kv-image",
        cloudflareUploadedAt: "2026-10-01T10:00:00.000Z",
      });
      const result = await publish();
      expect(result.cloudflareImageId).toBe("existing-kv-image");
      expect(result.cloudflareUploadedAt).toBe("2026-10-01T10:00:00.000Z");
      expectNoUpload();
      expect(logSpy).toHaveBeenCalledWith(
        `↷ Image already uploaded: ${photoId}`,
      );
    });
    it("falls back to image metadata in the artifact", async () => {
      artifact = createPhoto({
        cloudflareImageId: "existing-artifact-image",
        cloudflareUploadedAt: "2026-10-02T10:00:00.000Z",
      });
      const result = await publish();
      expect(result.cloudflareImageId).toBe("existing-artifact-image");
      expectNoUpload();
    });
    it("prefers existing KV metadata over artifact metadata", async () => {
      artifact = createPhoto({
        cloudflareImageId: "artifact-image",
        cloudflareUploadedAt: "2026-10-02T10:00:00.000Z",
      });
      storedPhoto = createPhoto({
        cloudflareImageId: "kv-image",
        cloudflareUploadedAt: "2026-10-03T10:00:00.000Z",
      });
      const result = await publish();
      expect(result.cloudflareImageId).toBe("kv-image");
      expectNoUpload();
    });
    it("uploads when existing KV metadata is incomplete", async () => {
      storedPhoto = createPhoto({
        cloudflareImageId: "incomplete-image",
        cloudflareUploadedAt: null,
      });
      const result = await publish();
      expect(result.cloudflareImageId).toBe(uploaded.id);
      expect(publisher.uploadImage).toHaveBeenCalledTimes(1);
    });
    it("uploads when artifact metadata is incomplete", async () => {
      artifact = createPhoto({
        cloudflareImageId: "incomplete-image",
        cloudflareUploadedAt: null,
      });
      await publish();
      expect(publisher.uploadImage).toHaveBeenCalledTimes(1);
    });
    it("replaces an existing image when explicitly requested", async () => {
      storedPhoto = createPhoto({
        cloudflareImageId: "existing-image",
        cloudflareUploadedAt: "2026-10-01T10:00:00.000Z",
      });
      const result = await publish(true);
      expect(publisher.uploadImage).toHaveBeenCalledWith(artifact, imageBuffer);
      expect(result.cloudflareImageId).toBe(uploaded.id);
      expect(result.cloudflareUploadedAt).toBe(uploaded.uploadedAt);
    });
    it("replaces artifact image metadata when requested", async () => {
      artifact = createPhoto({
        cloudflareImageId: "artifact-image",
        cloudflareUploadedAt: "2026-10-01T10:00:00.000Z",
      });
      const result = await publish(true);
      expect(publisher.uploadImage).toHaveBeenCalledTimes(1);
      expect(result.cloudflareImageId).toBe(uploaded.id);
    });
    it("defaults to reusing an existing image when replaceImage is omitted", async () => {
      storedPhoto = createPhoto({
        cloudflareImageId: "existing-image",
        cloudflareUploadedAt: "2026-10-01T10:00:00.000Z",
      });
      const result = await publishPhoto({
        directory,
        photoId,
        publisher,
      });
      expect(result.cloudflareImageId).toBe("existing-image");
      expect(mockedPrepareImage).not.toHaveBeenCalled();
      expect(publisher.uploadImage).not.toHaveBeenCalled();
      expect(mockedWriteFile).not.toHaveBeenCalled();
    });
  });
  describe("Upload checkpoints", () => {
    it("reuses a valid upload checkpoint", async () => {
      const checkpoint = {
        id: "checkpoint-image",
        uploadedAt: "2026-10-20T08:00:00.000Z",
      };
      mockCheckpoint(checkpoint);
      const result = await publish();
      expect(result.cloudflareImageId).toBe(checkpoint.id);
      expect(result.cloudflareUploadedAt).toBe(checkpoint.uploadedAt);
      expectNoUpload();
      expect(logSpy).toHaveBeenCalledWith(
        `↷ Reusing image upload checkpoint: ${photoId}`,
      );
    });
    it("prefers a checkpoint over existing KV metadata", async () => {
      storedPhoto = createPhoto({
        cloudflareImageId: "kv-image",
        cloudflareUploadedAt: "2026-10-01T10:00:00.000Z",
      });
      mockCheckpoint({
        id: "checkpoint-image",
        uploadedAt: "2026-10-20T08:00:00.000Z",
      });
      const result = await publish();
      expect(result.cloudflareImageId).toBe("checkpoint-image");
      expectNoUpload();
    });
    it("reuses a checkpoint even with replaceImage enabled", async () => {
      mockCheckpoint({
        id: "checkpoint-image",
        uploadedAt: "2026-10-20T08:00:00.000Z",
      });
      const result = await publish(true);
      expect(result.cloudflareImageId).toBe("checkpoint-image");
      expectNoUpload();
    });
    it.each([
      {},
      { id: "", uploadedAt: "2026-10-20T08:00:00.000Z" },
      { id: "checkpoint-image", uploadedAt: "" },
      { id: "checkpoint-image" },
      { uploadedAt: "2026-10-20T08:00:00.000Z" },
    ])("rejects invalid checkpoint metadata %#", async (checkpoint) => {
      mockCheckpoint(checkpoint);
      await expect(publish()).rejects.toThrow(
        `Invalid image upload checkpoint: ${checkpointPath}`,
      );
      expect(publisher.uploadImage).not.toHaveBeenCalled();
      expect(publisher.putPhoto).not.toHaveBeenCalled();
    });

    it.each([
      ["null root", null],
      ["array root", []],
      ["primitive root", "invalid"],
      ["numeric ID", { id: 123, uploadedAt: "2026-10-20T08:00:00.000Z" }],
      ["null ID", { id: null, uploadedAt: "2026-10-20T08:00:00.000Z" }],
      ["numeric timestamp", { id: "checkpoint-image", uploadedAt: 123 }],
      ["null timestamp", { id: "checkpoint-image", uploadedAt: null }],
    ])("rejects invalid checkpoint shape: %s", async (_scenario, value) => {
      mockCheckpoint(value);

      await expect(publish()).rejects.toThrow(
        `Invalid image upload checkpoint: ${checkpointPath}`,
      );

      expect(publisher.uploadImage).not.toHaveBeenCalled();
      expect(publisher.putPhoto).not.toHaveBeenCalled();
    });

    it.each([null, "EACCES"])(
      "propagates non-Error checkpoint read rejection: %#",
      async (rejection) => {
        mockedReadFile.mockImplementation(async (filePath) => {
          if (String(filePath) === artifactPath) {
            return JSON.stringify(artifact);
          }

          throw rejection;
        });

        await expect(publish()).rejects.toBe(rejection);
        expect(publisher.putPhoto).not.toHaveBeenCalled();
      },
    );

    it("rejects malformed checkpoint JSON", async () => {
      mockedReadFile.mockImplementation(async (filePath) => {
        if (String(filePath) === artifactPath) {
          return JSON.stringify(artifact);
        }
        return "{invalid";
      });
      await expect(publish()).rejects.toThrow(SyntaxError);
      expect(publisher.uploadImage).not.toHaveBeenCalled();
      expect(publisher.putPhoto).not.toHaveBeenCalled();
    });
    it("propagates checkpoint read errors other than ENOENT", async () => {
      const error = Object.assign(new Error("Permission denied"), {
        code: "EACCES",
      });
      mockedReadFile.mockImplementation(async (filePath) => {
        if (String(filePath) === artifactPath) {
          return JSON.stringify(artifact);
        }
        throw error;
      });
      await expect(publish()).rejects.toBe(error);
      expect(publisher.uploadImage).not.toHaveBeenCalled();
      expect(publisher.putPhoto).not.toHaveBeenCalled();
    });
  });
  describe("KV publication and verification", () => {
    it("reads existing metadata before publishing", async () => {
      await publish();
      expect(publisher.getPhoto).toHaveBeenCalledWith(photoId);
      expect(publisher.getPhoto).toHaveBeenCalledTimes(2);
      expect(publisher.getPhoto.mock.invocationCallOrder[0]).toBeLessThan(
        publisher.putPhoto.mock.invocationCallOrder[0],
      );
      expect(publisher.putPhoto.mock.invocationCallOrder[0]).toBeLessThan(
        publisher.getPhoto.mock.invocationCallOrder[1],
      );
    });
    it("writes the completed photo to KV", async () => {
      const result = await publish();
      expect(publisher.putPhoto).toHaveBeenCalledWith({
        ...artifact,
        cloudflareImageId: uploaded.id,
        cloudflareUploadedAt: uploaded.uploadedAt,
      });
      expect(publisher.putPhoto).toHaveBeenCalledTimes(1);
      expect(result).toEqual(storedPhoto);
    });
    it("returns the verified published photograph", async () => {
      const result = await publish();
      expect(result).toEqual({
        ...artifact,
        cloudflareImageId: uploaded.id,
        cloudflareUploadedAt: uploaded.uploadedAt,
      });
      expect(logSpy).toHaveBeenCalledWith(
        `✓ Photo published and verified: ${photoId}`,
      );
    });
    it("rejects missing KV verification results", async () => {
      publisher.getPhoto
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      await expect(publish()).rejects.toThrow(
        `Photo KV verification failed: ${photoId}`,
      );
      expect(publisher.putPhoto).toHaveBeenCalledTimes(1);
    });
    it("rejects different KV metadata after publication", async () => {
      publisher.getPhoto.mockResolvedValueOnce(null).mockResolvedValueOnce(
        createPhoto({
          cloudflareImageId: "different-image",
          cloudflareUploadedAt: uploaded.uploadedAt,
        }),
      );
      await expect(publish()).rejects.toThrow(
        `Photo KV verification failed: ${photoId}`,
      );
    });
    it("rejects KV results with additional fields", async () => {
      publisher.getPhoto.mockResolvedValueOnce(null).mockResolvedValueOnce(
        createPhoto({
          cloudflareImageId: uploaded.id,
          cloudflareUploadedAt: uploaded.uploadedAt,
          unexpectedField: true,
        }),
      );
      await expect(publish()).rejects.toThrow(
        `Photo KV verification failed: ${photoId}`,
      );
    });
    it("propagates initial KV read failures", async () => {
      const error = new Error("KV read unavailable");
      publisher.getPhoto.mockRejectedValue(error);
      await expect(publish()).rejects.toBe(error);
      expect(mockedPrepareImage).not.toHaveBeenCalled();
      expect(publisher.putPhoto).not.toHaveBeenCalled();
    });
    it("propagates KV write failures", async () => {
      const error = new Error("KV write unavailable");
      publisher.putPhoto.mockRejectedValue(error);
      await expect(publish()).rejects.toBe(error);
      expect(mockedWriteFile).toHaveBeenCalledTimes(1);
      expect(logSpy).not.toHaveBeenCalledWith(
        `✓ Photo published and verified: ${photoId}`,
      );
    });
    it("propagates KV verification read failures", async () => {
      const error = new Error("Verification read failed");
      publisher.getPhoto
        .mockResolvedValueOnce(null)
        .mockRejectedValueOnce(error);
      await expect(publish()).rejects.toBe(error);
      expect(publisher.putPhoto).toHaveBeenCalledTimes(1);
    });
    it("does not report success when KV verification fails", async () => {
      publisher.getPhoto
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      await expect(publish()).rejects.toThrow();
      expect(logSpy).not.toHaveBeenCalledWith(
        `✓ Photo published and verified: ${photoId}`,
      );
    });
  });
});
