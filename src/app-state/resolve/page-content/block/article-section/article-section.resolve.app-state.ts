// src/app-state/resolve/page-content/block/article-section/article-section.resolve.app-state.ts

import type {
  AuthoredArticleSectionHeadingBlock,
  AuthoredArticleSectionBlock,
} from "@shared-types/page-content/block/article-section/authored.article-section.block.types";
import type {
  AppStateArticleSectionHeadingBlock,
  AppStateArticleSectionBlock,
} from "@shared-types/page-content/block/article-section/app-state.article-section.block.types";

import { appStateResolveBlock } from "@app-state/resolve/page-content/block/block.resolve.app-state";

export const appStateResolveArticleSectionHeadingBlock = (
  heading: AuthoredArticleSectionHeadingBlock,
): AppStateArticleSectionHeadingBlock => {
  return {
    ...heading,
    visuallyHidden: heading.visuallyHidden ?? false,
  };
};

export const appStateResolveArticleSectionBlock = (
  module: AuthoredArticleSectionBlock,
): AppStateArticleSectionBlock => {
  return {
    ...module,
    heading: appStateResolveArticleSectionHeadingBlock(module.heading),
    modules: module.modules.map((nestedModule) =>
      appStateResolveBlock(nestedModule),
    ),
  };
};
