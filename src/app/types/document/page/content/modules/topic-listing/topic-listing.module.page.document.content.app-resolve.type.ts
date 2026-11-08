// src/app/types/document/page/content/modules/topic-listing/topic-listing.module.page.document.content.app-resolve.type.ts

import type {
  TopicListingModuleContentAppInit,
  TopicListingItemContentAppInit,
} from "../../../../../../../shared/types/content/modules/topic-listing.module.content.shared.app-init.type";
import type { EditorialPhotoComponentContentAppResolve } from "../../components/editorial-photo/editorial-photo.component.content.page.document.app-resolve.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type TopicListingPaginationAppResolve = Readonly<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}>;

export type TopicListingItemContentAppResolve = Readonly<
  OmitAndReplace<
    TopicListingItemContentAppInit,
    {
      image: EditorialPhotoComponentContentAppResolve;
    }
  >
>;

export type TopicListingModuleContentAppResolve = Readonly<
  OmitAndReplace<
    TopicListingModuleContentAppInit,
    {
      items: readonly TopicListingItemContentAppResolve[];
      pagination: TopicListingPaginationAppResolve | null;
    }
  >
>;
