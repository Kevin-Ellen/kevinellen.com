// src/app/life-cycle/app-resolve/resolvers/content/components/paragraph/paragraph.component.content.resolver.app-resolve.ts

import type { ParagraphComponentContentAppInit } from "../../../../../../../shared/types/content/components/paragraph.component.content.shared.app-init.type";
import type { ParagraphComponentContentAppResolve } from "../../../../../../types/document/page/content/components/paragraph/paragraph.component.content.page.document.app-resolve.type";
import type { ContentRegistryAppResolve } from "../../../../../../types/registries/content.registry.app-resolve.type";

import { resolveContentInlineAppResolve } from "../../inline/inline.content.resolver.app-resolve";

type Input = Readonly<{
  content: ParagraphComponentContentAppInit;
  contentRegistry: ContentRegistryAppResolve;
}>;

export const resolveParagraphComponentContentAppResolve = ({
  content,
  contentRegistry,
}: Input): ParagraphComponentContentAppResolve => ({
  ...content,
  content: content.content.map((inline) =>
    resolveContentInlineAppResolve({
      content: inline,
      contentRegistry,
    }),
  ),
});
