// src/app-state/resolve/page-content/block/sequence/sequence.resolve.app-state.ts

import type { AuthoredSequenceBlock } from "@shared-types/page-content/block/sequence/authored.sequence.block.types";
import type { AppStateSequenceBlock } from "@shared-types/page-content/block/sequence/app-state.sequence.block.types";

import { appStateResolveInline } from "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state";

export const appStateResolveSequenceBlock = (
  block: AuthoredSequenceBlock,
): AppStateSequenceBlock => {
  return {
    ...block,
    immersive: block.immersive ?? false,
    flow: block.flow ?? "content",
    caption: block.caption.map(appStateResolveInline),
  };
};
