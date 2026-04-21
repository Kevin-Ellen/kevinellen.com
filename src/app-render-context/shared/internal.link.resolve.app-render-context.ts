// src/app-render-context/shared/internal.link.resolve.app-render-context.ts

import type { AppContextInternalLink } from "@shared-types/links/app-context.links.types";
import type { AppRenderContextInternalLink } from "@shared-types/links/app-render-context.links.types";

export const resolveInternalLinkAppRenderContext = (
  link: AppContextInternalLink,
): AppRenderContextInternalLink => {
  return {
    kind: link.kind,
    href: link.href,
    text: link.text,
    openInNewTab: link.behaviour.openInNewTab,
    svg: null,
  };
};
