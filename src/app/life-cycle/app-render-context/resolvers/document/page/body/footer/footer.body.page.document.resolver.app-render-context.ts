// src/app/life-cycle/app-render-context/resolvers/document/page/body/footer/footer.body.page.document.resolver.app-render-context.ts

import type { ContentBodyFooterAppResolve } from "../../../../../../../types/document/page/footer/footer.content.app-resolve.type";
import type { ContentBodyFooterAppRenderContext } from "../../../../../../../types/document/page/footer/footer.page.document.app-render-context.type";

import { resolveContentModuleAppRenderContext } from "../modules/module.content.resolver.app-render-context";

type Input = Readonly<{
  content: ContentBodyFooterAppResolve;
}>;

export const resolveContentBodyFooterAppRenderContext = ({
  content,
}: Input): ContentBodyFooterAppRenderContext =>
  content.map((module) =>
    resolveContentModuleAppRenderContext({
      content: module,
    }),
  );
