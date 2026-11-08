// src/shared/types/content/kv-ledger.content.shared.type.ts

import type { TopicId } from "../../../content-schema/topics/topic-id.topics.content-schema.type";

export type JournalLedgerEntryAuthored = Readonly<{
  id: string;
  kind: "journal";
  slug: string;
  dateCreated: string;
  label: string;
  sitemap: boolean;
  breadcrumbs: readonly string[];
  title: string;
  intro: string;
  photos: readonly string[];
  topics: readonly TopicId[];
}>;

export type JournalLedgerAuthored = Readonly<{
  version: 1;
  entries: readonly JournalLedgerEntryAuthored[];
}>;

export type JournalLedgerEntryAppInit = Readonly<{
  id: string;
  kind: "journal";
  slug: string;
  dateCreated: string;
  label: string;
  sitemap: boolean;
  breadcrumbs: readonly string[];
  title: string;
  intro: string;
  photos: readonly string[];
  topics: readonly TopicId[];
}>;

export type JournalLedgerAppInit = Readonly<{
  version: 1;
  entries: readonly JournalLedgerEntryAppInit[];
}>;

export type PublishedRegistry = Readonly<{
  bySlug: Readonly<Record<string, JournalLedgerEntryAppInit>>;
  newestFirst: readonly JournalLedgerEntryAppInit[];
}>;
