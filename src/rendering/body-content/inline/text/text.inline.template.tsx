// src/rendering/body-content/inline/text/text.inline.template.tsx

import type { AppRenderContextTextInline } from "@shared-types/page-content/inline/text/app-render-context.text.inline-content.types";

type TextInlineTemplateProps = Readonly<{
  item: AppRenderContextTextInline;
}>;

export const TextInlineTemplate = ({ item }: TextInlineTemplateProps) =>
  item.value;
