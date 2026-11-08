// src/app/types/document/page/content/components/paragraph/paragraph.component.content.page.document.app-render-context.type.ts

import type { ParagraphComponentContentAppResolve } from "./paragraph.component.content.page.document.app-resolve.type";
import type { InlineContentAppRenderContext } from "../../inline/inline.content.page.document.app-render-context.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type ParagraphComponentContentAppRenderContext = OmitAndReplace<
  ParagraphComponentContentAppResolve,
  {
    content: readonly InlineContentAppRenderContext[];
  }
>;
