// packages/content-cli/src/content/journal/utils/import.draft.journal.util.content.ts

import path from "node:path";
import { pathToFileURL } from "node:url";

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

type JournalDraftModule = Readonly<{
  page?: AuthoredPublicPageDefinition;
}>;

const isJournalDraftModule = (
  module: unknown,
): module is Required<JournalDraftModule> =>
  typeof module === "object" && module !== null && "page" in module;

export const importJournalDraft = async (
  filePath: string,
): Promise<AuthoredPublicPageDefinition> => {
  const modulePath = `${pathToFileURL(path.resolve(filePath)).href}?t=${Date.now()}`;
  const module = (await import(modulePath)) as unknown;

  if (!isJournalDraftModule(module)) {
    throw new Error(`Journal draft does not export page: ${filePath}`);
  }

  return module.page;
};
