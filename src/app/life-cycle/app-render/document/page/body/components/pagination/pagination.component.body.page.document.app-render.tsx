// src/app/life-cycle/app-render/document/page/body/components/pagination/pagination.component.body.page.document.app-render.tsx

import type { JournalListingModuleAppRenderContext } from "../../../../../../../types/document/page/content/modules/journal-listing/journal-listing.module.content.page.document.app-render-context.type";

type Props = Readonly<{
  pagination: NonNullable<JournalListingModuleAppRenderContext["pagination"]>;
  label: string;
}>;

export const PaginationComponent = ({ pagination, label }: Props) => {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <nav className="c-pagination" aria-label={label}>
      {pagination.previous && (
        <a
          className="c-pagination__previous"
          href={pagination.previous}
          rel="prev"
        >
          ← Previous
        </a>
      )}

      <ol className="c-pagination__pages">
        {pagination.pages.map((page) => (
          <li key={page.number}>
            <a
              href={page.href}
              aria-current={page.current ? "page" : undefined}
            >
              {page.number}
            </a>
          </li>
        ))}
      </ol>

      {pagination.next && (
        <a className="c-pagination__next" href={pagination.next} rel="next">
          Next →
        </a>
      )}
    </nav>
  );
};
