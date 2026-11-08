// src/tools/authored-content-generator/validate/journal/journal.validate.ts

import type { ValidateFunction } from "ajv";
import type { ContentAuthored } from "../../../../content-schema/content/content.content-schema.authored.type";
import type { ContentAppInit } from "../../../../shared/types/content/content.shared.app-init.type";
import type { validatePhoto } from "../photo/photo.validate";

import { validateContentAppInit } from "../app-init/app-init.validate";

type ValidatedPhoto = ReturnType<typeof validatePhoto>;

type Input = Readonly<{
  journal: unknown;
  photos: readonly ValidatedPhoto[];
  validateSchema: ValidateFunction;
}>;

type ValidatedJournal = Readonly<{
  authored: ContentAuthored;
  appInit: ContentAppInit;
}>;

const REQUIRED_PLACEHOLDER = "__REQUIRED__";

const findPhotoReferences = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap(findPhotoReferences);
  }

  if (typeof value !== "object" || value === null) {
    return [];
  }

  return Object.entries(value).flatMap(([key, nested]) => {
    if (key === "photoId" && typeof nested === "string") {
      return [nested];
    }

    return findPhotoReferences(nested);
  });
};

export const validateJournal = ({
  journal,
  photos,
  validateSchema,
}: Input): ValidatedJournal => {
  if (!validateSchema(journal)) {
    throw new Error(
      `Journal schema validation failed:\n${JSON.stringify(
        validateSchema.errors,
        null,
        2,
      )}`,
    );
  }

  const authored = journal as ContentAuthored;

  if (authored.kind !== "public" || authored.pageType !== "journalEntry") {
    throw new Error("Expected a public journal entry");
  }

  if (JSON.stringify(authored).includes(REQUIRED_PLACEHOLDER)) {
    throw new Error(`Journal "${authored.id}" contains required placeholders`);
  }

  if (authored.slug !== `/journal/${authored.id}`) {
    throw new Error(`Journal "${authored.id}" has an inconsistent slug`);
  }

  if (authored.breadcrumbs.at(-1) !== authored.id) {
    throw new Error(`Journal "${authored.id}" has inconsistent breadcrumbs`);
  }

  const inventory = authored.photos ?? [];
  const inventoryIds = new Set(inventory);
  const preparedIds = new Set(photos.map(({ authored }) => authored.id));

  if (inventory.length === 0) {
    throw new Error("Journal has no photographs");
  }

  if (inventoryIds.size !== inventory.length) {
    throw new Error("Journal contains duplicate photograph IDs");
  }

  for (const id of inventory) {
    if (!preparedIds.has(id)) {
      throw new Error(`Journal photograph "${id}" is missing`);
    }
  }

  const references = findPhotoReferences(authored.body);

  for (const id of references) {
    if (!inventoryIds.has(id)) {
      throw new Error(`Journal references photo "${id}" outside its inventory`);
    }
  }

  for (const id of preparedIds) {
    if (!inventoryIds.has(id)) {
      throw new Error(
        `Prepared photograph "${id}" is not in the journal inventory`,
      );
    }
  }

  const appInit = validateContentAppInit(authored);

  console.log(`✓ Journal valid: ${authored.id}`);
  console.log(`✓ Photo references valid: ${references.length}`);
  console.log(`✓ AppInit resolved: ${appInit.id}`);

  return { authored, appInit };
};
