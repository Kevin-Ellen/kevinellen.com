// src/app/types/document/page/content/journal-navigation.content.page.document.app-resolve.type.ts

export type JournalNavigationEntryAppResolve = Readonly<{
  slug: string;
  title: string;
}>;

export type JournalNavigationAppResolve = Readonly<{
  previous: JournalNavigationEntryAppResolve | null;
  next: JournalNavigationEntryAppResolve | null;
}>;
