// src/app-context/resolve/page-content/collect-photo-ids.page-content.resolve.app-context.ts

import type { AppStateBlockContentModule } from "@shared-types/page-content/block/app-state.block.page-content.types";

type PhotoIdCollector<TModule> = (module: TModule) => readonly string[];

type PhotoIdCollectorRegistry = {
  [TKind in AppStateBlockContentModule["kind"]]?: PhotoIdCollector<
    Extract<AppStateBlockContentModule, { kind: TKind }>
  >;
};

export const appContextCollectPhotoIdsFromBlockContent = (
  modules: readonly AppStateBlockContentModule[],
): readonly string[] => {
  const photoIds = new Set<string>();

  modules.forEach((module) => {
    const collector = PHOTO_ID_COLLECTORS[module.kind];

    if (!collector) {
      return;
    }

    const collectedPhotoIds = collector(module as never);

    collectedPhotoIds.forEach((photoId: string) => {
      photoIds.add(photoId);
    });
  });

  return [...photoIds];
};

const PHOTO_ID_COLLECTORS: PhotoIdCollectorRegistry = {
  hero: (module) => [module.photoId],

  articleSection: (module) =>
    appContextCollectPhotoIdsFromBlockContent(module.modules),
};
