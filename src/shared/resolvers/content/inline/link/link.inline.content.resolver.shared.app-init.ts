// src/shared/resolvers/content/inline/link/link.inline.content.resolver.shared.app-init.ts

import type { LinkInlineContentAuthored } from "../../../../../content-schema/content/inline/link.inline.content.content-schema.authored.type";
import type { LinkInlineContentAppInit } from "../../../../types/content/inline/link.inline.content.app-init.type";

import type { SvgAssetsConfigAppInit } from "../../../../types/assets/svg.assets.config.app-init.type";
import type { PersonConfigAppInit } from "../../../../types/config/person.config.shared.app-init.type";

import { resolveLinkAppInit } from "../../primitives/link/link.primitive.content.resolver.shared.app-init";

export const resolveLinkInlineContentAppInit = ({
  authored,
  svgAssets,
  socialProfiles,
}: Readonly<{
  authored: LinkInlineContentAuthored;
  svgAssets: SvgAssetsConfigAppInit;
  socialProfiles: PersonConfigAppInit["socialProfiles"];
}>): LinkInlineContentAppInit => ({
  ...authored,
  link: resolveLinkAppInit({
    authored: authored.link,
    svgAssets,
    socialProfiles,
  }),
});
