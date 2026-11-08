// src/app/types/document/page/content/inline/link/link.inline.content.page.document.app-resolve.type.ts

import type { LinkInlineContentAppInit } from "../../../../../../../shared/types/content/inline/link.inline.content.app-init.type";
import type { LinkAppResolve } from "../../../../../primitives/link/link.primitive.app-resolve.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type LinkInlineContentAppResolve = Readonly<
  OmitAndReplace<
    LinkInlineContentAppInit,
    {
      link: LinkAppResolve;
    }
  >
>;
