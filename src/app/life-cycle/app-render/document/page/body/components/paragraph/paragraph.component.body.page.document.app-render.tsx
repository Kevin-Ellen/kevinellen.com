// src/app/life-cycle/app-render/document/page/body/components/paragraph/paragraph.component.body.page.document.app-render.tsx

import type { ParagraphComponentContentAppRenderContext } from "../../../../../../../types/document/page/content/components/paragraph/paragraph.component.content.page.document.app-render-context.type";

import { Inline } from "../../inline/inline.body.page.document.app-render";

type Props = Readonly<{
  paragraph: ParagraphComponentContentAppRenderContext;
  className?: string;
}>;

export const ParagraphComponent = ({ paragraph, className }: Props) => (
  <p className={["c-paragraph", className].filter(Boolean).join(" ")}>
    {paragraph.content.map((content, index) => (
      <Inline key={index} content={content} />
    ))}
  </p>
);
