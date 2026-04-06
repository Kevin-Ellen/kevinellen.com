// src/app/renderContext/content/modules/paragraph/paragraph.module.renderContext.types.ts

import type { ContentInlineResolved } from "@app/renderContext/content/inline-content/inline-content.types";

export type RenderContextParagraphModule = {
  kind: "paragraph";
  content: readonly ContentInlineResolved[];
};
