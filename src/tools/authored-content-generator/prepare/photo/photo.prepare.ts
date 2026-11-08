// src/tools/authored-content-generator/prepare/photo/photo.prepare.ts

import { readdir, stat, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

import { extractPhotoExif } from "./exif/exif.photo.prepare";
import { resolvePhotoLocation } from "./location/location.photo.prepare";
import {
  createDraftPhotoMetadata,
  toPhotoId,
} from "./create-draft/create-draft.photo.prepare";

type Input = Readonly<{
  directory: string;
}>;

const supportedExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".tif",
  ".tiff",
]);

const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }

    throw error;
  }
};

export const preparePhotos = async ({
  directory,
}: Input): Promise<readonly string[]> => {
  const photosDirectory = resolve(directory, "photos");

  const photosStats = await stat(photosDirectory).catch(() => null);

  if (!photosStats?.isDirectory()) {
    throw new Error(`Photos directory not found: ${photosDirectory}`);
  }

  const files = await readdir(photosDirectory);

  const photoFiles = files
    .filter((fileName) =>
      supportedExtensions.has(extname(fileName).toLowerCase()),
    )
    .sort((a, b) => a.localeCompare(b));

  if (photoFiles.length === 0) {
    throw new Error(`No photographs found in ${photosDirectory}`);
  }

  const photoIds: string[] = [];
  const seenIds = new Set<string>();

  for (const fileName of photoFiles) {
    const id = toPhotoId(fileName);

    if (!id || seenIds.has(id)) {
      throw new Error(`Invalid or duplicate photo ID: ${id}`);
    }

    seenIds.add(id);
    photoIds.push(id);

    const draftPath = resolve(directory, `${id}.ts`);

    if (await fileExists(draftPath)) {
      console.log(`↷ Photo draft exists: ${id}`);
      continue;
    }

    const imagePath = resolve(photosDirectory, fileName);

    const exif = await extractPhotoExif(imagePath);

    const resolvedLocation = await resolvePhotoLocation(
      exif.latitude,
      exif.longitude,
    );

    const draft = createDraftPhotoMetadata(fileName, exif, resolvedLocation);

    const source = [
      'import type { PhotoAssetAuthored } from "../../../src/content-schema/assets/photo/photo.asset.content-schema.authored.type";',
      "",
      `export const photo = ${JSON.stringify(draft, null, 2)} as const satisfies PhotoAssetAuthored;`,
      "",
    ].join("\n");

    await writeFile(draftPath, source, {
      encoding: "utf8",
      flag: "wx",
    });

    console.log(`✓ Prepared photo: ${id}`);
  }

  return photoIds;
};
