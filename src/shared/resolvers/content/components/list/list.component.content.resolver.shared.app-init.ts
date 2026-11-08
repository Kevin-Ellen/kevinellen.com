// src/shared/resolvers/content/components/list/list.component.content.resolver.shared.app-init.ts

import type { ListComponentContentAuthored } from "../../../../../content-schema/content/components/list.component.content.content-schema.authored.type";
import type { ListComponentContentAppInit } from "../../../../types/content/components/list.component.content.shared.app-init.type";
import type { SvgAssetsConfigAppInit } from "../../../../types/assets/svg.assets.config.app-init.type";
import type { PersonConfigAppInit } from "../../../../types/config/person.config.shared.app-init.type";

import { resolveInlineContentAppInit } from "../../inline/inline.content.resolver.shared.app-init";

export const resolveListComponentContentAppInit = ({
  authored,
  svgAssets,
  socialProfiles,
}: Readonly<{
  authored: ListComponentContentAuthored;
  svgAssets: SvgAssetsConfigAppInit;
  socialProfiles: PersonConfigAppInit["socialProfiles"];
}>): ListComponentContentAppInit => ({
  ...authored,
  items: authored.items.map((item) => ({
    ...item,
    content: item.content.map((inline) =>
      resolveInlineContentAppInit({
        authored: inline,
        svgAssets,
        socialProfiles,
      }),
    ),
  })),
});
