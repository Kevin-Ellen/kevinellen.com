// src/app/life-cycle/app-resolve/resolvers/content/inline/inline.content.resolver.app-resolve.ts

import type { InlineContentAppInit } from "../../../../../../shared/types/content/inline/inline.content.shared.app-init.type";
import type { InlineContentAppResolve } from "../../../../../types/document/page/content/inline/inline.content.page.document.app-resolve.type";
import type { ContentRegistryAppResolve } from "../../../../../types/registries/content.registry.app-resolve.type";

import { resolveTextInlineContentAppResolve } from "./text/text.inline.content.resolver.app-resolve";
import { resolveLinkInlineContentAppResolve } from "./link/link.inline.content.resolver.app-resolve";

type Input = Readonly<{
  content: InlineContentAppInit;
  contentRegistry: ContentRegistryAppResolve;
}>;

const resolverLibrary = {
  text: resolveTextInlineContentAppResolve,
  link: resolveLinkInlineContentAppResolve,
};

export const resolveContentInlineAppResolve = ({
  content,
  contentRegistry,
}: Input): InlineContentAppResolve => {
  const resolver = resolverLibrary[content.kind] as (
    input: Input,
  ) => InlineContentAppResolve;

  return resolver({ content, contentRegistry });
};
