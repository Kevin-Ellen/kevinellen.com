// packages/shared-types/src/pages/content/journal.content.page.types.ts

import type { PageContentHero } from "./block.content.page.types";
import type { PageContentInline } from "./inline.content.page.types";

export type JournalPageContent = {
  header: JournalPageHeader;
  hero: JournalPageHero;
  body: readonly JournalBodyModule[];
  footer: JournalPageFooter;
};

export type JournalPageHeader = {
  eyebrow?: string;
  title: string;
  intro: string;
};

export type JournalPageHero = {
  image: PageContentHero;
  caption?: string;
  metadata?: JournalHeroMetadata;
};

export type JournalHeroMetadata = {
  location?: string;
  capturedAt?: string;
  camera?: string;
  lens?: string;
  focalLength?: string;
  exposure?: string;
  aperture?: string;
  iso?: string;
};

export type JournalBodyModule =
  | JournalRichTextSectionModule
  | JournalQuoteModule
  | JournalInternalLinksModule;

export type JournalRichTextSectionModule = {
  type: "rich-text-section";
  heading?: JournalSectionHeading;
  blocks: readonly JournalTextBlock[];
};

export type JournalSectionHeading = {
  level: 2 | 3;
  text: string;
};

export type JournalTextBlock = JournalParagraphBlock | JournalListBlock;

export type JournalParagraphBlock = {
  type: "paragraph";
  content: readonly PageContentInline[];
};

export type JournalListBlock = {
  type: "list";
  style: "unordered" | "ordered";
  items: readonly JournalListItem[];
};

export type JournalListItem = {
  content: readonly PageContentInline[];
};

export type JournalQuoteModule = {
  type: "quote";
  quote: readonly PageContentInline[];
  attribution?: string;
  citation?: string;
};

export type JournalInternalLinksModule = {
  type: "internal-links";
  heading?: string;
  links: readonly JournalInternalLinkItem[];
};

export type JournalInternalLinkItem = {
  href: string;
  label: string;
  description?: string;
};

export type JournalPageFooter = {
  publication: JournalPublicationMeta;
  fieldNotes?: readonly string[];
  technicalNotes?: readonly string[];
  tags: readonly string[];
};

export type JournalPublicationMeta = {
  publishedAt: string | null;
  modifiedAt: string | null;
};
