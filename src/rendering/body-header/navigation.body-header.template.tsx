// src/rendering/body-header/navigation.body-header.template.tsx

import type { AppRenderContextBodyHeaderNavigation } from "@app-render-context/types/body-header.app-render-context.types";

import { LinkTemplate } from "@rendering/shared/link.shared.template";
import { SvgReferenceTemplate } from "@rendering/shared/svg-reference.shared.template";

type BodyHeaderNavigationTemplateProps = Readonly<{
  navigation: AppRenderContextBodyHeaderNavigation;
}>;

type BodyHeaderNavigationLink =
  AppRenderContextBodyHeaderNavigation["primary"][number];

type NavigationLinkItemTemplateProps = Readonly<{
  link: BodyHeaderNavigationLink;
}>;

const PrimaryLinkItemTemplate = ({ link }: NavigationLinkItemTemplateProps) => (
  <li className="l-header__item">
    <LinkTemplate link={link} className="l-header__link" />
  </li>
);

const SocialLinkItemTemplate = ({ link }: NavigationLinkItemTemplateProps) => (
  <li className="l-header__item">
    {link.svg ? (
      <LinkTemplate
        link={link}
        className="l-header__link"
        ariaLabel={link.text}
      >
        <SvgReferenceTemplate svg={link.svg} className="l-header__icon" />
      </LinkTemplate>
    ) : (
      <LinkTemplate link={link} className="l-header__link" />
    )}
  </li>
);

const PrimaryNavigationTemplate = ({
  links,
}: {
  links: AppRenderContextBodyHeaderNavigation["primary"];
}) => (
  <div className="l-header__nav">
    <ul className="l-header__list">
      {links.map((link, index) => (
        <PrimaryLinkItemTemplate key={`primary:${index}`} link={link} />
      ))}
    </ul>
  </div>
);

const SocialNavigationTemplate = ({
  links,
}: {
  links: AppRenderContextBodyHeaderNavigation["social"];
}) => (
  <div className="l-header__social">
    <ul className="l-header__list l-header__list--social">
      {links.map((link, index) => (
        <SocialLinkItemTemplate key={`social:${index}`} link={link} />
      ))}
    </ul>
  </div>
);

export const BodyHeaderNavigationTemplate = ({
  navigation,
}: BodyHeaderNavigationTemplateProps) => (
  <nav className="l-header__primary" aria-label="Primary">
    <PrimaryNavigationTemplate links={navigation.primary} />
    <SocialNavigationTemplate links={navigation.social} />
  </nav>
);
