// shared-types/page-content/inline/authored.inline-content.types.ts

import type { AuthoredCodeInline } from "@shared-types/page-content/inline/code/authored.code.inline-content.types";
import type { AuthoredLineBreakInline } from "@shared-types/page-content/inline/line-break/authored.line-break.inline-content.types";
import type { AuthoredTextInline } from "@shared-types/page-content/inline/text/authored.text.inline-content.types";
import type { AuthoredEmphasisInline } from "@shared-types/page-content/inline/emphasis/authored.emphasis.inline-content.types";
import type { AuthoredStrongInline } from "@shared-types/page-content/inline/strong/authored.strong.inline-content.types";
import type { AuthoredInternalLinkInline } from "./internal-link/authored.internal-link.inline-content.types";
import type { AuthoredExternalLinkInline } from "./external-link/authored.external-link.inline-content.types";

export type AuthoredInline =
  | AuthoredCodeInline
  | AuthoredLineBreakInline
  | AuthoredTextInline
  | AuthoredEmphasisInline
  | AuthoredStrongInline
  | AuthoredInternalLinkInline
  | AuthoredExternalLinkInline;
