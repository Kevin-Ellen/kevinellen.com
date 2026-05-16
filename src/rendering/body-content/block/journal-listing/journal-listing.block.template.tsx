// src/rendering/body-content/block/journal-listing/journal-listing.block.template.tsx

import type {
  AppRenderContextJournalListingBlock,
  AppRenderContextJournalListingItem,
} from "@shared-types/page-content/block/journal-listing/app-render-context.journal-listing.block.types";

import { PaginationTemplate } from "@rendering/shared/pagination.shared.template";

type JournalListingBlockTemplateProps = Readonly<{
  block: AppRenderContextJournalListingBlock;
}>;

type JournalListingImageTemplateProps = Readonly<{
  image: NonNullable<AppRenderContextJournalListingItem["image"]>;
}>;

type JournalListingItemTemplateProps = Readonly<{
  item: AppRenderContextJournalListingItem;
  index: number;
  currentPage: number;
}>;

const JournalListingImageTemplate = ({
  image,
}: JournalListingImageTemplateProps) => (
  <div className="m-journal-listing__media">
    <img
      src={image.src}
      srcSet={image.srcset.join(", ")}
      sizes={image.sizes}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading="lazy"
    />
  </div>
);

const JournalListingItemTemplate = ({
  item,
  index,
  currentPage,
}: JournalListingItemTemplateProps) => {
  const isFeatured = index === 0 && currentPage === 1;

  const itemClassName = isFeatured
    ? "m-journal-listing__item m-journal-listing__item--featured l-content"
    : "m-journal-listing__item l-content";

  return (
    <li className={itemClassName}>
      <a className="m-journal-listing__link" href={item.href}>
        {item.image ? <JournalListingImageTemplate image={item.image} /> : null}

        <div className="m-journal-listing__content m-heading">
          {item.publishedLabel ? (
            <time
              className="m-heading__eyebrow"
              dateTime={item.publishedAt ?? ""}
            >
              {item.publishedLabel}
            </time>
          ) : null}

          <h3 className="m-heading__title">{item.title}</h3>

          {isFeatured && item.intro ? (
            <p className="m-heading__intro">{item.intro}</p>
          ) : null}
        </div>
      </a>
    </li>
  );
};

export const JournalListingBlockTemplate = ({
  block,
}: JournalListingBlockTemplateProps) => (
  <section
    className="m-contentBlock m-journal-listing"
    aria-label="Journal listing"
  >
    <ul className="m-journal-listing__list">
      {block.items.map((item, index) => (
        <JournalListingItemTemplate
          key={`journal-listing:${index}`}
          item={item}
          index={index}
          currentPage={block.pagination.currentPage}
        />
      ))}
    </ul>

    <div className="m-contentBlock--content">
      <PaginationTemplate
        pagination={block.pagination}
        ariaLabel="Journal pagination"
      />
    </div>
  </section>
);
