// src/app/life-cycle/app-render/document/page/body/modules/editorial-feature/editorial-feature.module.body.page.document.app-render.tsx

import type { EditorialFeatureModuleContentAppRenderContext } from "../../../../../../../types/document/page/content/modules/editorial-feature/editorial-feature.module.content.page.document.app-render-context.type";

import { ContentComponent } from "../../components/component.body.page.document.app-render";
import { EditorialPhotoComponent } from "../../components/editorial-photo/editorial-photo.component.body.page.document.app-render";

type Props = Readonly<{
  module: EditorialFeatureModuleContentAppRenderContext;
}>;

export const EditorialFeatureModule = ({ module }: Props) => (
  <section
    id={module.id}
    className="m-editorial-feature"
    aria-labelledby={module.heading.id}
  >
    <div className="m-editorial-feature__content l-reading">
      <p className="m-editorial-feature__eyebrow">{module.eyebrow}</p>

      <h2 id={module.heading.id} className="m-editorial-feature__heading">
        {module.heading.text}
      </h2>

      <div className="m-editorial-feature__body">
        {module.components.map((component, index) => (
          <ContentComponent key={index} component={component} />
        ))}
      </div>
    </div>

    <EditorialPhotoComponent photo={module.media} wide />
  </section>
);
