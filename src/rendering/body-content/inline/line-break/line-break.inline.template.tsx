// src/rendering/body-content/inline/line-break/line-break.inline.template.tsx

import type { AppRenderContextLineBreakInline } from "@shared-types/page-content/inline/line-break/app-render-context.line-break.inline-content.types";

type LineBreakInlineTemplateProps = Readonly<{
  item: AppRenderContextLineBreakInline;
}>;

export const LineBreakInlineTemplate = (
  _props: LineBreakInlineTemplateProps,
) => <br />;
