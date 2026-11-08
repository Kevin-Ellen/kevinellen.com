// src/app/life-cycle/app-resolve/resolvers/content/inline/text/text.inline.content.resolver.app-resolve.ts

import type { TextInlineContentAppInit } from "../../../../../../../shared/types/content/inline/text.inline.content.app-init.type";
import type { TextInlineContentAppResolve } from "../../../../../../types/document/page/content/inline/text/text.inline.content.page.document.app-resolve.type";

type Input = Readonly<{
  content: TextInlineContentAppInit;
}>;

export const resolveTextInlineContentAppResolve = ({
  content,
}: Input): TextInlineContentAppResolve => content;
