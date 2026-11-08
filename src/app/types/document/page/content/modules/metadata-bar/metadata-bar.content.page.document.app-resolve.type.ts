// src/app/types/document/page/content/modules/metadata-bar/metadata-bar.content.page.document.app-resolve.type.ts

import type { MetadataBarModuleContentAppInit } from "../../../../../../../shared/types/content/modules/metadata-bar.module.content.shared.app-init.type";
import type { SvgReferenceAppResolve } from "../../../../../primitives/assets/svg/svg.asset.app-resolve.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

type MetadataBarEntryAppResolve<T> = Readonly<{
  icon: SvgReferenceAppResolve;
  entries: T;
}>;

export type MetadataBarModuleContentAppResolve = OmitAndReplace<
  MetadataBarModuleContentAppInit,
  Readonly<{
    cameras: MetadataBarEntryAppResolve<readonly string[]>;
    lenses: MetadataBarEntryAppResolve<readonly string[]>;
    location: MetadataBarEntryAppResolve<string | null>;
  }>
>;
