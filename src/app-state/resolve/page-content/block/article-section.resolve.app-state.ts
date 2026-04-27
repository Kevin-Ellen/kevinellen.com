// src/app-state/resolve/page-content/block/article-section.resolve.app-state.ts

import type {
  AuthoredArticleSectionHeadingBlockContentModule,
  AuthoredArticleSectionBlockContentModule,
} from "@shared-types/page-content/block/article-section/authored.article-section.block.page-content.types";
import type {
  AppStateArticleSectionHeadingBlockContentModule,
  AppStateArticleSectionBlockContentModule,
} from "@shared-types/page-content/block/article-section/app-state.article-section.block.page-content.types";

import { appStateResolveBlockContentModule } from "@app-state/resolve/page-content/block/block.page-content.resolve.app-state";

export const appStateResolveArticleSectionHeadingBlockContentModule = (
  heading: AuthoredArticleSectionHeadingBlockContentModule,
): AppStateArticleSectionHeadingBlockContentModule => {
  return {
    ...heading,
    visuallyHidden: heading.visuallyHidden ?? false,
  };
};

export const appStateResolveArticleSectionBlockContentModule = (
  module: AuthoredArticleSectionBlockContentModule,
): AppStateArticleSectionBlockContentModule => {
  return {
    ...module,
    heading: appStateResolveArticleSectionHeadingBlockContentModule(
      module.heading,
    ),
    modules: module.modules.map(appStateResolveBlockContentModule),
  };
};
