// src/rendering/body-content/block/note-listing/note-listing.block.template.tsx

import type {
  AppRenderContextNoteListingBlock,
  AppRenderContextNoteListingItem,
} from "@shared-types/page-content/block/note-listing/app-render-context.note-listing.block.types";

import { PaginationTemplate } from "@rendering/shared/pagination.shared.template";

type NoteListingBlockTemplateProps = Readonly<{
  block: AppRenderContextNoteListingBlock;
}>;

type NoteListingMetaTemplateProps = Readonly<{
  item: AppRenderContextNoteListingItem;
}>;

type NoteListingItemTemplateProps = Readonly<{
  item: AppRenderContextNoteListingItem;
  index: number;
  currentPage: number;
}>;

const NoteListingMetaTemplate = ({ item }: NoteListingMetaTemplateProps) => {
  if (!item.topic && !item.publishedLabel) {
    return null;
  }

  return (
    <p className="m-heading__eyebrow m-note-listing__meta">
      {item.topic ? <span>{item.topic}</span> : null}

      {item.topic && item.publishedLabel ? (
        <span aria-hidden="true">·</span>
      ) : null}

      {item.publishedLabel ? (
        <time dateTime={item.publishedAt ?? ""}>{item.publishedLabel}</time>
      ) : null}
    </p>
  );
};

const NoteListingItemTemplate = ({
  item,
  index,
  currentPage,
}: NoteListingItemTemplateProps) => {
  const isFeatured = index === 0 && currentPage === 1;

  const itemClassName = isFeatured
    ? "m-note-listing__item m-note-listing__item--featured l-content"
    : "m-note-listing__item l-content";

  return (
    <li className={itemClassName}>
      <a className="m-note-listing__link" href={item.href}>
        <div className="m-note-listing__content m-heading">
          <NoteListingMetaTemplate item={item} />

          <h3 className="m-heading__title">{item.title}</h3>

          {item.intro ? <p className="m-heading__intro">{item.intro}</p> : null}
        </div>
      </a>
    </li>
  );
};

export const NoteListingBlockTemplate = ({
  block,
}: NoteListingBlockTemplateProps) => (
  <section className="m-contentBlock m-note-listing" aria-label="Notes listing">
    <ul className="m-note-listing__list">
      {block.items.map((item, index) => (
        <NoteListingItemTemplate
          key={`note-listing:${index}`}
          item={item}
          index={index}
          currentPage={block.pagination.currentPage}
        />
      ))}
    </ul>

    <PaginationTemplate
      pagination={block.pagination}
      ariaLabel="Notes pagination"
    />
  </section>
);
