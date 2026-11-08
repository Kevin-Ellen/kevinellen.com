// src/app/life-cycle/app-render/document/page/body/modules/editorial-split/editorial-split.module.body.page.document.app-render.tsx

import type { EditorialSplitModuleContentAppRenderContext } from "../../../../../../../types/document/page/content/modules/editorial-split/editorial-split.module.content.page.document.app-render-context.type";

import { ContentComponent } from "../../components/component.body.page.document.app-render";

type Props = Readonly<{
  module: EditorialSplitModuleContentAppRenderContext;
}>;

export const EditorialSplitModule = ({ module }: Props) => (
  <section
    id={module.id}
    className={[
      "m-editorial-split",
      module.reverse && "m-editorial-split--reverse",
      "l-frame",
    ]
      .filter(Boolean)
      .join(" ")}
    aria-labelledby={module.heading.id}
  >
    <div className="m-editorial-split__content">
      <p className="m-editorial-split__eyebrow">{module.eyebrow}</p>

      <h2 id={module.heading.id} className="m-editorial-split__heading">
        {module.heading.text}
      </h2>

      <div className="m-editorial-split__body">
        {module.components.map((component, index) => (
          <ContentComponent key={index} component={component} />
        ))}
      </div>
    </div>

    <ContentComponent
      component={module.media}
      className="m-editorial-split__media"
    />
  </section>
);
