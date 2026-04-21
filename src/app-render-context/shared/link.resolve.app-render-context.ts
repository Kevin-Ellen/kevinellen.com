// src/app-render-context/shared/link.resolve.app-render-context.ts

import type { AppContextLink } from "@shared-types/links/app-context.links.types";
import type { AppRenderContextLink } from "@shared-types/links/app-render-context.links.types";

import { resolveInternalLinkAppRenderContext } from "@app-render-context/shared/internal.link.resolve.app-render-context";

// You can split these later into their own files if they grow
const resolveExternalLinkAppRenderContext = (
  link: Extract<AppContextLink, { kind: "external" }>,
): AppRenderContextLink => ({
  kind: link.kind,
  href: link.href,
  text: link.text,
  openInNewTab: link.behaviour.openInNewTab,
  svg: null,
});

const resolveSocialLinkAppRenderContext = (
  link: Extract<AppContextLink, { kind: "social" }>,
): AppRenderContextLink => ({
  kind: link.kind,
  href: link.href,
  text: link.text,
  openInNewTab: true, // your current rule
  svg: null,
});

export const resolveLinkAppRenderContext = (
  link: AppContextLink,
): AppRenderContextLink => {
  switch (link.kind) {
    case "internal":
      return resolveInternalLinkAppRenderContext(link);
    case "external":
      return resolveExternalLinkAppRenderContext(link);
    case "social":
      return resolveSocialLinkAppRenderContext(link);
  }
};
