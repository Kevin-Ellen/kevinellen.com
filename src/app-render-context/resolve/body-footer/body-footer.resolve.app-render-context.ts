// src/app-render-context/resolve/body-footer/body-footer.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextBodyFooter } from "@app-render-context/types/body-footer.app-render-context.types";

import { resolveNavBodyFooterAppRenderContext } from "@app-render-context/resolve/body-footer/nav.resolve.body-footer.app-render-context";
import { resolveAffiliationsBodyFooterAppRenderContext } from "@app-render-context/resolve/body-footer/affiliations.resolve.body-footer.app-render-context";
import { resolveColophonBodyFooterAppRenderContext } from "@app-render-context/resolve/body-footer/colophon.resolve.body-footer.app-render-context";

export const resolveBodyFooterAppRenderContext = (
  appContext: AppContext,
): AppRenderContextBodyFooter => {
  return {
    nav: resolveNavBodyFooterAppRenderContext(appContext),
    affiliations: resolveAffiliationsBodyFooterAppRenderContext(appContext),
    colophon: resolveColophonBodyFooterAppRenderContext(appContext),
  };
};
