// packages/content-cli/src/content/journal/utils/import.draft.journal.util.content.ts

import path from "node:path";
import { pathToFileURL } from "node:url";

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

type JournalDraftModule = Readonly<{
  page: AuthoredPublicPageDefinition;
}>;

export const importJournalDraft = async (
  filePath: string,
): Promise<AuthoredPublicPageDefinition> => {
  const modulePath = `${pathToFileURL(path.resolve(filePath)).href}?t=${Date.now()}`;
  const module = (await import(modulePath)) as JournalDraftModule;

  return module.page;
};
