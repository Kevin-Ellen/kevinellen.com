// src/app/life-cycle/app-render/document/page/body/modules/final-words/final-words.module.body.page.document.app-render.tsx

import type { FinalWordsModuleContentAppRenderContext } from "../../../../../../../types/document/page/content/modules/final-words/final-words.module.content.page.document.app-render-context.type";

import { ContentComponent } from "../../components/component.body.page.document.app-render";

type Props = Readonly<{
  module: FinalWordsModuleContentAppRenderContext;
}>;

export const FinalWordsModule = ({ module }: Props) => (
  <section
    className="m-final-words l-reading"
    aria-labelledby={module.heading.id}
  >
    <span className="m-final-words__eyebrow">{module.eyebrow}</span>

    <h2 id={module.heading.id} className="m-final-words__heading">
      {module.heading.text}
    </h2>

    <div className="m-final-words__content">
      {module.components.map((component, index) => (
        <ContentComponent key={index} component={component} />
      ))}
    </div>
  </section>
);
