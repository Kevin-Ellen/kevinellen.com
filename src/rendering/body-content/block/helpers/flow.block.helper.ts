// src/rendering/body-content/block/helpers/flow.block.helper.ts

import type { BlockFlow } from "@shared-types/page-content/block/shared.block.types";

export const renderBlockFlowClass = (
  flow: BlockFlow | null | undefined,
): string => {
  const resolvedFlow = flow ?? "content";

  return resolvedFlow === "content"
    ? "l-content"
    : `m-contentBlock--${resolvedFlow}`;
};
