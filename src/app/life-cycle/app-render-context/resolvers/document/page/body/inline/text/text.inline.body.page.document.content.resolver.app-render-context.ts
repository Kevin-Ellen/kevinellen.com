// src/app/life-cycle/app-render-context/resolvers/document/page/body/inline/text/text.inline.body.page.document.content.resolver.app-render-context.ts

import type { TextInlineContentAppResolve } from "../../../../../../../../types/document/page/content/inline/text/text.inline.content.page.document.app-resolve.type";
import type { TextInlineContentAppRenderContext } from "../../../../../../../../types/document/page/content/inline/text/text.inline.content.page.document.app-render-context.type";

type Input = Readonly<{
  content: TextInlineContentAppResolve;
}>;

export const resolveTextInlineContentAppRenderContext = ({
  content,
}: Input): TextInlineContentAppRenderContext => content;
