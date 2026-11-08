// src/app/types/document/page/content/components/list/list.component.content.page.document.app-render-context.type.ts

import type { ListComponentContentAppResolve } from "./list.component.content.page.document.app-resolve.type";
import type { InlineContentAppRenderContext } from "../../inline/inline.content.page.document.app-render-context.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type ListComponentContentAppRenderContext = OmitAndReplace<
  ListComponentContentAppResolve,
  {
    items: readonly Readonly<{
      content: readonly InlineContentAppRenderContext[];
    }>[];
  }
>;
