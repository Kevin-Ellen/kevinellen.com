// src/app/life-cycle/app-render/document/document.app-render.tsx

import type { DocumentAppRenderContext } from "../../../types/document/document.app-render-context.type";
import type { MetadataAppRenderContext } from "../../../types/document/metadata.document.app-render-context.type";

import { DocumentHead } from "./head/head.document.app-render";
import { Page } from "./page/page.document.app-render";
import { DocumentEnd } from "./end/end.document.app-render";

type Props = Readonly<{
  metadata: MetadataAppRenderContext;
  document: DocumentAppRenderContext;
}>;

export const Document = ({ document, metadata }: Props) => (
  <html lang={document.language}>
    <DocumentHead head={document.head} metadata={metadata} />

    <body>
      <Page page={document.page} />
      <DocumentEnd end={document.end} metadata={metadata} />
    </body>
  </html>
);
