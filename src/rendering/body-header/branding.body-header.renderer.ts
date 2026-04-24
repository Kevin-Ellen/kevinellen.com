// src/rendering/body-header/branding.body-header.renderer.ts

import type { AppRenderContextBodyHeaderBranding } from "@app-render-context/types/body-header.app-render-context.types";
import { renderSvgReference } from "@rendering/shared/svg-reference.shared.renderer";
import { escapeAttribute } from "@rendering/utils/html.escape.util.renderer";

export const renderBodyHeaderBranding = (
  branding: AppRenderContextBodyHeaderBranding,
): string => {
  return `<a class="l-header__brand" href="${escapeAttribute(branding.href)}" aria-label="${escapeAttribute(branding.ariaLabel)}">
    ${renderSvgReference(branding.logo, "l-header__brand-logo")}
  </a>`;
};
