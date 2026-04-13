// shared-types/page-content/inline/authored.inline-content.page-content.types.ts

import type { AuthoredCodeInlineContent } from "@shared-types/page-content/inline/code/authored.code.inline-content.page-content.types";
import type { AuthoredLineBreakInlineContent } from "@shared-types/page-content/inline/line-break/authored.line-break.inline-content.page-content.types";
import type { AuthoredTextInlineContent } from "@shared-types/page-content/inline/text/authored.text.inline-content.page-content.types";
import type { AuthoredEmphasisInlineContent } from "@shared-types/page-content/inline/emphasis/authored.emphasis.inline-content.page-content.types";
import type { AuthoredStrongInlineContent } from "@shared-types/page-content/inline/strong/authored.strong.inline-content.page-content.types";
import type { AuthoredInternalLinkInlineContent } from "./internal-link/authored.internal-link.inline-content.page-content.types";
import type { AuthoredExternalLinkInlineContent } from "./external-link/authored.external-link.inline-content.page-content.types";

export type AuthoredInlineContent =
  | AuthoredTextInlineContent
  | AuthoredCodeInlineContent
  | AuthoredLineBreakInlineContent
  | AuthoredEmphasisInlineContent
  | AuthoredStrongInlineContent
  | AuthoredInternalLinkInlineContent
  | AuthoredExternalLinkInlineContent;
