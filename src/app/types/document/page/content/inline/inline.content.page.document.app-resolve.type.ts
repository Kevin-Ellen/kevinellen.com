// src/app/types/document/page/content/inline/inline.content.page.document.app-resolve.type.ts

import type { LinkInlineContentAppResolve } from "./link/link.inline.content.page.document.app-resolve.type";
import type { TextInlineContentAppResolve } from "./text/text.inline.content.page.document.app-resolve.type";

export type InlineContentAppResolve =
  | LinkInlineContentAppResolve
  | TextInlineContentAppResolve;
