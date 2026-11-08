// src/app/types/document/page/page.document.app-render-context.type.ts

import type { HeaderPageDocumentAppRenderContext } from "./header.page.document.app-render-context.type";
import type { LinkAppRenderContext } from "../../primitives/link/link.primitive.app-render-context.type";
import type { ContentBodyAppRenderContext } from "./body.page.document.app-render-context.type";
import type { FooterPageDocumentAppRenderContext } from "./footer.page.document.app-render-context.type";
import type { ContentPageType } from "../../../../content-schema/content/content.content-schema.type";

export type PageDocumentAppRenderContext = Readonly<{
  pageType: ContentPageType;
  header: HeaderPageDocumentAppRenderContext;
  breadcrumbs: readonly LinkAppRenderContext[];
  body: ContentBodyAppRenderContext;
  footer: FooterPageDocumentAppRenderContext;
}>;
