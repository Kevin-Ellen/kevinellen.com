// src/app/life-cycle/app-render/document/page/body/modules/article-section/article-section.module.body.page.document.app-render.tsx

import type { ComponentType, ElementType } from "react";

import type { ArticleSectionModuleContentAppRenderContext } from "../../../../../../../types/document/page/content/modules/article-section/article-section.module.content.page.document.app-render-context.type";
import type { ModuleContentAppRenderContext } from "../../../../../../../types/document/page/content/modules/module.content.page.document.app-render-context.type";

type Props = Readonly<{
  module: ArticleSectionModuleContentAppRenderContext;
  renderModule: ComponentType<
    Readonly<{
      module: ModuleContentAppRenderContext;
      contained?: boolean;
    }>
  >;
}>;

export const ArticleSectionModule = ({
  module,
  renderModule: NestedModule,
}: Props) => {
  const Heading = `h${module.heading.level}` as ElementType;

  return (
    <section className="m-article-section" aria-labelledby={module.heading.id}>
      <div className="l-reading">
        <Heading id={module.heading.id}>{module.heading.text}</Heading>
      </div>

      {module.entries.map((entry, index) =>
        entry.layout === "none" ? (
          <NestedModule key={index} module={entry.module} contained={false} />
        ) : (
          <div
            key={index}
            className={entry.layout === "reading" ? "l-reading" : "l-frame"}
          >
            <NestedModule module={entry.module} contained={false} />
          </div>
        ),
      )}
    </section>
  );
};
