// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/journal-listing/journal-listing.module.body.page.document.content.resolver.app-render-context.ts

import type { JournalListingModuleAppResolve } from "../../../../../../../../types/document/page/content/modules/journal-listing/journal-listing.module.content.page.document.app-resolve.type";
import type { JournalListingModuleAppRenderContext } from "../../../../../../../../types/document/page/content/modules/journal-listing/journal-listing.module.content.page.document.app-render-context.type";

import { resolvePhotoAppRenderContext } from "../../../../../primitives/photo/photo.primitive.resolver.app-render-context";
import { resolvePaginationAppRenderContext } from "../../../../../primitives/pagination/pagination.primitive.resolver.app-render-context";

type Input = Readonly<{
  content: JournalListingModuleAppResolve;
}>;

export const resolveJournalListingModuleAppRenderContext = ({
  content,
}: Input): JournalListingModuleAppRenderContext => ({
  ...content,

  featured: content.featured
    ? {
        ...content.featured,
        photos: content.featured.photos.map((photo) =>
          resolvePhotoAppRenderContext({ photo }),
        ),
      }
    : null,

  entries: content.entries.map((entry) => ({
    ...entry,
    photos: entry.photos.map((photo) =>
      resolvePhotoAppRenderContext({ photo }),
    ),
  })),

  pagination: content.pagination
    ? resolvePaginationAppRenderContext({
        pagination: content.pagination,
        basePath:
          content.topicId === null ? "/journal" : `/topics/${content.topicId}`,
      })
    : null,
});
