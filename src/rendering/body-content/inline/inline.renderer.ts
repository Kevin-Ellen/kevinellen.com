// src/rendering/body-content/inline/inline.renderer.ts

import type { AppRenderContextInline } from "@shared-types/page-content/inline/app-render-context.inline-content.types";

import { renderCodeInline } from "@rendering/body-content/inline/code.inline.renderer";
import { renderEmphasisInline } from "@rendering/body-content/inline/emphasis.inline.renderer";
import { renderLineBreakInline } from "@rendering/body-content/inline/line-break.inline.renderer";
import { renderLinkInline } from "@rendering/body-content/inline/link.inline.renderer";
import { renderStrongInlineContent } from "@rendering/body-content/inline/strong.inline.renderer";
import { renderTextInline } from "@rendering/body-content/inline/text.inline.renderer";

type InlineRendererMap = Readonly<{
  [K in AppRenderContextInline["kind"]]: (
    item: Extract<AppRenderContextInline, { kind: K }>,
  ) => string;
}>;

const inlineRenderers = {
  text: renderTextInline,
  link: renderLinkInline,
  code: renderCodeInline,
  emphasis: renderEmphasisInline,
  strong: renderStrongInlineContent,
  lineBreak: renderLineBreakInline,
} satisfies InlineRendererMap;

export const renderInlineContentItem = (
  item: AppRenderContextInline,
): string => {
  const renderer = inlineRenderers[item.kind] as (
    item: AppRenderContextInline,
  ) => string;

  return renderer(item);
};

export const renderInlineContent = (
  content: readonly AppRenderContextInline[],
): string => content.map(renderInlineContentItem).join("");
