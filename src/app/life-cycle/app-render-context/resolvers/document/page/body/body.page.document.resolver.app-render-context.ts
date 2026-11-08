// src/app/life-cycle/app-render-context/resolvers/document/page/body/body.page.document.resolver.app-render-context.ts

import type { ContentBodyAppResolve } from "../../../../../../types/document/page/body.page.document.app-resolve.type";
import type { ContentBodyAppRenderContext } from "../../../../../../types/document/page/body.page.document.app-render-context.type";

import { resolveContentBodyFooterAppRenderContext } from "./footer/footer.body.page.document.resolver.app-render-context";
import { resolveContentModuleAppRenderContext } from "./modules/module.content.resolver.app-render-context";

type Input = Readonly<{
  content: ContentBodyAppResolve;
}>;

export const resolveContentBodyAppRenderContext = ({
  content,
}: Input): ContentBodyAppRenderContext => ({
  modules: content.modules.map((module) =>
    resolveContentModuleAppRenderContext({
      content: module,
    }),
  ),

  footer: resolveContentBodyFooterAppRenderContext({
    content: content.footer,
  }),
});
