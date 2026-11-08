// src/app/life-cycle/app-render/document/page/body/breadcrumbs/breadcrumbs.body.page.document.app-render.tsx

import type { LinkAppRenderContext } from "../../../../../../types/primitives/link/link.primitive.app-render-context.type";

type Props = Readonly<{
  breadcrumbs: readonly LinkAppRenderContext[];
}>;

export const Breadcrumbs = ({ breadcrumbs }: Props) => (
  <nav className="m-breadcrumbs l-frame" aria-label="Breadcrumb">
    <ol className="m-breadcrumbs__list">
      {breadcrumbs.map((breadcrumb, index) => {
        const isCurrent = index === breadcrumbs.length - 1;

        return (
          <li
            key={breadcrumb.href}
            className="m-breadcrumbs__item"
            aria-current={isCurrent ? "page" : undefined}
          >
            {isCurrent ? (
              <span>{breadcrumb.label}</span>
            ) : (
              <a href={breadcrumb.href}>{breadcrumb.label}</a>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
