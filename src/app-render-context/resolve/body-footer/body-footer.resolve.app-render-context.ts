// src/app-render-context/resolve/body-footer/body-footer.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextBodyFooter } from "@app-render-context/types/body-footer.app-render-context.types";

import { appRenderContextResolveBodyFooterAffiliations } from "@app-render-context/resolve/body-footer/affiliations.body-footer.resolve.app-render-context";
import { appRenderContextResolveBodyFooterColophon } from "@app-render-context/resolve/body-footer/colophon.body-footer.resolve.app-render-context";
import { appRenderContextResolveBodyFooterNav } from "@app-render-context/resolve/body-footer/nav.body-footer.resolve.app-render-context";

export const appRenderContextResolveBodyFooter = (
  appContext: AppContext,
): AppRenderContextBodyFooter => {
  return {
    nav: appRenderContextResolveBodyFooterNav(appContext),
    affiliations: appRenderContextResolveBodyFooterAffiliations(appContext),
    colophon: appRenderContextResolveBodyFooterColophon(appContext),
  };
};
