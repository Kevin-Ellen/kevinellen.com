// src/app/life-cycle/app-render-context/resolvers/document/page/body/components/paragraph/paragraph.component.body.page.document.content.resolver.app-render-context.ts

import type { ParagraphComponentContentAppResolve } from "../../../../../../../../types/document/page/content/components/paragraph/paragraph.component.content.page.document.app-resolve.type";
import type { ParagraphComponentContentAppRenderContext } from "../../../../../../../../types/document/page/content/components/paragraph/paragraph.component.content.page.document.app-render-context.type";

import { resolveContentInlineAppRenderContext } from "../../inline/inline.body.page.document.content.resolver.app-render-context";

type Input = Readonly<{
  content: ParagraphComponentContentAppResolve;
}>;

export const resolveParagraphComponentContentAppRenderContext = ({
  content,
}: Input): ParagraphComponentContentAppRenderContext => ({
  ...content,
  content: content.content.map((inline) =>
    resolveContentInlineAppRenderContext({ content: inline }),
  ),
});
