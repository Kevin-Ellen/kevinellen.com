// src/rendering/body-content/block/list/list.block.template.tsx

import type { AppRenderContextListBlock } from "@shared-types/page-content/block/list/app-render-context.list.block.types";

import { getBlockFlowClassName } from "@rendering/body-content/block/helpers/flow.block.helper";
import { InlineContentTemplate } from "@rendering/body-content/inline/inline.template";

type ListBlockTemplateProps = Readonly<{
  block: AppRenderContextListBlock;
}>;

type ListItemTemplateProps = Readonly<{
  item: AppRenderContextListBlock["items"][number];
}>;

const ListItemTemplate = ({ item }: ListItemTemplateProps) => (
  <li>
    <InlineContentTemplate content={item.content} />
  </li>
);

export const ListBlockTemplate = ({ block }: ListBlockTemplateProps) => {
  const Tag = block.style === "ordered" ? "ol" : "ul";

  return (
    <Tag
      className={`m-contentBlock m-contentBlock--list ${getBlockFlowClassName(
        block.flow,
      )}`}
    >
      {block.items.map((item, index) => (
        <ListItemTemplate key={`list-item:${index}`} item={item} />
      ))}
    </Tag>
  );
};
