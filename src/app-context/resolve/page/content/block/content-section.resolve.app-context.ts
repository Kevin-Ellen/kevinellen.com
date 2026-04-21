// src/app-context/resolve/page/content/block/content-section.resolve.app-context.ts

import type {
  AppStateContentSectionHeadingBlockContentModule,
  AppStateContentSectionBlockContentModule,
} from "@shared-types/page-content/block/content-section/app-state.content-section.block.page-content.types";
import type {
  AppContextContentSectionHeadingBlockContentModule,
  AppContextContentSectionBlockContentModule,
} from "@shared-types/page-content/block/content-section/app-context.content-section.block.page-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolveBlockContentModule } from "@app-context/resolve/page/content/block/block.page-content.resolve.app-context";

export const appContextResolveContentSectionHeadingBlockContentModule = (
  heading: AppStateContentSectionHeadingBlockContentModule,
  _context: AppContextPageContentResolverContext,
): AppContextContentSectionHeadingBlockContentModule => {
  return heading;
};

export const appContextResolveContentSectionBlockContentModule = (
  module: AppStateContentSectionBlockContentModule,
  context: AppContextPageContentResolverContext,
): AppContextContentSectionBlockContentModule => {
  return {
    ...module,
    heading: module.heading
      ? appContextResolveContentSectionHeadingBlockContentModule(
          module.heading,
          context,
        )
      : null,
    modules: module.modules.map((nestedModule) =>
      appContextResolveBlockContentModule(nestedModule, context),
    ),
  };
};
