// src/rendering/body-content/block/homepage-note-listing/homepage-note-listing.block.template.tsx

import type { AppRenderContextHomepageNoteListingBlock } from "@shared-types/page-content/block/homepage-note-listing/app-render-context.homepage-note-listing.block.types";

import { HeadingTemplate } from "@rendering/shared/heading.shared.template";

type HomepageNoteListingBlockTemplateProps = Readonly<{
  block: AppRenderContextHomepageNoteListingBlock;
}>;

type HomepageNoteListingNote =
  AppRenderContextHomepageNoteListingBlock["notes"][number];

type NoteMetaTemplateProps = Readonly<{
  note: HomepageNoteListingNote;
}>;

type HomepageNoteListingItemTemplateProps = Readonly<{
  note: HomepageNoteListingNote;
}>;

const NoteMetaTemplate = ({ note }: NoteMetaTemplateProps) => {
  if (!note.topic && !(note.publishedAt && note.publishedLabel)) {
    return null;
  }

  return (
    <p className="m-homepage-note-listing__meta">
      {note.topic ? <span>{note.topic}</span> : null}

      {note.topic && note.publishedAt && note.publishedLabel ? (
        <span aria-hidden="true">·</span>
      ) : null}

      {note.publishedAt && note.publishedLabel ? (
        <time dateTime={note.publishedAt}>{note.publishedLabel}</time>
      ) : null}
    </p>
  );
};

const HomepageNoteListingItemTemplate = ({
  note,
}: HomepageNoteListingItemTemplateProps) => (
  <article className="m-homepage-note-listing__item">
    <NoteMetaTemplate note={note} />

    <h3 className="m-homepage-note-listing__title">
      <a className="m-homepage-note-listing__link" href={note.href}>
        {note.title}
      </a>
    </h3>

    {note.intro ? (
      <p className="m-homepage-note-listing__intro">{note.intro}</p>
    ) : null}

    <a className="m-homepage-note-listing__item-action" href={note.href}>
      Read note
    </a>
  </article>
);

export const HomepageNoteListingBlockTemplate = ({
  block,
}: HomepageNoteListingBlockTemplateProps) => {
  const [featured, ...notes] = block.notes;

  if (featured === undefined) {
    return null;
  }

  return (
    <section className="m-homepage-note-listing l-content">
      <HeadingTemplate
        heading={block.heading}
        className="m-homepage-note-listing__heading"
      />

      <article className="m-homepage-note-listing__featured">
        <div className="m-homepage-note-listing__featured-content">
          <NoteMetaTemplate note={featured} />

          <h3 className="m-homepage-note-listing__featured-title">
            <a
              className="m-homepage-note-listing__featured-link"
              href={featured.href}
            >
              {featured.title}
            </a>
          </h3>

          {featured.intro ? (
            <p className="m-homepage-note-listing__featured-intro">
              {featured.intro}
            </p>
          ) : null}

          <a className="m-homepage-note-listing__action" href={featured.href}>
            Read note
          </a>
        </div>
      </article>

      <div className="m-homepage-note-listing__list">
        {notes.map((note, index) => (
          <HomepageNoteListingItemTemplate
            key={`homepage-note-listing:${index}`}
            note={note}
          />
        ))}
      </div>
    </section>
  );
};
