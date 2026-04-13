// shared-types/page-content/inline/app-state.inline-content.page-content.types.ts

import type { AppStateCodeInlineContent } from "@shared-types/page-content/inline/code/app-state.code.inline-content.page-content.types";
import type { AppStateLineBreakInlineContent } from "@shared-types/page-content/inline/line-break/app-state.line-break.inline-content.page-content.types";
import type { AppStateTextInlineContent } from "@shared-types/page-content/inline/text/app-state.text.inline-content.page-content.types";
import type { AppStateEmphasisInlineContent } from "@shared-types/page-content/inline/emphasis/app-state.emphasis.inline-content.page-content.types";
import type { AppStateStrongInlineContent } from "@shared-types/page-content/inline/strong/app-state.strong.inline-content.page-content.types";
import type { AppStateInternalLinkInlineContent } from "@shared-types/page-content/inline/internal-link/app-state.internal-link.inline-content.page-content.types";
import type { AppStateExternalLinkInlineContent } from "@shared-types/page-content/inline/external-link/app-state.external-link.inline-content.page-content.types";

export type AppStateInlineContent =
  | AppStateTextInlineContent
  | AppStateCodeInlineContent
  | AppStateLineBreakInlineContent
  | AppStateEmphasisInlineContent
  | AppStateStrongInlineContent
  | AppStateInternalLinkInlineContent
  | AppStateExternalLinkInlineContent;
