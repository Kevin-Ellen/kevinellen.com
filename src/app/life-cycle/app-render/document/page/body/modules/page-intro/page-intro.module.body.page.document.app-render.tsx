// src/app/life-cycle/app-render/document/page/body/modules/page-intro/page-intro.module.body.page.document.app-render.tsx

import type { PageIntroModuleContentAppRenderContext } from "../../../../../../../types/document/page/content/modules/page-intro/page-intro.module.content.page.document.app-render-context.type";

import { Svg } from "../../../../../primitives/svg/svg.primitive.app-render";

type Props = Readonly<{
  module: PageIntroModuleContentAppRenderContext;
}>;

export const PageIntroModule = ({ module }: Props) => (
  <header className="m-page-intro l-reading">
    {module.eyebrow && (
      <p className="m-page-intro__eyebrow">{module.eyebrow}</p>
    )}

    <h1 className="m-page-intro__title">{module.title}</h1>

    {module.description && (
      <p className="m-page-intro__description">{module.description}</p>
    )}

    <div className="m-page-intro__meta">
      {module.location && (
        <span className="m-page-intro__location">
          <Svg
            svg={{
              id: "icon-location-dot",
              width: 16,
              height: 16,
            }}
            className="m-page-intro__meta-icon"
          />
          <span>{module.location}</span>
        </span>
      )}

      <time className="m-page-intro__date" dateTime={module.date.iso}>
        <Svg
          svg={{
            id: "icon-calendar",
            width: 16,
            height: 16,
          }}
          className="m-page-intro__meta-icon"
        />
        <span>{module.date.label}</span>
      </time>
    </div>
  </header>
);
