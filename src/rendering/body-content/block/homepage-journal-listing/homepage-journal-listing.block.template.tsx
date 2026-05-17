// src/rendering/body-content/block/homepage-journal-listing/homepage-journal-listing.block.template.tsx

import type { AppRenderContextHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/app-render-context.homepage-journal-listing.block.types";

import { HeadingTemplate } from "@rendering/shared/heading.shared.template";

type HomepageJournalListingBlockTemplateProps = Readonly<{
  block: AppRenderContextHomepageJournalListingBlock;
}>;

type HomepageJournalListingEntry =
  AppRenderContextHomepageJournalListingBlock["entries"][number];

type HomepageJournalListingImage = HomepageJournalListingEntry["image"];

type HomepageJournalListingImageTemplateProps = Readonly<{
  image: HomepageJournalListingImage;
}>;

type HomepageJournalListingItemTemplateProps = Readonly<{
  entry: HomepageJournalListingEntry;
}>;

const HomepageJournalListingImageTemplate = ({
  image,
}: HomepageJournalListingImageTemplateProps) => {
  if (image === null) {
    return null;
  }

  return (
    <img
      className="m-homepage-journal-listing__image"
      src={image.src}
      srcSet={image.srcset.join(", ")}
      sizes={image.sizes}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading="lazy"
      decoding="async"
    />
  );
};

const HomepageJournalListingItemTemplate = ({
  entry,
}: HomepageJournalListingItemTemplateProps) => (
  <article className="m-homepage-journal-listing__item">
    {entry.publishedLabel ? (
      <p className="m-homepage-journal-listing__item-date">
        {entry.publishedLabel}
      </p>
    ) : null}

    <h3 className="m-homepage-journal-listing__title">
      <a className="m-homepage-journal-listing__link" href={entry.href}>
        {entry.title}
      </a>
    </h3>

    <a className="m-homepage-journal-listing__item-action" href={entry.href}>
      Read entry
    </a>
  </article>
);

export const HomepageJournalListingBlockTemplate = ({
  block,
}: HomepageJournalListingBlockTemplateProps) => {
  const [featured, ...entries] = block.entries;

  if (featured === undefined) {
    return null;
  }

  return (
    <section className="m-homepage-journal-listing l-content">
      <HeadingTemplate
        heading={block.heading}
        className="m-homepage-journal-listing__heading"
      />

      <article className="m-homepage-journal-listing__featured">
        <a
          className="m-homepage-journal-listing__media-link"
          href={featured.href}
        >
          <HomepageJournalListingImageTemplate image={featured.image} />
        </a>

        <div className="m-homepage-journal-listing__featured-content">
          {featured.publishedLabel ? (
            <p className="m-homepage-journal-listing__date">
              {featured.publishedLabel}
            </p>
          ) : null}

          <h3 className="m-homepage-journal-listing__featured-title">
            <a
              className="m-homepage-journal-listing__featured-link"
              href={featured.href}
            >
              {featured.title}
            </a>
          </h3>

          {featured.intro ? (
            <p className="m-homepage-journal-listing__featured-intro">
              {featured.intro}
            </p>
          ) : null}

          <a
            className="m-homepage-journal-listing__action"
            href={featured.href}
          >
            Read entry
          </a>
        </div>
      </article>

      <div className="m-homepage-journal-listing__list">
        {entries.map((entry, index) => (
          <HomepageJournalListingItemTemplate
            key={`homepage-journal-listing:${index}`}
            entry={entry}
          />
        ))}
      </div>
    </section>
  );
};
