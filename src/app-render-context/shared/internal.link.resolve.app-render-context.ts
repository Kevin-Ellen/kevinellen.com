// src/app-render-context/shared/internal.link.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextInternalLink } from "@shared-types/links/app-context.links.types";
import type { AppRenderContextInternalLink } from "@shared-types/links/app-render-context.links.types";

import { resolveSvgReferenceByIdAppRenderContext } from "@app-render-context/shared/svg-reference-by-id.resolve.app-render-context";

export const resolveInternalLinkAppRenderContext = (
  appContext: AppContext,
  link: AppContextInternalLink,
): AppRenderContextInternalLink => {
  return {
    kind: link.kind,
    href: link.href,
    text: link.text,
    openInNewTab: link.behaviour.openInNewTab,
    svg: resolveSvgReferenceByIdAppRenderContext(appContext, link.svgId),
  };
};
