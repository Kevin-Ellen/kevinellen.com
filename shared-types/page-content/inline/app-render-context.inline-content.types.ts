// shared-types/page-content/inline/app-render-context.inline-content.types.ts

import type { AppRenderContextCodeInline } from "@shared-types/page-content/inline/code/app-render-context.code.inline-content.types";
import type { AppRenderContextEmphasisInline } from "@shared-types/page-content/inline/emphasis/app-render-context.emphasis.inline-content.types";
import type { AppRenderContextLinkInline } from "@shared-types/page-content/inline/link/app-render-context.link.inline-content.types";
import type { AppRenderContextLineBreakInline } from "@shared-types/page-content/inline/line-break/app-render-context.line-break.inline-content.types";
import type { AppRenderContextStrongInline } from "@shared-types/page-content/inline/strong/app-render-context.strong.inline-content.types";
import type { AppRenderContextTextInline } from "@shared-types/page-content/inline/text/app-render-context.text.inline-content.types";

export type AppRenderContextInline =
  | AppRenderContextCodeInline
  | AppRenderContextEmphasisInline
  | AppRenderContextLinkInline
  | AppRenderContextLineBreakInline
  | AppRenderContextStrongInline
  | AppRenderContextTextInline;

export type AppRenderContextTextualInline = Extract<
  AppRenderContextInline,
  { kind: "code" } | { kind: "text" } | { kind: "lineBreak" } | { kind: "link" }
>;

export type AppRenderContextNestedInline = Extract<
  AppRenderContextInline,
  { kind: "emphasis" } | { kind: "strong" }
>;
