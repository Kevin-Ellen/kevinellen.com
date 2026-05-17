// src/rendering/document.template.tsx

import type { AppRenderContext } from "@app-render-context/class.app-render-context";

import { DocHeadTemplate } from "@rendering/doc-head/doc-head.template";
import { BodyHeaderTemplate } from "@rendering/body-header/body-header.template";
import { BodyContentTemplate } from "@rendering/body-content/body-content.template";
import { BodyFooterTemplate } from "@rendering/body-footer/body-footer.template";
import { DocCloseTemplate } from "./doc-close/doc-close.template";

type DocumentTemplateProps = Readonly<{
  appRenderContext: AppRenderContext;
}>;

export const DocumentTemplate = ({
  appRenderContext,
}: DocumentTemplateProps) => (
  <html lang={appRenderContext.docOpen.language}>
    <DocHeadTemplate docOpen={appRenderContext.docOpen} />

    <body>
      <BodyHeaderTemplate bodyHeader={appRenderContext.bodyHeader} />
      <BodyContentTemplate bodyContent={appRenderContext.bodyContent} />
      <BodyFooterTemplate bodyFooter={appRenderContext.bodyFooter} />
      <DocCloseTemplate docClose={appRenderContext.docClose} />
    </body>
  </html>
);
