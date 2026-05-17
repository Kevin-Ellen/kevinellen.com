// src/app-render-context/resolve/body-content/block/article-section/article-section.resolve.app-render-context.ts

import type {
  AppContextArticleSectionBlock,
  AppContextArticleSectionHeadingBlock,
} from "@shared-types/page-content/block/article-section/app-context.article-section.block.types";
import type {
  AppRenderContextArticleSectionBlock,
  AppRenderContextArticleSectionHeadingBlock,
} from "@shared-types/page-content/block/article-section/app-render-context.article-section.block.types";
import type { AppContext } from "@app-context/class.app-context";

import { appRenderContextResolveBlock } from "@app-render-context/resolve/body-content/block/block.resolve.app-render-context";

export const appRenderContextResolveArticleSectionHeadingBlock = (
  heading: AppContextArticleSectionHeadingBlock,
): AppRenderContextArticleSectionHeadingBlock => heading;

export const appRenderContextResolveArticleSectionBlock = (
  appContext: AppContext,
  block: AppContextArticleSectionBlock,
): AppRenderContextArticleSectionBlock => ({
  ...block,
  modules: block.modules.map((childBlock) =>
    appRenderContextResolveBlock(appContext, childBlock),
  ),
});
