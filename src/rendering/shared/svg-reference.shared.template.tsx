// src/rendering/shared/svg-reference.shared.template.tsx

import type { AppRenderContextSvgReference } from "@shared-types/assets/svg/app-render-context.svg.assets.types";

type SvgReferenceTemplateProps = Readonly<{
  svg: AppRenderContextSvgReference;
  className: string;
}>;

export const SvgReferenceTemplate = ({
  svg,
  className,
}: SvgReferenceTemplateProps) => (
  <svg
    className={className}
    aria-hidden="true"
    width={svg.width}
    height={svg.height}
  >
    <use href={`#${svg.id}`} />
  </svg>
);
