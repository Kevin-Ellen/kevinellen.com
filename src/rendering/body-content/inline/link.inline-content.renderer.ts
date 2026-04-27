// src/rendering/body-content/inline/link.inline-content.renderer.ts

import type { AppRenderContextLinkInlineContent } from "@shared-types/page-content/inline/link/app-render-context.link.inline-content.page-content.types";

import { renderTextLink } from "@rendering/shared/link.shared.renderer";

export const renderLinkInlineContent = (
  item: AppRenderContextLinkInlineContent,
): string => renderTextLink(item.link);
