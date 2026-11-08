// src/app/types/document/page/content/inline/inline.content.page.document.app-render-context.type.ts

import type { LinkInlineContentAppRenderContext } from "./link/link.inline.content.page.document.app-render-context.type";
import type { TextInlineContentAppRenderContext } from "./text/text.inline.content.page.document.app-render-context.type";

export type InlineContentAppRenderContext =
  | LinkInlineContentAppRenderContext
  | TextInlineContentAppRenderContext;
