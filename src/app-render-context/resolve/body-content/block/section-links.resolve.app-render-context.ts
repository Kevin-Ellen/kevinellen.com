// src/app-render-context/resolve/body-content/block/section-links.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextSectionLinksBlockContentModule } from "@shared-types/page-content/block/section-links/app-context.section-links.block.types";
import type { AppRenderContextSectionLinksBlockContentModule } from "@shared-types/page-content/block/section-links/app-render-context.section-links.block.types";

import { resolveLinkAppRenderContext } from "@app-render-context/shared/link.resolve.app-render-context";
import { resolveSvgReferenceByIdAppRenderContext } from "@app-render-context/shared/svg-reference-by-id.resolve.app-render-context";

export const resolveSectionLinksBlockContentModuleAppRenderContext = (
  appContext: AppContext,
  module: AppContextSectionLinksBlockContentModule,
): AppRenderContextSectionLinksBlockContentModule => ({
  ...module,
  sections: module.sections.map((section) => ({
    ...section,
    link: resolveLinkAppRenderContext(appContext, section.link),
    icon: resolveSvgReferenceByIdAppRenderContext(appContext, section.icon),
  })),
});
