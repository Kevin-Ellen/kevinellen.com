// src/app/types/document/page/content/modules/page-intro/page-intro.module.content.page.document.app-render-context.type.ts

import type { PageIntroModuleContentAppResolve } from "./page-intro.module.content.page.document.app-resolve.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type PageIntroModuleContentAppRenderContext = OmitAndReplace<
  PageIntroModuleContentAppResolve,
  Readonly<{
    date: Readonly<{
      iso: string;
      label: string;
    }>;
  }>
>;
