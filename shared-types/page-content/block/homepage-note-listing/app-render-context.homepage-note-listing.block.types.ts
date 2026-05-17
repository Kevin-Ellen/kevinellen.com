// shared-types/page-content/block/homepage-note-listing/app-render-context.homepage-note-listing.block.types.ts

import type { AppContextHomepageNoteListingBlock } from "@shared-types/page-content/block/homepage-note-listing/app-context.homepage-note-listing.block.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppRenderContextHomepageNoteListingItem = Readonly<{
  id: string;
  href: string;
  title: string;
  intro: string | null;
  eyebrow: string | null;
  publishedAt: string | null;
  publishedLabel: string | null;
  topic: string | null;
}>;

type ResolvedFields = Readonly<{
  notes: readonly AppRenderContextHomepageNoteListingItem[];
}>;

export type AppRenderContextHomepageNoteListingBlock = Replace<
  AppContextHomepageNoteListingBlock,
  ResolvedFields
>;
