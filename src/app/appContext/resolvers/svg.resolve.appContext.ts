// src/app/appContext/resolvers/helpers/svg.resolve.appContext.ts

import type { AppContextSvgReference } from "@app/appContext/appContext.types";

export const resolveSvgReferenceAppContext = (
  svgId: string | null | undefined,
): AppContextSvgReference | undefined => {
  if (!svgId) {
    return undefined;
  }

  return {
    type: "inline-svg",
    id: svgId,
  };
};
