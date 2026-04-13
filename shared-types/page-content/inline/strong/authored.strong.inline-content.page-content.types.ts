// shared-types/page-content/inline/strong/authored.strong.inline-content.page-content.types.ts

import type { AuthoredInlineContent } from "@shared-types/page-content/inline/authored.inline-content.page-content.types";

export type AuthoredStrongInlineContent = Readonly<{
  kind: "strong";
  content: readonly AuthoredInlineContent[];
}>;
