// src/app/life-cycle/app-render/document/page/body/modules/journal-listing/journal-listing.module.body.page.document.app-render.tsx

import type { JournalListingModuleAppRenderContext } from "../../../../../../../types/document/page/content/modules/journal-listing/journal-listing.module.content.page.document.app-render-context.type";

import { JournalEntryFeaturedComponent } from "../../components/journal-entry-featured/journal-entry-featured.component.body.page.document.app-render";
import { JournalEntryListingComponent } from "../../components/journal-entry-listing/journal-entry-listing.component.body.page.document.app-render";
import { PaginationComponent } from "../../components/pagination/pagination.component.body.page.document.app-render";

type Props = Readonly<{
  module: JournalListingModuleAppRenderContext;
  contained?: boolean;
}>;

export const JournalListingModule = ({ module }: Props) => (
  <>
    {module.featured && (
      <JournalEntryFeaturedComponent
        entry={module.featured}
        eyebrow={module.eyebrow}
      />
    )}

    <JournalEntryListingComponent
      entries={module.entries}
      heading={module.heading}
      showViewAllLink={module.showViewAllLink}
    />
    {module.pagination && (
      <PaginationComponent
        pagination={module.pagination}
        label="Journal pagination"
      />
    )}
  </>
);
