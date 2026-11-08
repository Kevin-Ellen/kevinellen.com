// src/app/life-cycle/app-resolve/resolvers/content/inline/link/link.inline.content.resolver.app-resolve.ts

import type { LinkInlineContentAppInit } from "../../../../../../../shared/types/content/inline/link.inline.content.app-init.type";
import type { LinkInlineContentAppResolve } from "../../../../../../types/document/page/content/inline/link/link.inline.content.page.document.app-resolve.type";
import type { ContentRegistryAppResolve } from "../../../../../../types/registries/content.registry.app-resolve.type";

import { resolveLinkAppResolve } from "../../../primitives/link/link.primitive.resolver.app-resolve";

type Input = Readonly<{
  content: LinkInlineContentAppInit;
  contentRegistry: ContentRegistryAppResolve;
}>;

export const resolveLinkInlineContentAppResolve = ({
  content,
  contentRegistry,
}: Input): LinkInlineContentAppResolve => ({
  ...content,
  link: resolveLinkAppResolve({
    link: content.link,
    registry: contentRegistry,
  }),
});
