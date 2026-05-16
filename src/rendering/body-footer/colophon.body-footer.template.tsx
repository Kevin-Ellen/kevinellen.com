// src/rendering/body-footer/colophon.body-footer.template.tsx

import type { AppRenderContextBodyFooterColophon } from "@app-render-context/types/body-footer.app-render-context.types";

type BodyFooterColophonTemplateProps = Readonly<{
  colophon: AppRenderContextBodyFooterColophon;
}>;

type ColophonItemTemplateProps = Readonly<{
  item: AppRenderContextBodyFooterColophon["items"][number];
}>;

const ColophonItemTemplate = ({ item }: ColophonItemTemplateProps) => (
  <p>
    <span className="u-sr-only">{item.label}: </span>
    {item.value}
  </p>
);

export const BodyFooterColophonTemplate = ({
  colophon,
}: BodyFooterColophonTemplateProps) => (
  <div className="l-footer__meta">
    {colophon.items.map((item, index) => (
      <ColophonItemTemplate key={`colophon:${index}`} item={item} />
    ))}
  </div>
);
