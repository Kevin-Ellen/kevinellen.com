// src/app/types/document/page/content/modules/metadata-bar/metadata-bar.content.page.document.app-render-context.type.ts

import type { MetadataBarModuleContentAppResolve } from "./metadata-bar.content.page.document.app-resolve.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";
import type { SvgReferenceAppRenderContext } from "../../../../../primitives/assets/svg/svg.asset.app-render-context.type";

type MetadataBarEntryAppRenderContext<T> = Readonly<{
  icon: SvgReferenceAppRenderContext;
  entries: T;
}>;

export type MetadataBarModuleContentAppRenderContext = OmitAndReplace<
  MetadataBarModuleContentAppResolve,
  Readonly<{
    cameras: MetadataBarEntryAppRenderContext<readonly string[]>;
    lenses: MetadataBarEntryAppRenderContext<readonly string[]>;
    location: MetadataBarEntryAppRenderContext<string | null>;
  }>
>;
