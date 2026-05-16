// src/rendering/body-content/inline/inline.template.tsx

import type { ReactNode } from "react";

import type { AppRenderContextInline } from "@shared-types/page-content/inline/app-render-context.inline-content.types";

import { CodeInlineTemplate } from "@rendering/body-content/inline/code/code.inline.template";
import { EmphasisInlineTemplate } from "@rendering/body-content/inline/emphasis/emphasis.inline.template";
import { LineBreakInlineTemplate } from "@rendering/body-content/inline/line-break/line-break.inline.template";
import { LinkInlineTemplate } from "@rendering/body-content/inline/link/link.inline.template";
import { StrongInlineTemplate } from "@rendering/body-content/inline/strong/strong.inline.template";
import { TextInlineTemplate } from "@rendering/body-content/inline/text/text.inline.template";

type InlineRendererMap = Readonly<{
  [K in AppRenderContextInline["kind"]]: (
    item: Extract<AppRenderContextInline, { kind: K }>,
  ) => ReactNode;
}>;

const inlineRenderers = {
  text: (item) => <TextInlineTemplate item={item} />,
  link: (item) => <LinkInlineTemplate item={item} />,
  code: (item) => <CodeInlineTemplate item={item} />,
  emphasis: (item) => <EmphasisInlineTemplate item={item} />,
  strong: (item) => <StrongInlineTemplate item={item} />,
  lineBreak: (item) => <LineBreakInlineTemplate item={item} />,
} satisfies InlineRendererMap;

export const InlineContentItemTemplate = ({
  item,
}: {
  item: AppRenderContextInline;
}) => {
  const renderer = inlineRenderers[item.kind] as (
    item: AppRenderContextInline,
  ) => ReactNode;

  return renderer(item);
};

type InlineContentTemplateProps = Readonly<{
  content: readonly AppRenderContextInline[];
}>;

export const InlineContentTemplate = ({
  content,
}: InlineContentTemplateProps) => (
  <>
    {content.map((item, index) => (
      <InlineContentItemTemplate key={`inline:${index}`} item={item} />
    ))}
  </>
);
