// src/app/life-cycle/app-render-context/resolvers/document/page/body/inline/inline.body.page.document.content.resolver.app-render-context.ts

import type { InlineContentAppResolve } from "../../../../../../../types/document/page/content/inline/inline.content.page.document.app-resolve.type";
import type { InlineContentAppRenderContext } from "../../../../../../../types/document/page/content/inline/inline.content.page.document.app-render-context.type";

import { resolveTextInlineContentAppRenderContext } from "./text/text.inline.body.page.document.content.resolver.app-render-context";
import { resolveLinkInlineContentAppRenderContext } from "./link/link.inline.body.page.document.content.resolver.app-render-context";

type Input = Readonly<{
  content: InlineContentAppResolve;
}>;

const resolverLibrary = {
  text: resolveTextInlineContentAppRenderContext,
  link: resolveLinkInlineContentAppRenderContext,
};

export const resolveContentInlineAppRenderContext = ({
  content,
}: Input): InlineContentAppRenderContext => {
  const resolver = resolverLibrary[content.kind] as (
    input: Input,
  ) => InlineContentAppRenderContext;

  return resolver({ content });
};
