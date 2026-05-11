// src/app-render-context/resolve/body-content/block/section-links/section-links.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextSectionLinksBlock } from "@shared-types/page-content/block/section-links/app-context.section-links.block.types";
import type { AppRenderContextSectionLinksBlock } from "@shared-types/page-content/block/section-links/app-render-context.section-links.block.types";

import { appRenderContextResolveLink } from "@app-render-context/shared/link.resolve.app-render-context";
import { resolveSvgReferenceByIdAppRenderContext } from "@app-render-context/shared/svg-reference-by-id.resolve.app-render-context";

export const appRenderContextResolveSectionLinksBlock = (
  appContext: AppContext,
  module: AppContextSectionLinksBlock,
): AppRenderContextSectionLinksBlock => ({
  ...module,
  sections: module.sections.map((section) => ({
    ...section,
    link: appRenderContextResolveLink(appContext, section.link),
    icon: resolveSvgReferenceByIdAppRenderContext(appContext, section.icon),
  })),
});
