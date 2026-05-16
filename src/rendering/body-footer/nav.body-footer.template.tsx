// src/rendering/body-footer/nav.body-footer.template.tsx

import type { AppRenderContextFooterNavigation } from "@shared-types/config/navigation/footer/app-render-context.footer.navigation.types";
import type { AppRenderContextLink } from "@shared-types/links/app-render-context.links.types";

import { LinkTemplate } from "@rendering/shared/link.shared.template";

type BodyFooterNavTemplateProps = Readonly<{
  nav: AppRenderContextFooterNavigation;
}>;

type FooterNavSectionTemplateProps = Readonly<{
  section: AppRenderContextFooterNavigation["sections"][number];
}>;

type FooterNavLinkTemplateProps = Readonly<{
  link: AppRenderContextLink;
}>;

const FooterNavLinkTemplate = ({ link }: FooterNavLinkTemplateProps) => (
  <li>
    <LinkTemplate link={link} />
  </li>
);

const FooterNavSectionTemplate = ({
  section,
}: FooterNavSectionTemplateProps) => (
  <section className={`l-footer__group l-footer__group--${section.id}`}>
    <h3 className="l-footer__heading">{section.label}</h3>

    <ul className="l-footer__list">
      {section.items.map((link, index) => (
        <FooterNavLinkTemplate key={`footer-nav-link:${index}`} link={link} />
      ))}
    </ul>
  </section>
);

export const BodyFooterNavTemplate = ({ nav }: BodyFooterNavTemplateProps) => (
  <div className="l-footer__grid">
    {nav.sections.map((section) => (
      <FooterNavSectionTemplate key={section.id} section={section} />
    ))}
  </div>
);
