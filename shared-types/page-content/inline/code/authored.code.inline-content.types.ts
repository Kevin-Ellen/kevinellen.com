// shared-types/page-content/inline/code/authored.code.inline-content.types.ts

import type { CodeLanguage } from "@shared-types/page-content/shared/code/authored.code.shared.types";

export type AuthoredCodeInline = Readonly<{
  kind: "code";
  value: string;
  language?: CodeLanguage;
}>;
