// src/app/life-cycle/app-resolve/resolvers/content/components/component.content.resolver.app-resolve.ts

import type { ComponentContentAppInit } from "../../../../../../shared/types/content/components/component.content.shared.app-init.type";
import type { ComponentContentAppResolve } from "../../../../../types/document/page/content/components/component.content.page.document.app-resolve.type";
import type { ContentRegistryAppResolve } from "../../../../../types/registries/content.registry.app-resolve.type";
import type { PhotoGetter } from "../../../getters/photo-kv/photo-kv.getter.app-resolve";

import type { ParagraphComponentContentAppInit } from "../../../../../../shared/types/content/components/paragraph.component.content.shared.app-init.type";
import type { ListComponentContentAppInit } from "../../../../../../shared/types/content/components/list.component.content.shared.app-init.type";
import type { PhotoComponentContentAppInit } from "../../../../../../shared/types/content/components/photo.component.content.shared.app-init.type";

import { resolveParagraphComponentContentAppResolve } from "./paragraph/paragraph.component.content.resolver.app-resolve";
import { resolveListComponentContentAppResolve } from "./list/list.component.content.resolver.app-resolve";
import { resolvePhotoComponentContentAppResolve } from "./photo/photo.component.content.resolver.app-resolve";
import { resolveEditorialPhotoComponentContentAppResolve } from "./editorial-photo/editorial-photo.component.content.resolver.app-resolve";
import { resolveRichListComponentContentAppResolve } from "./rich-list/rich-list.component.content.resolver.app-resolve";

type Input = Readonly<{
  content: ComponentContentAppInit;
  contentRegistry: ContentRegistryAppResolve;
  getPhoto: PhotoGetter;
}>;

const resolverLibrary = {
  paragraph: ({ content, contentRegistry }: Input) =>
    resolveParagraphComponentContentAppResolve({
      content: content as ParagraphComponentContentAppInit,
      contentRegistry,
    }),

  list: ({ content, contentRegistry }: Input) =>
    resolveListComponentContentAppResolve({
      content: content as ListComponentContentAppInit,
      contentRegistry,
    }),

  photo: ({ content, getPhoto }: Input) =>
    resolvePhotoComponentContentAppResolve({
      content: content as PhotoComponentContentAppInit,
      getPhoto,
    }),
  editorialPhoto: resolveEditorialPhotoComponentContentAppResolve,
  richList: resolveRichListComponentContentAppResolve,
} satisfies Record<ComponentContentAppInit["kind"], unknown>;

export const resolveComponentContentAppResolve = async ({
  content,
  contentRegistry,
  getPhoto,
}: Input): Promise<ComponentContentAppResolve> => {
  const resolver = resolverLibrary[content.kind] as (
    input: Input,
  ) => ComponentContentAppResolve | Promise<ComponentContentAppResolve>;

  return resolver({ content, contentRegistry, getPhoto });
};
