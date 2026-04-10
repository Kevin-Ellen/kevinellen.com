// packages/shared-types/src/content/pages/public/journal-entry/journal-entry.public.page.content.ts

import type { ContentSectionAuthored } from "@shared-types/content/content-section/content.section.module.types";
import type { PageHeadAuthored } from "@shared-types/content/page-head/page.head.types";
import type { TagId } from "@shared-types/content/tags.types";

export type JournalEntryFooterFieldAuthored = {
  label: string;
  value: string;
};

export type JournalEntryFooterAuthored = {
  publication: readonly JournalEntryFooterFieldAuthored[];
  tags: readonly TagId[];
};

export type JournalEntryPageContentAuthored = {
  head: PageHeadAuthored;
  body: readonly ContentSectionAuthored[];
  footer: JournalEntryFooterAuthored;
};
