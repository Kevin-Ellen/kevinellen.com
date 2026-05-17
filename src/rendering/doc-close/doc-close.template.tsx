// src/rendering/doc-close/doc-close.template.tsx

import type { AppRenderContextDocClose } from "@app-render-context/types/doc-close.app-render-context.types";
import type { AppRenderContextSvgAsset } from "@shared-types/assets/svg/app-render-context.svg.assets.types";

import {
  InlineScript,
  LinkScript,
  StructuredDataScript,
} from "@rendering/shared/script.shared.template";

type DocCloseTemplateProps = Readonly<{
  docClose: AppRenderContextDocClose;
}>;

type SvgSpriteTemplateProps = Readonly<{
  svgAssets: readonly AppRenderContextSvgAsset[];
}>;

type SvgAssetTemplateProps = Readonly<{
  svg: AppRenderContextSvgAsset;
}>;

const SvgAssetTemplate = ({ svg }: SvgAssetTemplateProps) => (
  <symbol
    id={svg.id}
    viewBox={svg.viewBox}
    dangerouslySetInnerHTML={{
      __html: svg.content,
    }}
  />
);

const SvgSpriteTemplate = ({ svgAssets }: SvgSpriteTemplateProps) => {
  if (svgAssets.length === 0) {
    return null;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="u-hidden-svg-sprite"
    >
      {svgAssets.map((svg) => (
        <SvgAssetTemplate key={svg.id} svg={svg} />
      ))}
    </svg>
  );
};

export const DocCloseTemplate = ({ docClose }: DocCloseTemplateProps) => (
  <>
    {docClose.structuredData.map((item, index) => (
      <StructuredDataScript key={`structured-data:${index}`} item={item} />
    ))}

    {docClose.inlineScripts.map((script, index) => (
      <InlineScript key={`inline-script:${index}`} script={script} />
    ))}

    {docClose.linkScripts.map((script) => (
      <LinkScript key={script.src} script={script} />
    ))}

    <SvgSpriteTemplate svgAssets={docClose.svg} />
  </>
);
