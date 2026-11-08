// src/shared/types/content/inline/inline.content.shared.app-init.type.ts

import type { LinkInlineContentAppInit } from "./link.inline.content.app-init.type";
import type { TextInlineContentAppInit } from "./text.inline.content.app-init.type";

export type InlineContentAppInit =
  | LinkInlineContentAppInit
  | TextInlineContentAppInit;
