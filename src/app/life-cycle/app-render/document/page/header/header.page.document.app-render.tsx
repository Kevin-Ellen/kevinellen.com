// src/app/life-cycle/app-render/document/page/header/header.page.document.app-render.tsx

import type { HeaderPageDocumentAppRenderContext } from "../../../../../types/document/page/header.page.document.app-render-context.type";

import { Link } from "../../../primitives/link/link.primitive.app-render";
import { Svg } from "../../../primitives/svg/svg.primitive.app-render";

type Props = Readonly<{
  header: HeaderPageDocumentAppRenderContext;
}>;

export const PageHeader = ({ header }: Props) => (
  <header
    className={[
      "l-header",
      header.appearance.transparent && "l-header--transparent",
      header.appearance.inverted && "l-header--inverted",
    ]
      .filter(Boolean)
      .join(" ")}
  >
    <div className="l-frame">
      <div className="l-header__top">
        <a
          href={header.brand.href}
          className="l-header__brand"
          aria-label={header.brand.label}
        >
          <Svg svg={header.brand.logo} className="l-header__brand-logo" />
        </a>

        <div className="l-header__navigation">
          <nav className="l-header__primary">
            <ul className="l-header__list">
              {header.navigation.primary.items.map((link) => (
                <li key={link.href} className="l-header__item">
                  <Link link={link} className="l-header__link" />
                </li>
              ))}
            </ul>
          </nav>

          <nav className="l-header__social">
            <ul className="l-header__list l-header__list--social">
              {header.navigation.social.items.map((link) => (
                <li key={link.href} className="l-header__item">
                  <Link
                    link={link}
                    className="l-header__link"
                    iconClassName="l-header__icon"
                  />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </header>
);
