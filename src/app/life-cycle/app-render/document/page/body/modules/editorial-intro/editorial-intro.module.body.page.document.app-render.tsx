// src/app/life-cycle/app-render/document/page/body/modules/editorial-intro/editorial-intro.module.body.page.document.app-render.tsx

import type { EditorialIntroModuleContentAppRenderContext } from "../../../../../../../types/document/page/content/modules/editorial-editorial/editorial-intro.module.content.page.document.app-render-context.type";

type Props = Readonly<{
  module: EditorialIntroModuleContentAppRenderContext;
}>;

export const EditorialIntroModule = ({ module }: Props) => (
  <header className="m-editorial-intro l-frame">
    <div className="m-editorial-intro__content">
      <p className="m-editorial-intro__eyebrow">{module.eyebrow}</p>

      <h1>{module.title}</h1>

      <p className="m-editorial-intro__statement">{module.statement}</p>

      <p className="m-editorial-intro__description">{module.description}</p>

      {module.location && (
        <p className="m-editorial-intro__location">{module.location}</p>
      )}
    </div>
    {module.portrait && (
      <figure className="c-photo m-editorial-intro__portrait">
        <img
          className="c-photo__image"
          src={module.portrait.src}
          alt={module.portrait.alt}
          width={module.portrait.width}
          height={module.portrait.height}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </figure>
    )}
  </header>
);
