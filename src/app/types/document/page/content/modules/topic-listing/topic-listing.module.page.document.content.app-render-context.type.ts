// src/app/types/document/page/content/modules/topic-listing/topic-listing.module.page.document.content.app-render-context.type.ts

import type {
  TopicListingItemContentAppResolve,
  TopicListingModuleContentAppResolve,
} from "./topic-listing.module.page.document.content.app-resolve.type";
import type { EditorialPhotoComponentContentAppRenderContext } from "../../components/editorial-photo/editorial-photo.component.content.page.document.app-render-context.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

type PaginationAppRenderContext = Readonly<{
  currentPage: number;
  totalPages: number;
  previous: string | null;
  next: string | null;
  pages: readonly Readonly<{
    number: number;
    href: string;
    current: boolean;
  }>[];
}>;

export type TopicListingItemContentAppRenderContext = Readonly<
  OmitAndReplace<
    TopicListingItemContentAppResolve,
    {
      image: EditorialPhotoComponentContentAppRenderContext;
    }
  >
>;

export type TopicListingModuleContentAppRenderContext = Readonly<
  OmitAndReplace<
    TopicListingModuleContentAppResolve,
    {
      items: readonly TopicListingItemContentAppRenderContext[];
      pagination: PaginationAppRenderContext | null;
    }
  >
>;
