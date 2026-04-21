// shared-types/page-content/inline/app-context.inline-content.page-content.types.ts

import type { AppContextCodeInlineContent } from "@shared-types/page-content/inline/code/app-context.code.inline-content.page-content.types";
import type { AppContextLineBreakInlineContent } from "@shared-types/page-content/inline/line-break/app-context.line-break.inline-content.page-content.types";
import type { AppContextTextInlineContent } from "@shared-types/page-content/inline/text/app-context.text.inline-content.page-content.types";
import type { AppContextEmphasisInlineContent } from "@shared-types/page-content/inline/emphasis/app-context.emphasis.inline-content.page-content.types";
import type { AppContextStrongInlineContent } from "@shared-types/page-content/inline/strong/app-context.strong.inline-content.page-content.types";
import type { AppContextInternalLinkInlineContent } from "@shared-types/page-content/inline/internal-link/app-context.internal-link.inline-content.page-content.types";
import type { AppContextExternalLinkInlineContent } from "@shared-types/page-content/inline/external-link/app-context.external-link.inline-content.page-content.types";

export type AppContextInlineContent =
  | AppContextTextInlineContent
  | AppContextCodeInlineContent
  | AppContextLineBreakInlineContent
  | AppContextEmphasisInlineContent
  | AppContextStrongInlineContent
  | AppContextInternalLinkInlineContent
  | AppContextExternalLinkInlineContent;
