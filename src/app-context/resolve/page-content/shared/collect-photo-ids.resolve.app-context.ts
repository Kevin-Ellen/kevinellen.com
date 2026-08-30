// src/app-context/resolve/page-content/shared/collect-photo-ids.resolve.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppStateBlock } from "@shared-types/page-content/block/app-state.block.types";

type AppContextPhotoIdCollectorContext = Readonly<{
  publicPages: AppState["getPublicPages"];
}>;

type AppContextPhotoIdCollector<TBlock> = (
  block: TBlock,
  context: AppContextPhotoIdCollectorContext,
) => readonly string[];

type AppContextPhotoIdCollectorRegistry = {
  [TKind in AppStateBlock["kind"]]?: AppContextPhotoIdCollector<
    Extract<AppStateBlock, { kind: TKind }>
  >;
};
const appContextCollectJournalPhotoIds = (
  context: AppContextPhotoIdCollectorContext,
): readonly string[] =>
  context.publicPages
    .filter((page) => page.kind === "journal")
    .flatMap((page) =>
      appContextCollectPhotoIds(page.content.content, context),
    );

const APP_CONTEXT_PHOTO_ID_COLLECTORS: AppContextPhotoIdCollectorRegistry = {
  hero: (block) => [block.photoId],

  sequence: (block) => Object.values(block.photos),

  homepageHero: (block) => [block.photoId],

  homepageJournalListing: (_block, context) =>
    context.publicPages
      .filter((page) => page.kind === "journal")
      .slice(0, 1)
      .flatMap((page) =>
        appContextCollectPhotoIds(page.content.content, context),
      ),

  journalListing: (_block, context) =>
    appContextCollectJournalPhotoIds(context),

  articleSection: (block, context) =>
    appContextCollectPhotoIds(block.modules, context),
};

export const appContextCollectPhotoIds = (
  blocks: readonly AppStateBlock[],
  context: AppContextPhotoIdCollectorContext,
): readonly string[] => {
  const photoIds = new Set<string>();

  blocks.forEach((block) => {
    const collector = APP_CONTEXT_PHOTO_ID_COLLECTORS[block.kind];

    if (!collector) return;

    collector(block as never, context).forEach((photoId) => {
      photoIds.add(photoId);
    });
  });

  return [...photoIds];
};
