// src/shared/resolvers/content/components/rich-list/rich-list.component.content.resolver.shared.app-init.ts

import type { RichListComponentContentAuthored } from "../../../../../content-schema/content/components/rich-list.component.content.content-schema.authored.type";
import type { RichListComponentContentAppInit } from "../../../../types/content/components/rich-list.component.content.shared.app-init.type";
import type { SvgAssetAppInit } from "../../../../types/assets/svg.asset.shared.app-init.type";
import type { SvgAssetId } from "../../../../types/assets/svg-id.asset.shared.type";

import { resolveSvgReferenceAppInit } from "../../primitives/svg/svg.primitive.content.resolver.shared.app-init";

type Input = Readonly<{
  authored: RichListComponentContentAuthored;
  svgAssets: Readonly<Record<SvgAssetId, SvgAssetAppInit>>;
}>;

export const resolveRichListComponentContentAppInit = ({
  authored,
  svgAssets,
}: Input): RichListComponentContentAppInit => ({
  ...authored,
  items: authored.items.map((item) => ({
    ...item,
    icon: resolveSvgReferenceAppInit({
      authored: item.icon,
      registry: svgAssets,
    }),
  })),
});
