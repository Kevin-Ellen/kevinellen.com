// src/app/appContext/content/modules/paragraph/paragraph.module.appContext.types.ts

import type { ContentInlineResolved } from "@app/appContext/content/inline-content/inline-content.types";

export type AppContextParagraphModule = {
  kind: "paragraph";
  content: readonly ContentInlineResolved[];
};
