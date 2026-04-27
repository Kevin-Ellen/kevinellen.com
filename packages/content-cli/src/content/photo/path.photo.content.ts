// packages/content-cli/src/content/photo/path.photo.content.ts

import path from "node:path";

import { CONTENT_WORKSPACE_ROOT } from "@content-cli/config/paths.config.content-cli";

import type { ContentWorkspaceBucket } from "@content-cli/types/workspace.content-cli.types";

export const PHOTO_WORKSPACE_ROOT = path.join(CONTENT_WORKSPACE_ROOT, "photo");

export const getPhotoBucketPath = (bucket: ContentWorkspaceBucket): string =>
  path.join(PHOTO_WORKSPACE_ROOT, bucket);

export const getPhotoWorkspacePath = (
  bucket: ContentWorkspaceBucket,
  workspaceId: string,
): string => path.join(getPhotoBucketPath(bucket), workspaceId);

const getPhotoFileSuffix = (bucket: ContentWorkspaceBucket): string => {
  if (bucket === "drafts") {
    return "draft";
  }

  if (bucket === "edits") {
    return "edit";
  }

  return "uploaded";
};

export const getPhotoAssetDirectoryPath = (
  bucket: ContentWorkspaceBucket,
  workspaceId: string,
): string => path.join(getPhotoWorkspacePath(bucket, workspaceId), "photos");

export const getPhotoMetadataFilePath = (
  bucket: ContentWorkspaceBucket,
  workspaceId: string,
  photoSlug: string,
): string =>
  path.join(
    getPhotoWorkspacePath(bucket, workspaceId),
    `${photoSlug}.${getPhotoFileSuffix(bucket)}.ts`,
  );

export const getPhotoAssetFilePath = (
  bucket: ContentWorkspaceBucket,
  workspaceId: string,
  sourceFileName: string,
): string =>
  path.join(getPhotoAssetDirectoryPath(bucket, workspaceId), sourceFileName);
