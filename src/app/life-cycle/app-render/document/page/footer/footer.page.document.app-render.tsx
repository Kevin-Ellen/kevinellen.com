// src/app/life-cycle/app-render/document/page/footer/footer.page.document.app-render.tsx

import type { FooterPageDocumentAppRenderContext } from "../../../../../types/document/page/footer.page.document.app-render-context.type";

import { Link } from "../../../primitives/link/link.primitive.app-render";

type Props = Readonly<{
  footer: FooterPageDocumentAppRenderContext;
}>;

export const PageFooter = ({ footer }: Props) => (
  <footer className="l-footer">
    <div className="l-frame">
      <nav className="l-footer__navigation" aria-label="Footer">
        {footer.navigation.map((section) => (
          <div key={section.id} className="l-footer__group">
            <h2 className="l-footer__heading">{section.label}</h2>

            <ul className="l-footer__links">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link link={link} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <section
        className="l-footer__conservation"
        aria-labelledby="footer-conservation-title"
      >
        <h2 className="l-footer__heading" id="footer-conservation-title">
          {footer.conservation.heading}
        </h2>

        <div className="l-footer__logos">
          {footer.conservation.items.map((item) => (
            <Link
              key={item.id}
              link={item.link}
              className={`l-footer__logo--${item.id}`}
            />
          ))}
        </div>
      </section>

      <div className="l-footer__bottom">
        <small>
          © {footer.colophon.year} {footer.colophon.name}.{" "}
          {footer.colophon.rights}.
        </small>

        <nav aria-label={footer.legal.label}>
          <ul className="l-footer__legal">
            {footer.legal.links.map((link) => (
              <li key={link.href}>
                <Link link={link} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  </footer>
);
