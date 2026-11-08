// src/app/life-cycle/app-render/primitives/svg/svg.primitive.app-render.tsx

import type { SvgReferenceAppRenderContext } from "../../../../types/primitives/assets/svg/svg.asset.app-render-context.type";

type Props = Readonly<{
  svg: SvgReferenceAppRenderContext;
  className?: string;
}>;

export const Svg = ({ svg, className }: Props) => (
  <svg
    className={className}
    aria-hidden="true"
    width={svg.width}
    height={svg.height}
  >
    <use href={`#${svg.id}`} />
  </svg>
);
