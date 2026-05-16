// src/rendering/body-footer/body-footer.template.tsx

import type { AppRenderContextBodyFooter } from "@app-render-context/types/body-footer.app-render-context.types";

import { BodyFooterAffiliationsTemplate } from "@rendering/body-footer/affiliations.body-footer.template";
import { BodyFooterColophonTemplate } from "@rendering/body-footer/colophon.body-footer.template";
import { BodyFooterNavTemplate } from "@rendering/body-footer/nav.body-footer.template";

type BodyFooterTemplateProps = Readonly<{
  bodyFooter: AppRenderContextBodyFooter;
}>;

export const BodyFooterTemplate = ({ bodyFooter }: BodyFooterTemplateProps) => (
  <footer className="l-footer" aria-label="Site footer">
    <div className="l-page__frame">
      <BodyFooterNavTemplate nav={bodyFooter.nav} />
      <BodyFooterAffiliationsTemplate affiliations={bodyFooter.affiliations} />
      <BodyFooterColophonTemplate colophon={bodyFooter.colophon} />
    </div>
  </footer>
);
