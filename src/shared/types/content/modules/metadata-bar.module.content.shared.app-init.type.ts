// src/shared/types/content/modules/metadata-bar.module.content.shared.app-init.type.ts

import type { MetadataBarModuleContentAuthored } from "../../../../content-schema/content/modules/metadata-bar.module.content.content-schema.authored.type";
import type { SvgReferenceAppInit } from "../../assets/svg.asset.shared.app-init.type";
import type { OmitAndReplace } from "../../utilities/omit-replace.utility.shared.type";

type MetadataBarEntryAppInit<T> = Readonly<{
  icon: SvgReferenceAppInit;
  entries: T;
}>;

export type MetadataBarModuleContentAppInit = OmitAndReplace<
  MetadataBarModuleContentAuthored,
  Readonly<{
    heading: string;

    cameras: MetadataBarEntryAppInit<readonly string[]>;
    lenses: MetadataBarEntryAppInit<readonly string[]>;
    location: MetadataBarEntryAppInit<string | null>;
  }>
>;
