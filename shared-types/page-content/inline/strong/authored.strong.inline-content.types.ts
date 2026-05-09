// shared-types/page-content/inline/strong/authored.strong.inline-content.types.ts

import type { AuthoredInline } from "@shared-types/page-content/inline/authored.inline-content.types";

export type AuthoredStrongInline = Readonly<{
  kind: "strong";
  content: readonly AuthoredInline[];
}>;
