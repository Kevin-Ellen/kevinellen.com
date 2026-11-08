// src/tools/authored-content-generator/validate/photo/photo.validate.ts

import type { ValidateFunction } from "ajv";
import type { PhotoAssetAuthored } from "../../../../content-schema/assets/photo/photo.asset.content-schema.authored.type";
import type { PhotoAppInit } from "../../../../shared/types/assets/photo.asset.shared.app-init.type";

import { validatePhotoAppInit } from "../app-init/app-init.validate";

type Input = Readonly<{
  photo: unknown;
  expectedId: string;
  validateSchema: ValidateFunction;
}>;

type ValidatedPhoto = Readonly<{
  authored: PhotoAssetAuthored;
  appInit: PhotoAppInit;
}>;

const REQUIRED_PLACEHOLDER = "__REQUIRED__";

const requireEditorialText = (
  value: string,
  field: string,
  photoId: string,
): void => {
  if (!value.trim() || value.includes(REQUIRED_PLACEHOLDER)) {
    throw new Error(`Photo "${photoId}" requires a valid ${field}`);
  }
};

export const validatePhoto = ({
  photo,
  expectedId,
  validateSchema,
}: Input): ValidatedPhoto => {
  if (!validateSchema(photo)) {
    throw new Error(
      `Photo "${expectedId}" schema validation failed:\n${JSON.stringify(
        validateSchema.errors,
        null,
        2,
      )}`,
    );
  }

  const authored = photo as PhotoAssetAuthored;

  if (authored.id !== expectedId) {
    throw new Error(
      `Photo ID mismatch: expected "${expectedId}", received "${authored.id}"`,
    );
  }

  requireEditorialText(authored.title, "title", authored.id);
  requireEditorialText(authored.alt, "alt", authored.id);
  requireEditorialText(authored.commentary, "commentary", authored.id);

  if (
    authored.species &&
    new Set(authored.species.map((species) => species.scientificName)).size !==
      authored.species.length
  ) {
    throw new Error(`Photo "${authored.id}" contains duplicate species`);
  }

  const appInit = validatePhotoAppInit(authored);

  console.log(`✓ Photo valid: ${authored.id}`);
  console.log(`✓ Photo AppInit resolved: ${appInit.id}`);

  return { authored, appInit };
};
