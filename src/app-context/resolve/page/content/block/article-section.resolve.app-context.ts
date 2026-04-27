// src/app-context/resolve/page/content/block/article-section.resolve.app-context.ts

import type {
  AppStateArticleSectionHeadingBlockContentModule,
  AppStateArticleSectionBlockContentModule,
} from "@shared-types/page-content/block/article-section/app-state.article-section.block.page-content.types";
import type {
  AppContextArticleSectionHeadingBlockContentModule,
  AppContextArticleSectionBlockContentModule,
} from "@shared-types/page-content/block/article-section/app-context.article-section.block.page-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolveBlockContentModule } from "@app-context/resolve/page/content/block/block.page-content.resolve.app-context";

export const appContextResolveArticleSectionHeadingBlockContentModule = (
  heading: AppStateArticleSectionHeadingBlockContentModule,
  _context: AppContextPageContentResolverContext,
): AppContextArticleSectionHeadingBlockContentModule => {
  return heading;
};

export const appContextResolveArticleSectionBlockContentModule = (
  module: AppStateArticleSectionBlockContentModule,
  context: AppContextPageContentResolverContext,
): AppContextArticleSectionBlockContentModule => {
  return {
    ...module,
    heading: appContextResolveArticleSectionHeadingBlockContentModule(
      module.heading,
      context,
    ),
    modules: module.modules.map((nestedModule) =>
      appContextResolveBlockContentModule(nestedModule, context),
    ),
  };
};
