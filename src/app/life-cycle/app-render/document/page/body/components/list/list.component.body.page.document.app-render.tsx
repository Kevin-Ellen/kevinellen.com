// src/app/life-cycle/app-render/document/page/body/components/list/list.component.body.page.document.app-render.tsx

import type { ListComponentContentAppRenderContext } from "../../../../../../../types/document/page/content/components/list/list.component.content.page.document.app-render-context.type";

import { Inline } from "../../inline/inline.body.page.document.app-render";

type Props = Readonly<{
  list: ListComponentContentAppRenderContext;
}>;

export const ListComponent = ({ list }: Props) => (
  <ul className="c-list">
    {list.items.map((item, index) => (
      <li className="c-list__item" key={index}>
        {item.content.map((content, contentIndex) => (
          <Inline key={contentIndex} content={content} />
        ))}
      </li>
    ))}
  </ul>
);
