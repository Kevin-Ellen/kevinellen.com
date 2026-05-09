// packages/content-cli/src/content/shared/generate-drafts.photo.content.test.ts

import fs from "node:fs/promises";
import path from "node:path";
import { generatePhotoDrafts } from "@content-cli/content/shared/generate-drafts.photo.content";
import type { AuthoredPhotoMetadata } from "@shared-types/media/photo/authored.photo.types";
import type { ContentWorkspaceBucket } from "@content-cli/types/workspace.content-cli.types";

// Mock all dependencies
jest.mock("node:fs/promises");
jest.mock("@content-cli/content/photo/utils/exif.photo.util.content");
jest.mock("@content-cli/content/photo/utils/location.photo.util.content");
jest.mock("@content-cli/content/photo/draft.create.photo.content");
jest.mock("@content-cli/content/photo/render.photo.content");
jest.mock("@content-cli/content/photo/path.photo.content");

import { extractPhotoExif } from "@content-cli/content/photo/utils/exif.photo.util.content";
import { resolvePhotoLocation } from "@content-cli/content/photo/utils/location.photo.util.content";
import { createDraftPhotoMetadata } from "@content-cli/content/photo/draft.create.photo.content";
import { renderPhotoDraftFile } from "@content-cli/content/photo/render.photo.content";
import { getPhotoMetadataFilePath } from "@content-cli/content/photo/path.photo.content";

const mockFs = fs as jest.Mocked<typeof fs>;
const mockExtractExif = extractPhotoExif as jest.MockedFunction<
  typeof extractPhotoExif
>;
const mockResolveLocation = resolvePhotoLocation as jest.MockedFunction<
  typeof resolvePhotoLocation
>;
const mockCreateDraft = createDraftPhotoMetadata as jest.MockedFunction<
  typeof createDraftPhotoMetadata
>;
const mockRenderDraft = renderPhotoDraftFile as jest.MockedFunction<
  typeof renderPhotoDraftFile
>;
const mockGetPath = getPhotoMetadataFilePath as jest.MockedFunction<
  typeof getPhotoMetadataFilePath
>;

const mockResolvedLocation = {
  name: "Test Name",
  road: null,
  village: null,
  town: null,
  city: null,
  county: null,
  state: null,
  country: null,
  countryCode: null,
  postcode: null,
  displayName: "Test Name",
} as const;

describe("generatePhotoDrafts", () => {
  const bucket: ContentWorkspaceBucket = "drafts";
  const workspaceId = "ws-1";
  const workspacePath = "/workspace";
  const photosPath = "/photos";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("generates drafts for supported images", async () => {
    mockFs.readdir.mockResolvedValue([
      { isFile: () => true, name: "photo1.jpg" },
      { isFile: () => true, name: "photo2.png" },
      { isFile: () => true, name: "ignored.txt" },
    ] as any);

    mockExtractExif.mockResolvedValue({ latitude: 0, longitude: 0 } as any);
    mockResolveLocation.mockResolvedValue(mockResolvedLocation);
    const photoObj: AuthoredPhotoMetadata = { id: "id1" } as any;
    mockCreateDraft.mockReturnValue(photoObj);
    mockRenderDraft.mockReturnValue("file content");
    mockGetPath.mockReturnValue("metadata.json");

    const result = await generatePhotoDrafts(
      bucket,
      workspaceId,
      workspacePath,
      photosPath,
    );

    expect(result).toEqual([photoObj, photoObj]);
    expect(mockFs.writeFile).toHaveBeenCalledTimes(2);
  });

  it("skips unsupported files", async () => {
    mockFs.readdir.mockResolvedValue([
      { isFile: () => true, name: "script.js" },
      { isFile: () => true, name: "doc.pdf" },
    ] as any);

    const result = await generatePhotoDrafts(
      bucket,
      workspaceId,
      workspacePath,
      photosPath,
    );

    expect(result).toEqual([]);
    expect(mockFs.writeFile).not.toHaveBeenCalled();
  });

  it("sorts files alphabetically", async () => {
    mockFs.readdir.mockResolvedValue([
      { isFile: () => true, name: "b.jpg" },
      { isFile: () => true, name: "a.jpg" },
    ] as any);

    mockExtractExif.mockResolvedValue({ latitude: 0, longitude: 0 } as any);
    mockResolveLocation.mockResolvedValue(mockResolvedLocation);

    // Mock returns unique id based on the input filename
    mockCreateDraft.mockImplementation(
      (sourceFileName: string) =>
        ({
          id: path.basename(sourceFileName, path.extname(sourceFileName)),
        }) as AuthoredPhotoMetadata,
    );

    mockRenderDraft.mockReturnValue("content");

    // Mock path generator reflects id
    mockGetPath.mockImplementation(
      (_bucket, _workspaceId, photoId) => `/workspace/${photoId}.json`,
    );

    const result = await generatePhotoDrafts(
      bucket,
      workspaceId,
      workspacePath,
      photosPath,
    );

    expect(result).toHaveLength(2);
    expect(mockFs.writeFile).toHaveBeenCalledTimes(2);

    const writtenFiles = mockFs.writeFile.mock.calls.map((call) => call[0]);
    expect(writtenFiles[0]).toContain("a.json"); // now truly reflects alphabetical order
    expect(writtenFiles[1]).toContain("b.json");
  });
});
