// src/app/rendering/document/assets/resolveSvg.assets.document.rendering.ts

import type { SvgAsset } from "@app/assets/svgs/svgs.assets.types";

export const resolveSvgAsset = (
  svgs: readonly SvgAsset[],
  iconId?: string,
): SvgAsset | undefined => {
  if (iconId === undefined) {
    return undefined;
  }

  return svgs.find((svg) => svg.id === iconId);
};
