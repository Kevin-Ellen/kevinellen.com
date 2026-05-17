// src/rendering/body-header/branding.body-header.template.tsx

import type { AppRenderContextBodyHeaderBranding } from "@app-render-context/types/body-header.app-render-context.types";

import { SvgReferenceTemplate } from "@rendering/shared/svg-reference.shared.template";

type BodyHeaderBrandingTemplateProps = Readonly<{
  branding: AppRenderContextBodyHeaderBranding;
}>;

export const BodyHeaderBrandingTemplate = ({
  branding,
}: BodyHeaderBrandingTemplateProps) => (
  <a
    className="l-header__brand"
    href={branding.href}
    aria-label={branding.ariaLabel}
  >
    <SvgReferenceTemplate
      svg={branding.logo}
      className="l-header__brand-logo"
    />
  </a>
);
