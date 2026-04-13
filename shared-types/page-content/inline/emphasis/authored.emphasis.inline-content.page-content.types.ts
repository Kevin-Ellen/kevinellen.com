// shared-types/page-content/inline/emphasis/authored.emphasis.inline-content.page-content.types.ts

import type { AuthoredInlineContent } from "@shared-types/page-content/inline/authored.inline-content.page-content.types";

export type AuthoredEmphasisInlineContent = Readonly<{
  kind: "emphasis";
  content: readonly AuthoredInlineContent[];
}>;
