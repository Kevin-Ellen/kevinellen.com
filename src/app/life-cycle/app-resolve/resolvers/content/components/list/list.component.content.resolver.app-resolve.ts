// src/app/life-cycle/app-resolve/resolvers/content/components/list/list.component.content.resolver.app-resolve.ts

import type { ListComponentContentAppInit } from "../../../../../../../shared/types/content/components/list.component.content.shared.app-init.type";
import type { ListComponentContentAppResolve } from "../../../../../../types/document/page/content/components/list/list.component.content.page.document.app-resolve.type";
import type { ContentRegistryAppResolve } from "../../../../../../types/registries/content.registry.app-resolve.type";

import { resolveContentInlineAppResolve } from "../../inline/inline.content.resolver.app-resolve";

type Input = Readonly<{
  content: ListComponentContentAppInit;
  contentRegistry: ContentRegistryAppResolve;
}>;

export const resolveListComponentContentAppResolve = ({
  content,
  contentRegistry,
}: Input): ListComponentContentAppResolve => ({
  ...content,
  items: content.items.map((item) => ({
    ...item,
    content: item.content.map((inline) =>
      resolveContentInlineAppResolve({
        content: inline,
        contentRegistry,
      }),
    ),
  })),
});
