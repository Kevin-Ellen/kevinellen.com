// src/app/types/document/page/content/modules/page-intro/page-intro.module.content.page.document.app-resolve.type.ts

import type { PageIntroModuleContentAppInit } from "../../../../../../../shared/types/content/modules/page-intro.module.content.shared.app-init.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type PageIntroModuleContentAppResolve = OmitAndReplace<
  PageIntroModuleContentAppInit,
  Readonly<{}>
>;
