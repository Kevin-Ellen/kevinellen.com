// src/app/life-cycle/app-render-context/resolvers/document/page/body/components/rich-list/rich-list.component.body.page.document.content.resolver.app-render-context.ts

import type { RichListComponentContentAppResolve } from "../../../../../../../../types/document/page/content/components/rich-list/rich-list.component.content.page.document.app-resolve.type";
import type { RichListComponentContentAppRenderContext } from "../../../../../../../../types/document/page/content/components/rich-list/rich-list.component.content.page.document.app-render-context.type";

type Input = Readonly<{
  content: RichListComponentContentAppResolve;
}>;

export const resolveRichListComponentContentAppRenderContext = ({
  content,
}: Input): RichListComponentContentAppRenderContext => ({
  ...content,
});
