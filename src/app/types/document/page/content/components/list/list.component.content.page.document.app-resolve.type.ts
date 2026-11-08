// src/app/types/document/page/content/components/list/list.component.content.page.document.app-resolve.type.ts

import type { ListComponentContentAppInit } from "../../../../../../../shared/types/content/components/list.component.content.shared.app-init.type";
import type { InlineContentAppResolve } from "../../inline/inline.content.page.document.app-resolve.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type ListComponentContentAppResolve = OmitAndReplace<
  ListComponentContentAppInit,
  {
    items: readonly Readonly<{
      content: readonly InlineContentAppResolve[];
    }>[];
  }
>;
