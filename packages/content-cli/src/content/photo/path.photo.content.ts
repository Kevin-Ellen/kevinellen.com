// packages/content-cli/src/content/photo/path.photo.content.ts

import path from "node:path";

import { CONTENT_WORKSPACE_ROOT } from "@content-cli/config/paths.config.content-cli";

import type { ContentWorkspaceBucket } from "@content-cli/types/workspace.content-cli.types";

export const PHOTO_WORKSPACE_ROOT = path.join(CONTENT_WORKSPACE_ROOT, "photo");

const PHOTO_FILE_SUFFIX: Record<ContentWorkspaceBucket, string> = {
  drafts: "draft",
  edits: "edit",
  uploaded: "uploaded",
};

export const getPhotoBucketPath = (bucket: ContentWorkspaceBucket): string =>
  path.join(PHOTO_WORKSPACE_ROOT, bucket);

export const getPhotoWorkspacePath = (
  bucket: ContentWorkspaceBucket,
  workspaceId: string,
): string => path.join(getPhotoBucketPath(bucket), workspaceId);

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
    `${photoSlug}.${PHOTO_FILE_SUFFIX[bucket]}.ts`,
  );

export const getPhotoAssetFilePath = (
  bucket: ContentWorkspaceBucket,
  workspaceId: string,
  sourceFileName: string,
): string =>
  path.join(getPhotoAssetDirectoryPath(bucket, workspaceId), sourceFileName);
