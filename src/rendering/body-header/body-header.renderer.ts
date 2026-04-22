// src/rendering/body-header/body-header.renderer.ts

import type { AppRenderContextBodyHeader } from "@app-render-context/types/body-header.app-render-context.types";

import { renderBodyHeaderBranding } from "@rendering/body-header/branding.body-header.renderer";
import { renderBodyHeaderNavigation } from "@rendering/body-header/navigation.body-header.renderer";
import { renderBodyHeaderBreadcrumbs } from "@rendering/body-header/breadcrumbs.body-header.renderer";

export const renderBodyHeader = (
  bodyHeader: AppRenderContextBodyHeader,
): string => {
  return `<header class="l-header">
    <div class="l-page__frame">
      <div class="l-header__top">
        ${renderBodyHeaderBranding(bodyHeader.branding)}
        ${renderBodyHeaderNavigation(bodyHeader.navigation)}
      </div>
      ${renderBodyHeaderBreadcrumbs(bodyHeader.breadcrumbs)}
    </div>
  </header>
  <div class="l-header-sentinel" aria-hidden="true"></div>`;
};
