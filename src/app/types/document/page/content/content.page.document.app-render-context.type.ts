// src/app/types/document/page/content/content.page.document.app-render-context.type.ts

import type { ContentAppResolve } from "./content.page.document.app-resolve.type";
import type { ContentBodyAppRenderContext } from "../body.page.document.app-render-context.type";
import type { LinkAppRenderContext } from "../../../primitives/link/link.primitive.app-render-context.type";
import type { OmitAndReplace } from "../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type ContentAppRenderContext = OmitAndReplace<
  ContentAppResolve,
  {
    body: ContentBodyAppRenderContext;
    breadcrumbs: readonly LinkAppRenderContext[];
  }
>;
