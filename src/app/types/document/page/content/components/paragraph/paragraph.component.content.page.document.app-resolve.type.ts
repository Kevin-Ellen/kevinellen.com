// src/app/types/document/page/content/components/paragraph/paragraph.component.content.page.document.app-resolve.type.ts

import type { ParagraphComponentContentAppInit } from "../../../../../../../shared/types/content/components/paragraph.component.content.shared.app-init.type";
import type { InlineContentAppResolve } from "../../inline/inline.content.page.document.app-resolve.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type ParagraphComponentContentAppResolve = OmitAndReplace<
  ParagraphComponentContentAppInit,
  {
    content: readonly InlineContentAppResolve[];
  }
>;
