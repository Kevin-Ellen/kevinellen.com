// src/app/life-cycle/app-render-context/resolvers/document/page/body/components/component.body.page.document.content.resolver.app-render-context.ts

import type { ComponentContentAppResolve } from "../../../../../../../types/document/page/content/components/component.content.page.document.app-resolve.type";
import type { ComponentContentAppRenderContext } from "../../../../../../../types/document/page/content/components/component.content.page.document.app-render-context.type";

import type { ParagraphComponentContentAppResolve } from "../../../../../../../types/document/page/content/components/paragraph/paragraph.component.content.page.document.app-resolve.type";
import type { ListComponentContentAppResolve } from "../../../../../../../types/document/page/content/components/list/list.component.content.page.document.app-resolve.type";
import type { PhotoComponentContentAppResolve } from "../../../../../../../types/document/page/content/components/photo/photo.component.content.page.document.app-resolve.type";

import { resolveParagraphComponentContentAppRenderContext } from "./paragraph/paragraph.component.body.page.document.content.resolver.app-render-context";
import { resolveListComponentContentAppRenderContext } from "./list/list.component.body.page.document.content.resolver.app-render-context";
import { resolvePhotoComponentContentAppRenderContext } from "./photo/photo.component.body.page.document.content.resolver.app-render-context";
import { resolveEditorialPhotoComponentContentAppRenderContext } from "./editorial-photo/editorial-photo.component.body.page.document.content.resolver.app-render-context";
import { resolveRichListComponentContentAppRenderContext } from "./rich-list/rich-list.component.body.page.document.content.resolver.app-render-context";

type Input = Readonly<{
  content: ComponentContentAppResolve;
}>;

type ComponentKind = ComponentContentAppResolve["kind"];

type ResolverLibrary = {
  [K in ComponentKind]: (
    input: Readonly<{
      content: Extract<ComponentContentAppResolve, { kind: K }>;
    }>,
  ) => Extract<ComponentContentAppRenderContext, { kind: K }>;
};

const resolverLibrary = {
  paragraph: ({ content }: Input) =>
    resolveParagraphComponentContentAppRenderContext({
      content: content as ParagraphComponentContentAppResolve,
    }),

  list: ({ content }: Input) =>
    resolveListComponentContentAppRenderContext({
      content: content as ListComponentContentAppResolve,
    }),

  photo: ({ content }: Input) =>
    resolvePhotoComponentContentAppRenderContext({
      content: content as PhotoComponentContentAppResolve,
    }),

  editorialPhoto: resolveEditorialPhotoComponentContentAppRenderContext,
  richList: resolveRichListComponentContentAppRenderContext,
} satisfies ResolverLibrary;

export const resolveComponentContentAppRenderContext = ({
  content,
}: Input): ComponentContentAppRenderContext => {
  const resolver = resolverLibrary[content.kind] as (
    input: Input,
  ) => ComponentContentAppRenderContext;

  return resolver({ content });
};
