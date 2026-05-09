// src/rendering/body-content/inline/link.inline.renderer.ts

import type { AppRenderContextLinkInline } from "@shared-types/page-content/inline/link/app-render-context.link.inline-content.types";

import { renderTextLink } from "@rendering/shared/link.shared.renderer";

export const renderLinkInline = (item: AppRenderContextLinkInline): string =>
  renderTextLink(item.link);
