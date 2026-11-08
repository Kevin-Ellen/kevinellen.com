// src/app/life-cycle/app-render/document/page/body/inline/text/text.inline.body.page.document.app-render.tsx

import type { TextInlineContentAppRenderContext } from "../../../../../../../types/document/page/content/inline/text/text.inline.content.page.document.app-render-context.type";

type Props = Readonly<{
  content: TextInlineContentAppRenderContext;
}>;

export const TextInline = ({ content }: Props) => <>{content.value}</>;
