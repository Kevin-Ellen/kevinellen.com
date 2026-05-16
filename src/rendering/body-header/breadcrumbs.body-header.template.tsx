// src/rendering/body-header/breadcrumbs.body-header.template.tsx

import type { AppRenderContextLink } from "@shared-types/links/app-render-context.links.types";
import type { AppRenderContextBreadcrumbs } from "@shared-types/breadcrumbs/app-render-context.breadcrumbs.types";

import { LinkTemplate } from "@rendering/shared/link.shared.template";

type BodyHeaderBreadcrumbsTemplateProps = Readonly<{
  breadcrumbs: AppRenderContextBreadcrumbs;
}>;

type BreadcrumbItemTemplateProps = Readonly<{
  item: AppRenderContextLink;
}>;

const BreadcrumbItemTemplate = ({ item }: BreadcrumbItemTemplateProps) => (
  <li className="l-header__breadcrumb-item">
    <LinkTemplate link={item} className="l-header__breadcrumb-link" />
  </li>
);

export const BodyHeaderBreadcrumbsTemplate = ({
  breadcrumbs,
}: BodyHeaderBreadcrumbsTemplateProps) => (
  <nav className="l-header__breadcrumb" aria-label="Breadcrumb">
    <ol className="l-header__breadcrumb-list">
      {breadcrumbs.items.map((item, index) => (
        <BreadcrumbItemTemplate key={`breadcrumb:${index}`} item={item} />
      ))}

      <li className="l-header__breadcrumb-item" aria-current="page">
        {breadcrumbs.current}
      </li>
    </ol>
  </nav>
);
