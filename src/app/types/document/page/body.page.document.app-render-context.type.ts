// src/app/types/document/page/body.page.document.app-render-context.type.ts

import type { ContentBodyAppResolve } from "./body.page.document.app-resolve.type";
import type { ModuleContentAppRenderContext } from "./content/modules/module.content.page.document.app-render-context.type";
import type { ContentBodyFooterAppRenderContext } from "./footer/footer.page.document.app-render-context.type";
import type { OmitAndReplace } from "../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type ContentBodyAppRenderContext = Readonly<
  OmitAndReplace<
    ContentBodyAppResolve,
    {
      modules: readonly ModuleContentAppRenderContext[];
      footer: ContentBodyFooterAppRenderContext;
    }
  >
>;
