// src/app/types/document/page/content/modules/topic-explorer/topic-explorer.module.content.page.document.app-render-context.type.ts

import type { TopicExplorerModuleContentAppResolve } from "./topic-explorer.module.content.page.document.app-resolve.type";
import type { TopicListingItemContentAppRenderContext } from "../topic-listing/topic-listing.module.page.document.content.app-render-context.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type TopicExplorerFeaturedItemContentAppRenderContext =
  TopicListingItemContentAppRenderContext;

export type TopicExplorerModuleContentAppRenderContext = Readonly<
  OmitAndReplace<
    TopicExplorerModuleContentAppResolve,
    {
      featured: readonly TopicExplorerFeaturedItemContentAppRenderContext[];
    }
  >
>;
