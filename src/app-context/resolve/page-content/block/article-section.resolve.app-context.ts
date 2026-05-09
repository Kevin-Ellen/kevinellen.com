// src/app-context/resolve/page-content/block/article-section.resolve.app-context.ts

import type {
  AppStateArticleSectionHeadingBlock,
  AppStateArticleSectionBlock,
} from "@shared-types/page-content/block/article-section/app-state.article-section.block.types";
import type {
  AppContextArticleSectionHeadingBlock,
  AppContextArticleSectionBlock,
} from "@shared-types/page-content/block/article-section/app-context.article-section.block.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolveBlock } from "@app-context/resolve/page-content/block/block.resolve.app-context";

export const appContextResolveArticleSectionHeadingBlock = (
  heading: AppStateArticleSectionHeadingBlock,
  _context: AppContextPageContentResolverContext,
): AppContextArticleSectionHeadingBlock => {
  return heading;
};

export const appContextResolveArticleSectionBlock = (
  module: AppStateArticleSectionBlock,
  context: AppContextPageContentResolverContext,
): AppContextArticleSectionBlock => {
  return {
    ...module,
    heading: appContextResolveArticleSectionHeadingBlock(
      module.heading,
      context,
    ),
    modules: module.modules.map((nestedModule) =>
      appContextResolveBlock(nestedModule, context),
    ),
  };
};
