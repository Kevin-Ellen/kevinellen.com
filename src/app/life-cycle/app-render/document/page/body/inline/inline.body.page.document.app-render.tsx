// src/app/life-cycle/app-render/document/page/body/inline/inline.body.page.document.app-render.tsx

import type { ComponentType } from "react";

import type { InlineContentAppRenderContext } from "../../../../../../types/document/page/content/inline/inline.content.page.document.app-render-context.type";

import { TextInline } from "./text/text.inline.body.page.document.app-render";
import { LinkInline } from "./link/link.inline.body.page.document.app-render";

type Props = Readonly<{
  content: InlineContentAppRenderContext;
}>;

const rendererLibrary = {
  text: TextInline,
  link: LinkInline,
} satisfies Record<InlineContentAppRenderContext["kind"], unknown>;

export const Inline = ({ content }: Props) => {
  const Component = rendererLibrary[content.kind] as ComponentType<Props>;

  return <Component content={content} />;
};
