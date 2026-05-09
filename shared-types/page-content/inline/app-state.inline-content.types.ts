// shared-types/page-content/inline/app-state.inline-content.types.ts

import type { AppStateCodeInline } from "@shared-types/page-content/inline/code/app-state.code.inline-content.types";
import type { AppStateLineBreakInline } from "@shared-types/page-content/inline/line-break/app-state.line-break.inline-content.types";
import type { AppStateTextInline } from "@shared-types/page-content/inline/text/app-state.text.inline-content.types";
import type { AppStateEmphasisInline } from "@shared-types/page-content/inline/emphasis/app-state.emphasis.inline-content.types";
import type { AppStateStrongInline } from "@shared-types/page-content/inline/strong/app-state.strong.inline-content.types";
import type { AppStateInternalLinkInline } from "@shared-types/page-content/inline/internal-link/app-state.internal-link.inline-content.types";
import type { AppStateExternalLinkInline } from "@shared-types/page-content/inline/external-link/app-state.external-link.inline-content.types";

export type AppStateInline =
  | AppStateCodeInline
  | AppStateLineBreakInline
  | AppStateTextInline
  | AppStateEmphasisInline
  | AppStateStrongInline
  | AppStateInternalLinkInline
  | AppStateExternalLinkInline;
