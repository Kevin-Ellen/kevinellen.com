// src/app/life-cycle/app-render-context/resolvers/document/page/body/inline/link/link.inline.body.page.document.content.resolver.app-render-context.ts

import type { LinkInlineContentAppResolve } from "../../../../../../../../types/document/page/content/inline/link/link.inline.content.page.document.app-resolve.type";
import type { LinkInlineContentAppRenderContext } from "../../../../../../../../types/document/page/content/inline/link/link.inline.content.page.document.app-render-context.type";

type Input = Readonly<{
  content: LinkInlineContentAppResolve;
}>;

export const resolveLinkInlineContentAppRenderContext = ({
  content,
}: Input): LinkInlineContentAppRenderContext => content;
