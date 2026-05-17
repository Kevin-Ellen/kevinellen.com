// src/rendering/body-header/body-header.template.tsx

import type { AppRenderContextBodyHeader } from "@app-render-context/types/body-header.app-render-context.types";

import { BodyHeaderBrandingTemplate } from "@rendering/body-header/branding.body-header.template";
import { BodyHeaderBreadcrumbsTemplate } from "@rendering/body-header/breadcrumbs.body-header.template";
import { BodyHeaderNavigationTemplate } from "@rendering/body-header/navigation.body-header.template";

type BodyHeaderTemplateProps = Readonly<{
  bodyHeader: AppRenderContextBodyHeader;
}>;

export const BodyHeaderTemplate = ({ bodyHeader }: BodyHeaderTemplateProps) => (
  <>
    <header className="l-header">
      <div className="l-page__frame">
        <div className="l-header__top">
          <BodyHeaderBrandingTemplate branding={bodyHeader.branding} />
          <BodyHeaderNavigationTemplate navigation={bodyHeader.navigation} />
        </div>

        <BodyHeaderBreadcrumbsTemplate breadcrumbs={bodyHeader.breadcrumbs} />
      </div>
    </header>

    <div className="l-header-sentinel" aria-hidden="true" />
  </>
);
