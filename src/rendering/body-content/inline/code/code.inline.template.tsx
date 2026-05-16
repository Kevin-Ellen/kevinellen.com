// src/rendering/body-content/inline/code/code.inline.template.tsx

import type { AppRenderContextCodeInline } from "@shared-types/page-content/inline/code/app-render-context.code.inline-content.types";

type CodeInlineTemplateProps = Readonly<{
  item: AppRenderContextCodeInline;
}>;

export const CodeInlineTemplate = ({ item }: CodeInlineTemplateProps) => (
  <code>{item.value}</code>
);
