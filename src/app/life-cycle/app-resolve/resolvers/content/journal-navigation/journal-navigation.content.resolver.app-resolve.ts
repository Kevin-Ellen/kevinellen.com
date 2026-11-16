// src/app/life-cycle/app-resolve/resolvers/content/journal-navigation/journal-navigation.content.resolver.app-resolve.ts

import type { PublishedRegistry } from "../../../../../../shared/types/content/kv-ledger.content.shared.type";
import type { JournalNavigationAppResolve } from "../../../../../types/document/page/content/journal-navigation.content.page.document.app-resolve.type";

type Input = Readonly<{
  currentSlug: string;
  journalLedger: PublishedRegistry;
}>;

export const resolveJournalNavigationAppResolve = ({
  currentSlug,
  journalLedger,
}: Input): JournalNavigationAppResolve => {
  const entries = journalLedger.newestFirst.filter((entry) => entry.sitemap);

  const index = entries.findIndex((entry) => entry.slug === currentSlug);

  if (index === -1) {
    return { previous: null, next: null };
  }

  const toNavigationEntry = (
    entry: (typeof entries)[number] | undefined,
  ): JournalNavigationAppResolve["previous"] =>
    entry
      ? {
          slug: entry.slug,
          title: entry.title,
        }
      : null;

  return {
    previous: toNavigationEntry(entries[index + 1]),
    next: toNavigationEntry(entries[index - 1]),
  };
};
