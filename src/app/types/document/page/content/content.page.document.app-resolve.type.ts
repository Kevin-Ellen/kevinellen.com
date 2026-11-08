// src/app/types/document/page/content/content.page.document.app-resolve.type.ts

import type { AppInit } from "../../../../life-cycle/app-init/class.app-init";
import type { ContentBodyAppResolve } from "../body.page.document.app-resolve.type";
import type { LinkAppResolve } from "../../../primitives/link/link.primitive.app-resolve.type";
import type { OmitAndReplace } from "../../../../../shared/types/utilities/omit-replace.utility.shared.type";

type ContentAppInit =
  | AppInit["content"]["bySlug"][string]
  | NonNullable<AppInit["content"]["errorsByStatus"][404]>;

export type ContentAppResolve = OmitAndReplace<
  ContentAppInit,
  {
    body: ContentBodyAppResolve;
    breadcrumbs: readonly LinkAppResolve[];
  }
>;
