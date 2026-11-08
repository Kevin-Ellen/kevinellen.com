// src/app/life-cycle/app-render/document/page/body/modules/quote/quote.module.body.page.document.app-render.tsx

import type { QuoteModuleContentAppRenderContext } from "../../../../../../../types/document/page/content/modules/quote/quote.module.content.page.document.app-render-context.type";

type Props = Readonly<{
  module: QuoteModuleContentAppRenderContext;
}>;

export const QuoteModule = ({ module }: Props) => (
  <figure className="m-quote">
    <blockquote className="m-quote__text">
      <p>{module.text}</p>
    </blockquote>

    {module.attribution !== null && (
      <figcaption className="m-quote__attribution">
        {module.attribution}
      </figcaption>
    )}
  </figure>
);
