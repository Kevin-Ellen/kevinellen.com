// src/app/life-cycle/app-render-context/resolvers/document/page/page.document.resolver.app-render-context.ts

import type { PageDocumentAppRenderContext } from "../../../../../types/document/page/page.document.app-render-context.type";
import type { ShellAppResolve } from "../../../../../types/document/shell.document.app-resolve.type";
import type { ContentAppResolve } from "../../../../../types/document/page/content/content.page.document.app-resolve.type";

import { resolveHeaderPageDocumentAppRenderContext } from "./header/header.page.document.resolver.app-render-context";
import { resolveContentBodyAppRenderContext } from "./body/body.page.document.resolver.app-render-context";
import { resolveFooterPageDocumentAppRenderContext } from "./footer/footer.page.document.resolver.app-render-context";

type Input = Readonly<{
  shell: ShellAppResolve;
  content: ContentAppResolve;
}>;

export const resolvePageDocumentAppRenderContext = ({
  shell,
  content,
}: Input): PageDocumentAppRenderContext => ({
  pageType: content.pageType,
  header: resolveHeaderPageDocumentAppRenderContext({ shell }),
  breadcrumbs: content.breadcrumbs,
  body: resolveContentBodyAppRenderContext({
    content: content.body,
  }),
  footer: resolveFooterPageDocumentAppRenderContext({ shell }),
});
