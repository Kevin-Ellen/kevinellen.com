// src/app/types/primitives/link/link.primitive.app-resolve.type.ts

import type { LinkCommonAppInit } from "../../../../shared/types/content/primitives/link.primitive.content.shared.app-init.type";
import type { OmitAndReplace } from "../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type LinkAppResolve = Readonly<
  OmitAndReplace<
    LinkCommonAppInit,
    {
      href: string;
    }
  >
>;
