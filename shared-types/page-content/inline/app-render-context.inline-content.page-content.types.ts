// shared-types/page-content/inline/app-render-context.inline-content.page-content.types.ts

import type { AppRenderContextCodeInlineContent } from "@shared-types/page-content/inline/code/app-render-context.code.inline-content.page-content.types";
import type { AppRenderContextEmphasisInlineContent } from "@shared-types/page-content/inline/emphasis/app-render-context.emphasis.inline-content.page-content.types";
import type { AppRenderContextLinkInlineContent } from "@shared-types/page-content/inline/link/app-render-context.link.inline-content.page-content.types";
import type { AppRenderContextLineBreakInlineContent } from "@shared-types/page-content/inline/line-break/app-render-context.line-break.inline-content.page-content.types";
import type { AppRenderContextStrongInlineContent } from "@shared-types/page-content/inline/strong/app-render-context.strong.inline-content.page-content.types";
import type { AppRenderContextTextInlineContent } from "@shared-types/page-content/inline/text/app-render-context.text.inline-content.page-content.types";

export type AppRenderContextInlineContent =
  | AppRenderContextCodeInlineContent
  | AppRenderContextEmphasisInlineContent
  | AppRenderContextLinkInlineContent
  | AppRenderContextLineBreakInlineContent
  | AppRenderContextStrongInlineContent
  | AppRenderContextTextInlineContent;

export type AppRenderContextTextualInlineContent = Extract<
  AppRenderContextInlineContent,
  { kind: "code" } | { kind: "text" } | { kind: "lineBreak" } | { kind: "link" }
>;

export type AppRenderContextNestedInlineContent = Extract<
  AppRenderContextInlineContent,
  { kind: "emphasis" } | { kind: "strong" }
>;
