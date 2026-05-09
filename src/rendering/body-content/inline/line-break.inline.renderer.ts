// src/rendering/body-content/inline/line-break.inline.renderer.ts

import type { AppRenderContextLineBreakInline } from "@shared-types/page-content/inline/line-break/app-render-context.line-break.inline-content.types";

export const renderLineBreakInline = (
  _item: AppRenderContextLineBreakInline,
): string => "<br>";
