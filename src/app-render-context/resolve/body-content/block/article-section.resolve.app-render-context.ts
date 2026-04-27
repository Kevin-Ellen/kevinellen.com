// src/app-render-context/resolve/body-content/block/article-section.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type {
  AppContextArticleSectionBlockContentModule,
  AppContextArticleSectionHeadingBlockContentModule,
} from "@shared-types/page-content/block/article-section/app-context.article-section.block.page-content.types";
import type {
  AppRenderContextArticleSectionBlockContentModule,
  AppRenderContextArticleSectionHeadingBlockContentModule,
} from "@shared-types/page-content/block/article-section/app-render-context.article-section.block.page-content.types";

import { resolveBlockContentModuleAppRenderContext } from "./block.resolve.app-render-context";

export const resolveArticleSectionHeadingBlockContentModuleAppRenderContext = (
  _appContext: AppContext,
  heading: AppContextArticleSectionHeadingBlockContentModule,
): AppRenderContextArticleSectionHeadingBlockContentModule => {
  return heading;
};

export const resolveArticleSectionBlockContentModuleAppRenderContext = (
  appContext: AppContext,
  module: AppContextArticleSectionBlockContentModule,
): AppRenderContextArticleSectionBlockContentModule => {
  return {
    ...module,
    heading: resolveArticleSectionHeadingBlockContentModuleAppRenderContext(
      appContext,
      module.heading,
    ),
    modules: module.modules.map((childModule) =>
      resolveBlockContentModuleAppRenderContext(appContext, childModule),
    ),
  };
};
