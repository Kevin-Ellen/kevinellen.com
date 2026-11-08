// src/shared/resolvers/content/components/component.content.resolver.shared.app-init.ts

import type { ComponentContentAuthored } from "../../../../content-schema/content/components/component.content.content-schema.authored.type";
import type { ComponentContentAppInit } from "../../../types/content/components/component.content.shared.app-init.type";
import type { SvgAssetsConfigAppInit } from "../../../types/assets/svg.assets.config.app-init.type";
import type { PersonConfigAppInit } from "../../../types/config/person.config.shared.app-init.type";

import type { ParagraphComponentContentAuthored } from "../../../../content-schema/content/components/paragraph.component.content.content-schema.authored.type";
import type { ListComponentContentAuthored } from "../../../../content-schema/content/components/list.component.content.content-schema.authored.type";
import type { PhotoComponentContentAuthored } from "../../../../content-schema/content/components/photo.component.content.content-schema.authored.type";

import { resolveParagraphComponentContentAppInit } from "./paragraph/paragraph.component.content.resolver.shared.app-init";
import { resolveListComponentContentAppInit } from "./list/list.component.content.resolver.shared.app-init";
import { resolvePhotoComponentContentAppInit } from "./photo/photo.component.content.resolver.shared.app-init";
import { resolveEditorialPhotoComponentContentAppInit } from "./editorial-photo/editorial-photo.component.content.resolver.shared.app-init";
import { resolveRichListComponentContentAppInit } from "./rich-list/rich-list.component.content.resolver.shared.app-init";

type Input = Readonly<{
  authored: ComponentContentAuthored;
  svgAssets: SvgAssetsConfigAppInit;
  socialProfiles: PersonConfigAppInit["socialProfiles"];
}>;

const resolverLibrary = {
  paragraph: ({ authored, svgAssets, socialProfiles }: Input) =>
    resolveParagraphComponentContentAppInit({
      authored: authored as ParagraphComponentContentAuthored,
      svgAssets,
      socialProfiles,
    }),

  list: ({ authored, svgAssets, socialProfiles }: Input) =>
    resolveListComponentContentAppInit({
      authored: authored as ListComponentContentAuthored,
      svgAssets,
      socialProfiles,
    }),

  photo: ({ authored }: Input) =>
    resolvePhotoComponentContentAppInit({
      authored: authored as PhotoComponentContentAuthored,
    }),

  editorialPhoto: resolveEditorialPhotoComponentContentAppInit,
  richList: resolveRichListComponentContentAppInit,
} satisfies Record<ComponentContentAuthored["kind"], unknown>;

export const resolveComponentContentAppInit = ({
  authored,
  svgAssets,
  socialProfiles,
}: Input): ComponentContentAppInit => {
  const resolver = resolverLibrary[authored.kind] as (
    input: Input,
  ) => ComponentContentAppInit;

  return resolver({ authored, svgAssets, socialProfiles });
};
