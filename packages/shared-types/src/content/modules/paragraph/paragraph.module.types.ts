// packages/shared-types/src/content/modules/paragraph/paragraph.module.types.ts

import type { ContentInlineAuthored } from "@shared-types/content/inline-content/inline-content.types";

export type ParagraphModuleAuthored = {
  kind: "paragraph";
  content: readonly ContentInlineAuthored[];
};
