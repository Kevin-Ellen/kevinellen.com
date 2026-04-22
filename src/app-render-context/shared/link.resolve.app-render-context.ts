// src/app-render-context/shared/link.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextLink } from "@shared-types/links/app-context.links.types";
import type { AppRenderContextLink } from "@shared-types/links/app-render-context.links.types";

import { resolveInternalLinkAppRenderContext } from "@app-render-context/shared/internal.link.resolve.app-render-context";
import { resolveSvgReferenceByIdAppRenderContext } from "@app-render-context/shared/svg-reference-by-id.resolve.app-render-context";

const resolveExternalLinkAppRenderContext = (
  appContext: AppContext,
  link: Extract<AppContextLink, { kind: "external" }>,
): AppRenderContextLink => ({
  kind: link.kind,
  href: link.href,
  text: link.text,
  openInNewTab: link.behaviour.openInNewTab,
  svg: resolveSvgReferenceByIdAppRenderContext(appContext, link.svgId),
});

const resolveSocialLinkAppRenderContext = (
  appContext: AppContext,
  link: Extract<AppContextLink, { kind: "social" }>,
): AppRenderContextLink => ({
  kind: link.kind,
  href: link.href,
  text: link.text,
  openInNewTab: true,
  svg: resolveSvgReferenceByIdAppRenderContext(appContext, link.svgId),
});

export const resolveLinkAppRenderContext = (
  appContext: AppContext,
  link: AppContextLink,
): AppRenderContextLink => {
  switch (link.kind) {
    case "internal":
      return resolveInternalLinkAppRenderContext(appContext, link);
    case "external":
      return resolveExternalLinkAppRenderContext(appContext, link);
    case "social":
      return resolveSocialLinkAppRenderContext(appContext, link);
  }
};
