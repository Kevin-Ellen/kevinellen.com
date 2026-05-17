// packages/content-cli/src/content/photo/path.photo.content.test.ts

import path from "node:path";

import {
  PHOTO_WORKSPACE_ROOT,
  getPhotoBucketPath,
  getPhotoWorkspacePath,
  getPhotoAssetDirectoryPath,
  getPhotoMetadataFilePath,
  getPhotoAssetFilePath,
} from "@content-cli/content/photo/path.photo.content";

describe("photo path utilities", () => {
  it("builds bucket paths", () => {
    expect(getPhotoBucketPath("drafts")).toBe(
      path.join(PHOTO_WORKSPACE_ROOT, "drafts"),
    );

    expect(getPhotoBucketPath("edits")).toBe(
      path.join(PHOTO_WORKSPACE_ROOT, "edits"),
    );

    expect(getPhotoBucketPath("uploaded")).toBe(
      path.join(PHOTO_WORKSPACE_ROOT, "uploaded"),
    );
  });

  it("builds workspace paths", () => {
    expect(getPhotoWorkspacePath("drafts", "birds")).toBe(
      path.join(PHOTO_WORKSPACE_ROOT, "drafts", "birds"),
    );
  });

  it("builds asset directory paths", () => {
    expect(getPhotoAssetDirectoryPath("drafts", "birds")).toBe(
      path.join(PHOTO_WORKSPACE_ROOT, "drafts", "birds", "photos"),
    );
  });

  it("builds metadata file paths", () => {
    expect(getPhotoMetadataFilePath("drafts", "birds", "robin")).toBe(
      path.join(PHOTO_WORKSPACE_ROOT, "drafts", "birds", "robin.draft.ts"),
    );

    expect(getPhotoMetadataFilePath("edits", "birds", "robin")).toBe(
      path.join(PHOTO_WORKSPACE_ROOT, "edits", "birds", "robin.edit.ts"),
    );

    expect(getPhotoMetadataFilePath("uploaded", "birds", "robin")).toBe(
      path.join(PHOTO_WORKSPACE_ROOT, "uploaded", "birds", "robin.uploaded.ts"),
    );
  });

  it("builds asset file paths", () => {
    expect(getPhotoAssetFilePath("drafts", "birds", "robin.jpg")).toBe(
      path.join(PHOTO_WORKSPACE_ROOT, "drafts", "birds", "photos", "robin.jpg"),
    );
  });
});
