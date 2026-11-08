// src/app/life-cycle/app-render/document/page/body/modules/rich-content/rich-content.module.body.page.document.app-render.tsx

import type { RichContentModuleContentAppRenderContext } from "../../../../../../../types/document/page/content/modules/rich-content/rich-content.module.content.page.document.app-render-context.type";

import { ContentComponent } from "../../components/component.body.page.document.app-render";

type Props = Readonly<{
  module: RichContentModuleContentAppRenderContext;
  contained?: boolean;
}>;

export const RichContentModule = ({ module, contained = true }: Props) => {
  const components = module.components.map((component, index) => (
    <ContentComponent key={index} component={component} />
  ));

  return contained ? (
    <div className="l-reading">{components}</div>
  ) : (
    <>{components}</>
  );
};
