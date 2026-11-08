// src/app/life-cycle/app-render-context/resolvers/document/page/body/components/list/list.component.body.page.document.content.resolver.app-render-context.ts

import type { ListComponentContentAppResolve } from "../../../../../../../../types/document/page/content/components/list/list.component.content.page.document.app-resolve.type";
import type { ListComponentContentAppRenderContext } from "../../../../../../../../types/document/page/content/components/list/list.component.content.page.document.app-render-context.type";

import { resolveContentInlineAppRenderContext } from "../../inline/inline.body.page.document.content.resolver.app-render-context";

type Input = Readonly<{
  content: ListComponentContentAppResolve;
}>;

export const resolveListComponentContentAppRenderContext = ({
  content,
}: Input): ListComponentContentAppRenderContext => ({
  ...content,
  items: content.items.map((item) => ({
    ...item,
    content: item.content.map((inline) =>
      resolveContentInlineAppRenderContext({ content: inline }),
    ),
  })),
});
