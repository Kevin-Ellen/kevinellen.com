// src/app/life-cycle/app-render/document/page/body/modules/metadata-bar/metadata-bar.module.body.page.document.app-render.tsx

import type { MetadataBarModuleContentAppRenderContext } from "../../../../../../../types/document/page/content/modules/metadata-bar/metadata-bar.content.page.document.app-render-context.type";

import { Svg } from "../../../../../primitives/svg/svg.primitive.app-render";

type Props = Readonly<{
  module: MetadataBarModuleContentAppRenderContext;
}>;

export const MetadataBarModule = ({ module }: Props) => (
  <aside className="m-metadata-bar l-frame" aria-label="Equipment and location">
    <div className="m-metadata-bar__inner">
      <h2 className="m-metadata-bar__heading">{module.heading}</h2>

      <ul className="m-metadata-bar__list">
        {module.cameras.entries.length > 0 && (
          <li className="m-metadata-bar__item">
            <Svg svg={module.cameras.icon} />

            <ul className="m-metadata-bar__values">
              {module.cameras.entries.map((camera) => (
                <li key={camera}>{camera}</li>
              ))}
            </ul>
          </li>
        )}

        {module.lenses.entries.length > 0 && (
          <li className="m-metadata-bar__item">
            <Svg svg={module.lenses.icon} />

            <ul className="m-metadata-bar__values">
              {module.lenses.entries.map((lens) => (
                <li key={lens}>{lens}</li>
              ))}
            </ul>
          </li>
        )}

        {module.location.entries && (
          <li className="m-metadata-bar__item">
            <Svg svg={module.location.icon} />

            <span>{module.location.entries}</span>
          </li>
        )}
      </ul>
    </div>
  </aside>
);
