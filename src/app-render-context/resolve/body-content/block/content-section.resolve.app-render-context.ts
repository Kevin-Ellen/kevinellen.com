// src/app-render-context/resolve/body-content/block/content-section.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type {
  AppContextContentSectionBlockContentModule,
  AppContextContentSectionHeadingBlockContentModule,
} from "@shared-types/page-content/block/content-section/app-context.content-section.block.page-content.types";
import type {
  AppRenderContextContentSectionBlockContentModule,
  AppRenderContextContentSectionHeadingBlockContentModule,
} from "@shared-types/page-content/block/content-section/app-render-context.content-section.block.page-content.types";

import { resolveBlockContentModuleAppRenderContext } from "./block.resolve.app-render-context";

export const resolveContentSectionHeadingBlockContentModuleAppRenderContext = (
  _appContext: AppContext,
  heading: AppContextContentSectionHeadingBlockContentModule,
): AppRenderContextContentSectionHeadingBlockContentModule => {
  return heading;
};

export const resolveContentSectionBlockContentModuleAppRenderContext = (
  appContext: AppContext,
  module: AppContextContentSectionBlockContentModule,
): AppRenderContextContentSectionBlockContentModule => {
  return {
    ...module,
    heading: resolveContentSectionHeadingBlockContentModuleAppRenderContext(
      appContext,
      module.heading,
    ),
    modules: module.modules.map((childModule) =>
      resolveBlockContentModuleAppRenderContext(appContext, childModule),
    ),
  };
};
