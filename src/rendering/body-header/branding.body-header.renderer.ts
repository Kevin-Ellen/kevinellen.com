// src/rendering/body-header/branding.body-header.renderer.ts

import type { AppRenderContextBodyHeaderBranding } from "@app-render-context/types/body-header.app-render-context.types";

import { escapeAttribute } from "@rendering/utils/html.escape.util.renderer";

export const renderBodyHeaderBranding = (
  branding: AppRenderContextBodyHeaderBranding,
): string => {
  return `<a class="l-header__brand" href="${escapeAttribute(branding.href)}" aria-label="${escapeAttribute(branding.ariaLabel)}">
    <svg class="l-header__brand-logo" aria-hidden="true" width="${branding.logo.width}" height="${branding.logo.height}">
      <use href="#${escapeAttribute(branding.logo.id)}"></use>
    </svg>
  </a>`;
};
