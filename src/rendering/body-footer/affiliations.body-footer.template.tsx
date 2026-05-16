// src/rendering/body-footer/affiliations.body-footer.template.tsx

import type { AppRenderContextBodyFooterAffiliations } from "@app-render-context/types/body-footer.app-render-context.types";

import { LinkTemplate } from "@rendering/shared/link.shared.template";
import { SvgReferenceTemplate } from "@rendering/shared/svg-reference.shared.template";

type BodyFooterAffiliationsTemplateProps = Readonly<{
  affiliations: AppRenderContextBodyFooterAffiliations;
}>;

type AffiliationItemTemplateProps = Readonly<{
  item: AppRenderContextBodyFooterAffiliations["items"][number];
}>;

const AffiliationItemTemplate = ({ item }: AffiliationItemTemplateProps) => (
  <li>
    <LinkTemplate
      link={{
        kind: "external",
        href: item.href,
        text: item.ariaLabel,
        openInNewTab: true,
        svg: null,
      }}
      ariaLabel={item.ariaLabel}
    >
      <SvgReferenceTemplate svg={item.logo} className="l-footer__icon" />
    </LinkTemplate>
  </li>
);

export const BodyFooterAffiliationsTemplate = ({
  affiliations,
}: BodyFooterAffiliationsTemplateProps) => (
  <section
    className="l-footer__conservation"
    aria-labelledby="footer-conservation-heading"
  >
    <h3 id="footer-conservation-heading" className="l-footer__heading">
      Conservation
    </h3>

    <ul className="l-footer__logos" aria-label="Supported organisations">
      {affiliations.items.map((item, index) => (
        <AffiliationItemTemplate key={`affiliation:${index}`} item={item} />
      ))}
    </ul>
  </section>
);
