// src/rendering/body-content/inline/strong/strong.inline.template.tsx

import type { AppRenderContextStrongInline } from "@shared-types/page-content/inline/strong/app-render-context.strong.inline-content.types";

import { InlineContentTemplate } from "@rendering/body-content/inline/inline.template";

type StrongInlineTemplateProps = Readonly<{
  item: AppRenderContextStrongInline;
}>;

export const StrongInlineTemplate = ({ item }: StrongInlineTemplateProps) => (
  <strong>
    <InlineContentTemplate content={item.content} />
  </strong>
);
