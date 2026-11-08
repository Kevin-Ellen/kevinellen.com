// src/app/life-cycle/app-render/document/page/body/components/journal-entry-featured/journal-entry-featured.component.body.page.document.app-render.tsx

import type { JournalListingModuleAppRenderContext } from "../../../../../../../types/document/page/content/modules/journal-listing/journal-listing.module.content.page.document.app-render-context.type";

type FeaturedEntry = NonNullable<
  JournalListingModuleAppRenderContext["featured"]
>;

type Props = Readonly<{
  entry: FeaturedEntry;
  eyebrow: string;
}>;

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value.slice(0, 10) + "T00:00:00Z"));

export const JournalEntryFeaturedComponent = ({ entry, eyebrow }: Props) => (
  <section
    className="m-latest-entry l-frame"
    aria-labelledby="latest-entry-title"
  >
    <div className="m-latest-entry__content">
      <p className="m-latest-entry__eyebrow">{eyebrow}</p>

      <time
        className="m-latest-entry__date"
        dateTime={entry.dateCreated.slice(0, 10)}
      >
        {formatDate(entry.dateCreated)}
      </time>

      <h2 className="m-latest-entry__title" id="latest-entry-title">
        {entry.label}
      </h2>

      <p className="m-latest-entry__description">{entry.intro}</p>

      <a
        className="c-editorial-link c-editorial-link--subtle"
        href={entry.slug}
      >
        <span className="c-editorial-link__label">Read entry</span>
        <span className="c-editorial-link__arrow" aria-hidden="true">
          →
        </span>
      </a>
    </div>

    <div className="m-latest-entry__gallery">
      {entry.photos.map((photo, index) => (
        <img
          key={photo.id}
          className={[
            "m-latest-entry__image",
            index === 0 && "m-latest-entry__image--featured",
          ]
            .filter(Boolean)
            .join(" ")}
          src={photo.image.src}
          srcSet={photo.image.srcSet}
          sizes="(max-width: 48rem) 100vw, 50vw"
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  </section>
);
