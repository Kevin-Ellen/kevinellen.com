// shared-types/page-content/inline/app-context.inline-content.types.ts

import type { AppContextCodeInline } from "@shared-types/page-content/inline/code/app-context.code.inline-content.types";
import type { AppContextLineBreakInline } from "@shared-types/page-content/inline/line-break/app-context.line-break.inline-content.types";
import type { AppContextTextInline } from "@shared-types/page-content/inline/text/app-context.text.inline-content.types";
import type { AppContextEmphasisInline } from "@shared-types/page-content/inline/emphasis/app-context.emphasis.inline-content.types";
import type { AppContextStrongInline } from "@shared-types/page-content/inline/strong/app-context.strong.inline-content.types";
import type { AppContextInternalLinkInline } from "@shared-types/page-content/inline/internal-link/app-context.internal-link.inline-content.types";
import type { AppContextExternalLinkInline } from "@shared-types/page-content/inline/external-link/app-context.external-link.inline-content.types";

export type AppContextInline =
  | AppContextCodeInline
  | AppContextLineBreakInline
  | AppContextTextInline
  | AppContextEmphasisInline
  | AppContextStrongInline
  | AppContextInternalLinkInline
  | AppContextExternalLinkInline;
