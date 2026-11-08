// src/app/types/document/page/content/modules/featured-photo/featured-photo.module.content.page.document.app-resolve.type.ts

import type { FeaturedPhotoModuleContentAppInit } from "../../../../../../../shared/types/content/modules/featured-photo.module.content.shared.app-int.type";
import type { PhotoAppResolve } from "../../../../../photo/photo.app-resolve.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type FeaturedPhotoModuleContentAppResolve = OmitAndReplace<
  FeaturedPhotoModuleContentAppInit,
  Readonly<{
    photo: PhotoAppResolve;
    alt: string;
    commentary: string | null;
  }>
>;
