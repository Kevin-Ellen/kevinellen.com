// src/app/life-cycle/app-render/document/page/body/components/journal-entry-listing/journal-entry-listing.component.body.page.document.app-render.tsx

import type { JournalListingModuleAppRenderContext } from "../../../../../../../types/document/page/content/modules/journal-listing/journal-listing.module.content.page.document.app-render-context.type";

type Props = Readonly<{
  entries: JournalListingModuleAppRenderContext["entries"];
  heading: JournalListingModuleAppRenderContext["heading"];
  showViewAllLink: boolean;
}>;

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value.slice(0, 10) + "T00:00:00Z"));

export const JournalEntryListingComponent = ({
  entries,
  heading,
  showViewAllLink,
}: Props) => (
  <section className="m-journal-listing l-frame" aria-labelledby={heading.id}>
    <header className="m-journal-listing__header">
      <h2 className="m-journal-listing__heading" id={heading.id}>
        {heading.text}
      </h2>

      {showViewAllLink && (
        <a
          className="c-editorial-link c-editorial-link--subtle"
          href="/journal"
        >
          <span className="c-editorial-link__label">View all entries</span>
          <span className="c-editorial-link__arrow" aria-hidden="true">
            →
          </span>
        </a>
      )}
    </header>

    <div className="m-journal-listing__grid">
      {entries.map((entry) => {
        const photo = entry.photos[0];

        return (
          <article className="m-journal-listing__item" key={entry.id}>
            <a className="m-journal-listing__link" href={entry.slug}>
              {photo && (
                <img
                  className="m-journal-listing__image"
                  src={photo.image.src}
                  srcSet={photo.image.srcSet}
                  sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 50vw, 25vw"
                  width={photo.width}
                  height={photo.height}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                />
              )}

              <div className="m-journal-listing__content">
                <time
                  className="m-journal-listing__date"
                  dateTime={entry.dateCreated.slice(0, 10)}
                >
                  {formatDate(entry.dateCreated)}
                </time>

                <h3 className="m-journal-listing__title">{entry.label}</h3>

                <span
                  className="c-editorial-link c-editorial-link--subtle"
                  aria-hidden="true"
                >
                  <span className="c-editorial-link__label">Read entry</span>
                  <span className="c-editorial-link__arrow">→</span>
                </span>
              </div>
            </a>
          </article>
        );
      })}
    </div>
  </section>
);
