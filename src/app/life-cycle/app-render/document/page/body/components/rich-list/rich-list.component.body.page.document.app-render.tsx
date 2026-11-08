// src/app/life-cycle/app-render/document/page/body/components/rich-list/rich-list.component.body.page.document.app-render.tsx

import type { RichListComponentContentAppRenderContext } from "../../../../../../../types/document/page/content/components/rich-list/rich-list.component.content.page.document.app-render-context.type";

import { Svg } from "../../../../../primitives/svg/svg.primitive.app-render";

type Props = Readonly<{
  list: RichListComponentContentAppRenderContext;
  className?: string;
}>;

export const RichListComponent = ({ list, className }: Props) => (
  <ul className={["c-rich-list", className].filter(Boolean).join(" ")}>
    {list.items.map((item, index) => (
      <li className="c-rich-list__item" key={index}>
        <Svg svg={item.icon} className="c-rich-list__icon" />

        <div className="c-rich-list__content">
          <span className="c-rich-list__label">{item.label}</span>

          {item.values.map((value, valueIndex) => (
            <span key={valueIndex}>{value}</span>
          ))}
        </div>
      </li>
    ))}
  </ul>
);
