// src/rendering/body-content/block/helpers/flow.block.body-content.helper.ts

import type { BlockContentModuleFlow } from "@shared-types/page-content/block/shared.block.content.types";

import { escapeAttribute } from "@rendering/utils/html.escape.util.renderer";

export const getBlockFlowClass = (
  flow: BlockContentModuleFlow | null | undefined,
): string => {
  const resolvedFlow = flow ?? "content";

  return resolvedFlow === "content"
    ? "l-content"
    : `m-contentBlock--${escapeAttribute(resolvedFlow)}`;
};
