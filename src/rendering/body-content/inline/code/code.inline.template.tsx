// src/rendering/body-content/inline/code/code.inline.template.tsx

import type { AppRenderContextCodeInline } from "@shared-types/page-content/inline/code/app-render-context.code.inline-content.types";

import { CodeTemplate } from "@rendering/shared/code.shared.template";

type CodeInlineTemplateProps = Readonly<{
  item: AppRenderContextCodeInline;
}>;

export const CodeInlineTemplate = ({ item }: CodeInlineTemplateProps) => (
  <CodeTemplate value={item.value} language={item.language} />
);
