// src/shared/resolvers/content/inline/text/text.inline.content.resolver.shared.app-init.ts

import type { TextInlineContentAuthored } from "../../../../../content-schema/content/inline/text.inline.content.content-schema.authored.type";
import type { TextInlineContentAppInit } from "../../../../types/content/inline/text.inline.content.app-init.type";

export const resolveTextInlineContentAppInit = (
  authored: TextInlineContentAuthored,
): TextInlineContentAppInit => authored;
