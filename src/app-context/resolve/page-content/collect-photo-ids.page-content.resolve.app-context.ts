// src/app-context/resolve/page-content/collect-photo-ids.page-content.resolve.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppStateBlockContentModule } from "@shared-types/page-content/block/app-state.block.page-content.types";

type PhotoIdCollectorContext = Readonly<{
  publicPages: AppState["getPublicPages"];
}>;

type PhotoIdCollector<TModule> = (
  module: TModule,
  context: PhotoIdCollectorContext,
) => readonly string[];

type PhotoIdCollectorRegistry = {
  [TKind in AppStateBlockContentModule["kind"]]?: PhotoIdCollector<
    Extract<AppStateBlockContentModule, { kind: TKind }>
  >;
};

export const appContextCollectPhotoIdsFromBlockContent = (
  modules: readonly AppStateBlockContentModule[],
  context: PhotoIdCollectorContext,
): readonly string[] => {
  const photoIds = new Set<string>();

  modules.forEach((module) => {
    const collector = PHOTO_ID_COLLECTORS[module.kind];

    if (!collector) {
      return;
    }

    const collectedPhotoIds = collector(module as never, context);

    collectedPhotoIds.forEach((photoId) => {
      photoIds.add(photoId);
    });
  });

  return [...photoIds];
};

const PHOTO_ID_COLLECTORS: PhotoIdCollectorRegistry = {
  hero: (module) => [module.photoId],

  homepageHero: (module) => [module.photoId],

  // Only the first homepage journal entry renders an image.
  homepageJournalListing: (_module, context) =>
    context.publicPages
      .filter((page) => page.kind === "journal")
      .slice(0, 1)
      .flatMap((page) =>
        appContextCollectPhotoIdsFromBlockContent(
          page.content.content,
          context,
        ),
      ),

  journalListing: (_module, context) =>
    context.publicPages
      .filter((page) => page.kind === "journal")
      .flatMap((page) =>
        appContextCollectPhotoIdsFromBlockContent(
          page.content.content,
          context,
        ),
      ),

  articleSection: (module, context) =>
    appContextCollectPhotoIdsFromBlockContent(module.modules, context),
};
