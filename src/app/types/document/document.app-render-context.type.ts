// src/app/types/document/document.app-render-context.type.ts

import type { EndDocumentAppRenderContext } from "./end.document.app-render-context.type";
import type { HeadDocumentAppRenderContext } from "./head.document.app-render-context.type";
import type { PageDocumentAppRenderContext } from "./page/page.document.app-render-context.type";

export type DocumentAppRenderContext = Readonly<{
  language: string;
  head: HeadDocumentAppRenderContext;
  page: PageDocumentAppRenderContext;
  end: EndDocumentAppRenderContext;
}>;
