// src/rendering/body-content/inline/inline-content.body-content.renderer.ts

import type { AppRenderContextInlineContent } from "@shared-types/page-content/inline/app-render-context.inline-content.page-content.types";

import { renderTextInlineContent } from "@rendering/body-content/inline/text.inline-content.renderer";
import { renderLinkInlineContent } from "@rendering/body-content/inline/link.inline-content.renderer";
import { renderCodeInlineContent } from "@rendering/body-content/inline/code.inline-content.renderer";
import { renderEmphasisInlineContent } from "@rendering/body-content/inline/emphasis.inline-content.renderer";
import { renderStrongInlineContent } from "@rendering/body-content/inline/strong.inline-content.renderer";
import { renderLineBreakInlineContent } from "@rendering/body-content/inline/line-break.inline-content.renderer";

type InlineContentRendererMap = Readonly<{
  [K in AppRenderContextInlineContent["kind"]]: (
    item: Extract<AppRenderContextInlineContent, { kind: K }>,
  ) => string;
}>;

const inlineContentRenderers = {
  text: renderTextInlineContent,
  link: renderLinkInlineContent,
  code: renderCodeInlineContent,
  emphasis: renderEmphasisInlineContent,
  strong: renderStrongInlineContent,
  lineBreak: renderLineBreakInlineContent,
} satisfies InlineContentRendererMap;

export const renderInlineContentItem = (
  item: AppRenderContextInlineContent,
): string => {
  const renderer = inlineContentRenderers[item.kind] as (
    item: AppRenderContextInlineContent,
  ) => string;

  return renderer(item);
};

export const renderInlineContent = (
  content: readonly AppRenderContextInlineContent[],
): string => content.map(renderInlineContentItem).join("");
