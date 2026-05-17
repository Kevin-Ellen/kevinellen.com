// packages/content-cli/src/content/notes/utils/import.draft.note.util.content.ts

import path from "node:path";
import { pathToFileURL } from "node:url";

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

type NoteDraftModule = Readonly<{
  page?: AuthoredPublicPageDefinition;
}>;

const isRecord = (value: unknown): value is Record<PropertyKey, unknown> =>
  typeof value === "object" && value !== null;

const isNoteDraftModule = (
  module: unknown,
): module is Required<NoteDraftModule> =>
  isRecord(module) && module.page !== undefined;

const createCacheBustedModuleUrl = (filePath: string): string => {
  const fileUrl = pathToFileURL(path.resolve(filePath));

  fileUrl.searchParams.set("t", Date.now().toString());

  return fileUrl.href;
};

export const importNoteDraft = async (
  filePath: string,
): Promise<AuthoredPublicPageDefinition> => {
  const module = (await import(
    createCacheBustedModuleUrl(filePath)
  )) as unknown;

  if (!isNoteDraftModule(module)) {
    throw new Error(`Note draft does not export page: ${filePath}`);
  }

  return structuredClone(module.page);
};
