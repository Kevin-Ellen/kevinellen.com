// packages/shared-types/uploads/journal.upload.types.ts

export type JournalEntryDraftHeading = {
  text: string;
  level: 2 | 3;
};

export type JournalEntryDraftTextFragment = {
  kind: "text";
  value: string;
};

export type JournalEntryDraftInternalLinkFragment = {
  kind: "internalLink";
  pageId: string;
  text: string;
};

export type JournalEntryDraftParagraphFragment =
  | JournalEntryDraftTextFragment
  | JournalEntryDraftInternalLinkFragment;

export type JournalEntryDraftHeroModule = {
  kind: "hero";
  photoId: string;
  immersive?: boolean;
};

export type JournalEntryDraftParagraphModule = {
  kind: "paragraph";
  content: JournalEntryDraftParagraphFragment[];
};

export type JournalEntryDraftQuoteModule = {
  kind: "quote";
  id: string;
  text: string;
  attribution?: string;
};

export type JournalEntryDraftModule =
  | JournalEntryDraftHeroModule
  | JournalEntryDraftParagraphModule
  | JournalEntryDraftQuoteModule;

export type JournalEntryDraftSection = {
  kind: "contentSection";
  heading?: JournalEntryDraftHeading;
  modules: JournalEntryDraftModule[];
};

export type JournalEntryDraftFooter = {
  author: string;
  publishedAt: string;
  updatedAt: string | null;
  tags?: string[];
};

export type JournalEntryDraft = {
  id: string;
  slug: string;
  label: string;

  pageTitle: string;
  metaDescription: string;

  eyebrow: string;
  title: string;
  intro: string;

  body: JournalEntryDraftSection[];

  footer: JournalEntryDraftFooter;
};
