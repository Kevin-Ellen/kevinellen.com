// src/app-render-context/resolve/body-content/block/homepage-note-listing/homepage-note-listing.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextHomepageNoteListingBlock } from "@shared-types/page-content/block/homepage-note-listing/app-context.homepage-note-listing.block.types";
import type { AppRenderContextHomepageNoteListingBlock } from "@shared-types/page-content/block/homepage-note-listing/app-render-context.homepage-note-listing.block.types";

import { formatDate } from "@utils/date.format.util";

export const appRenderContextResolveHomepageNoteListingBlock = (
  _appContext: AppContext,
  block: AppContextHomepageNoteListingBlock,
): AppRenderContextHomepageNoteListingBlock => ({
  ...block,
  notes: block.notes.map((note) => ({
    id: note.id,
    href: note.href,
    title: note.title,
    intro: note.intro,
    eyebrow: note.eyebrow,
    publishedAt: note.publishedAt,
    publishedLabel:
      note.publishedAt === null ? null : formatDate(note.publishedAt),
    topic: note.topic,
  })),
});
