// src/app-render-context/resolve/body-footer/affiliations.resolve.body-footer.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextBodyFooterAffiliations } from "@app-render-context/types/body-footer.app-render-context.types";
import type { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";

import { resolveSvgReferenceByIdAppRenderContext } from "@app-render-context/shared/svg-reference-by-id.resolve.app-render-context";

const resolveAffiliationLogoOrThrow = (
  appContext: AppContext,
  svgId: SvgAssetId,
) => {
  const logo = resolveSvgReferenceByIdAppRenderContext(appContext, svgId);

  if (!logo) {
    throw new Error(
      `Footer affiliation logo could not be resolved for svgId "${svgId}".`,
    );
  }

  return logo;
};

export const resolveAffiliationsBodyFooterAppRenderContext = (
  appContext: AppContext,
): AppRenderContextBodyFooterAffiliations => {
  const { affiliations } = appContext.globalFooter;

  return {
    items: affiliations.items.map((item) => ({
      ariaLabel: item.label,
      href: item.href,
      logo: resolveAffiliationLogoOrThrow(appContext, item.svgId),
    })),
  };
};
