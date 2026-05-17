// src/rendering/body-content/inline/emphasis/emphasis.inline.template.tsx

import type { AppRenderContextEmphasisInline } from "@shared-types/page-content/inline/emphasis/app-render-context.emphasis.inline-content.types";

import { InlineContentTemplate } from "@rendering/body-content/inline/inline.template";

type EmphasisInlineTemplateProps = Readonly<{
  item: AppRenderContextEmphasisInline;
}>;

export const EmphasisInlineTemplate = ({
  item,
}: EmphasisInlineTemplateProps) => (
  <em>
    <InlineContentTemplate content={item.content} />
  </em>
);
