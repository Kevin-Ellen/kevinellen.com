// src/app/types/document/page/body.page.document.app-resolve.type.ts

import type { ContentBodyAppInit } from "../../../../shared/types/content/body/body.content.shared.app-init.type";
import type { ModuleContentAppResolve } from "./content/modules/module.content.page.document.app-resolve.type";
import type { ContentBodyFooterAppResolve } from "./footer/footer.content.app-resolve.type";
import type { OmitAndReplace } from "../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type ContentBodyAppResolve = Readonly<
  OmitAndReplace<
    ContentBodyAppInit,
    {
      modules: readonly ModuleContentAppResolve[];
      footer: ContentBodyFooterAppResolve;
    }
  >
>;
