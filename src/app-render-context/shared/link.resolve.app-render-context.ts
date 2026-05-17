// src/app-render-context/shared/link.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type {
  AppContextInternalLink,
  AppContextLink,
} from "@shared-types/links/app-context.links.types";
import type {
  AppRenderContextInternalLink,
  AppRenderContextLink,
} from "@shared-types/links/app-render-context.links.types";

import { resolveSvgReferenceByIdAppRenderContext } from "@app-render-context/shared/svg-reference-by-id.resolve.app-render-context";

type LinkKind = AppContextLink["kind"];

type LinkByKind<TKind extends LinkKind> = Extract<
  AppContextLink,
  { kind: TKind }
>;

type RenderLinkByKind<TLink extends AppContextLink> =
  TLink extends AppContextInternalLink
    ? AppRenderContextInternalLink
    : AppRenderContextLink;

type LinkResolverRegistry = {
  [TKind in LinkKind]: (
    appContext: AppContext,
    link: LinkByKind<TKind>,
  ) => RenderLinkByKind<LinkByKind<TKind>>;
};

const appRenderContextResolveInternalLink = (
  appContext: AppContext,
  link: LinkByKind<"internal">,
): AppRenderContextInternalLink => ({
  kind: link.kind,
  href: link.href,
  text: link.text,
  openInNewTab: link.behaviour.openInNewTab,
  svg: resolveSvgReferenceByIdAppRenderContext(appContext, link.svgId),
});

const appRenderContextResolveExternalLink = (
  appContext: AppContext,
  link: LinkByKind<"external">,
): AppRenderContextLink => ({
  kind: link.kind,
  href: link.href,
  text: link.text,
  openInNewTab: link.behaviour.openInNewTab,
  svg: resolveSvgReferenceByIdAppRenderContext(appContext, link.svgId),
});

const LINK_RESOLVERS: LinkResolverRegistry = {
  internal: appRenderContextResolveInternalLink,
  external: appRenderContextResolveExternalLink,
};

export const appRenderContextResolveLink = <TLink extends AppContextLink>(
  appContext: AppContext,
  link: TLink,
): RenderLinkByKind<TLink> => {
  const resolver = LINK_RESOLVERS[link.kind];

  if (!resolver) {
    throw new Error(
      `No AppRenderContext link resolver registered for kind: ${link.kind}`,
    );
  }

  return resolver(appContext, link as never) as RenderLinkByKind<TLink>;
};
