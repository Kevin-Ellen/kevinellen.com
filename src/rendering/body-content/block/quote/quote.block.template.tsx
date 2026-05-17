// src/rendering/body-content/block/quote/quote.block.template.tsx

import type { AppRenderContextQuoteBlock } from "@shared-types/page-content/block/quote/app-render-context.quote.block.types";

import { getBlockFlowClassName } from "@rendering/body-content/block/helpers/flow.block.helper";

type QuoteBlockTemplateProps = Readonly<{
  block: AppRenderContextQuoteBlock;
}>;

export const QuoteBlockTemplate = ({ block }: QuoteBlockTemplateProps) => {
  const attributionId = block.attribution ? block.id : undefined;

  return (
    <figure
      className={`m-contentBlock m-quote ${getBlockFlowClassName(block.flow)}`}
    >
      <blockquote className="m-quote__body" aria-describedby={attributionId}>
        {block.text}
      </blockquote>

      {block.attribution ? (
        <figcaption id={block.id} className="m-quote__attribution">
          {block.attribution}
        </figcaption>
      ) : null}
    </figure>
  );
};
