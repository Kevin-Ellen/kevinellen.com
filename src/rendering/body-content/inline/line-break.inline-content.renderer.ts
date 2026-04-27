// src/rendering/body-content/inline/line-break.inline-content.renderer.ts

import type { AppRenderContextLineBreakInlineContent } from "@shared-types/page-content/inline/line-break/app-render-context.line-break.inline-content.page-content.types";

export const renderLineBreakInlineContent = (
  _item: AppRenderContextLineBreakInlineContent,
): string => "<br>";
