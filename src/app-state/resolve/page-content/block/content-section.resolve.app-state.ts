// src/app-state/resolve/page-content/block/content-section.resolve.app-state.ts

import type {
  AuthoredContentSectionHeadingBlockContentModule,
  AuthoredContentSectionBlockContentModule,
} from "@shared-types/page-content/block/content-section/authored.content-section.block.page-content.types";
import type {
  AppStateContentSectionHeadingBlockContentModule,
  AppStateContentSectionBlockContentModule,
} from "@shared-types/page-content/block/content-section/app-state.content-section.block.page-content.types";

import { appStateResolveBlockContentModule } from "@app-state/resolve/page-content/block/block.page-content.resolve.app-state";

export const appStateResolveContentSectionHeadingBlockContentModule = (
  heading: AuthoredContentSectionHeadingBlockContentModule,
): AppStateContentSectionHeadingBlockContentModule => {
  return {
    ...heading,
    visuallyHidden: heading.visuallyHidden ?? false,
  };
};

export const appStateResolveContentSectionBlockContentModule = (
  module: AuthoredContentSectionBlockContentModule,
): AppStateContentSectionBlockContentModule => {
  return {
    ...module,
    heading: appStateResolveContentSectionHeadingBlockContentModule(
      module.heading,
    ),
    modules: module.modules.map(appStateResolveBlockContentModule),
  };
};
