// shared-types/page-content/inline/emphasis/authored.emphasis.inline-content.types.ts

import type { AuthoredInline } from "@shared-types/page-content/inline/authored.inline-content.types";

export type AuthoredEmphasisInline = Readonly<{
  kind: "emphasis";
  content: readonly AuthoredInline[];
}>;
