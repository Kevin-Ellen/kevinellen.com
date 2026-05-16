// src/rendering/body-content/body-content.template.tsx

import type { AppRenderContextBodyContent } from "@app-render-context/types/body-content.app-render-context.types";

import { BlockTemplate } from "@rendering/body-content/block/block.template";
import { BodyContentFooterTemplate } from "@rendering/body-content/footer/footer.template";
import { BodyContentHeaderTemplate } from "@rendering/body-content/header.body-content.template";

type BodyContentTemplateProps = Readonly<{
  bodyContent: AppRenderContextBodyContent;
}>;

export const BodyContentTemplate = ({
  bodyContent,
}: BodyContentTemplateProps) => (
  <main className="l-main">
    <div className="l-page__frame">
      <BodyContentHeaderTemplate header={bodyContent.header} />

      {bodyContent.content.map((block, index) => (
        <BlockTemplate key={`block:${index}`} block={block} />
      ))}

      <BodyContentFooterTemplate footer={bodyContent.footer} />
    </div>
  </main>
);
