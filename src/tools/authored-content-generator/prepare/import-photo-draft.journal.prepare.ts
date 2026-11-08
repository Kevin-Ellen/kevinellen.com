// src/tools/authored-content-generator/prepare/import-photo-draft.journal.prepare.ts

import { pathToFileURL } from "node:url";

import type { PhotoAssetAuthored } from "../../../content-schema/assets/photo/photo.asset.content-schema.authored.type";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const importPhotoDraft = async (
  filePath: string,
): Promise<PhotoAssetAuthored> => {
  const moduleUrl = pathToFileURL(filePath).href;
  const module: unknown = await import(moduleUrl);

  if (!isRecord(module) || !isRecord(module.photo)) {
    throw new Error(`Invalid photo draft module: ${filePath}`);
  }

  // The authored-content validation pipeline owns the full photo schema.
  return module.photo as PhotoAssetAuthored;
};
