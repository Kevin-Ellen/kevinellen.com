// src/app-context/resolve/page-content/shared/note-listing-items.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";

import { appContextResolveNoteListingItems } from "@app-context/resolve/page-content/shared/note-listing-items.resolve.app-context";

const createNotePage = (
  overrides: Partial<AppStatePageDefinition> = {},
): AppStatePageDefinition =>
  ({
    id: "note-one",
    kind: "note",
    slug: "/notes/note-one",
    label: "Note One",
    metadata: {
      pageTitle: "Note One",
      metaDescription: "Description",
    },
    breadcrumbs: ["home"],
    content: {
      head: {
        eyebrow: "Note",
        title: "Note One",
        intro: "Intro one",
      },
      content: [],
      footer: [
        {
          kind: "noteEntryFooter",
          publication: {
            author: "Kevin",
            publishedAt: "2026-05-10T10:00:00.000Z",
            updatedAt: [],
          },
          topic: "Architecture",
          tags: ["typescript"],
        },
      ],
    },
    ...overrides,
  }) as AppStatePageDefinition;

describe("appContextResolveNoteListingItems", () => {
  it("resolves note listing items sorted newest first", () => {
    const olderPage = createNotePage({
      id: "note-old",
      slug: "/notes/note-old",
      content: {
        head: {
          eyebrow: "Note",
          title: "Older Note",
          intro: "Older intro",
          showInBody: true,
        },
        content: [],
        footer: [
          {
            kind: "noteEntryFooter",
            publication: {
              author: "Kevin",
              publishedAt: "2026-05-09T10:00:00.000Z",
              updatedAt: [],
            },
            topic: "SEO",
            tags: [],
          },
        ],
      },
    });

    const newerPage = createNotePage({
      id: "note-new",
      slug: "/notes/note-new",
      content: {
        head: {
          eyebrow: "Field Note",
          title: "Newer Note",
          intro: "Newer intro",
          showInBody: true,
        },
        content: [],
        footer: [
          {
            kind: "noteEntryFooter",
            publication: {
              author: "Kevin",
              publishedAt: "2026-05-11T10:00:00.000Z",
              updatedAt: [],
            },
            topic: "Architecture",
            tags: [],
          },
        ],
      },
    });

    const context = {
      publicPages: [olderPage, newerPage],
    } as unknown as AppContextPageContentResolverContext;

    expect(appContextResolveNoteListingItems(context)).toEqual([
      {
        id: "note-new",
        href: "/notes/note-new",
        title: "Newer Note",
        intro: "Newer intro",
        eyebrow: "Field Note",
        publishedAt: "2026-05-11T10:00:00.000Z",
        topic: "Architecture",
      },
      {
        id: "note-old",
        href: "/notes/note-old",
        title: "Older Note",
        intro: "Older intro",
        eyebrow: "Note",
        publishedAt: "2026-05-09T10:00:00.000Z",
        topic: "SEO",
      },
    ]);
  });

  it("filters non-note pages", () => {
    const notePage = createNotePage();

    const journalPage = {
      ...createNotePage(),
      id: "journal-one",
      kind: "journal",
      slug: "/journal/test",
    } as AppStatePageDefinition;

    const context = {
      publicPages: [notePage, journalPage],
    } as unknown as AppContextPageContentResolverContext;

    expect(appContextResolveNoteListingItems(context)).toEqual([
      {
        id: "note-one",
        href: "/notes/note-one",
        title: "Note One",
        intro: "Intro one",
        eyebrow: "Note",
        publishedAt: "2026-05-10T10:00:00.000Z",
        topic: "Architecture",
      },
    ]);
  });

  it("filters note pages with null slugs", () => {
    const context = {
      publicPages: [
        createNotePage({
          slug: null,
        }),
      ],
    } as unknown as AppContextPageContentResolverContext;

    expect(appContextResolveNoteListingItems(context)).toEqual([]);
  });

  it("falls back to null publication date and topic", () => {
    const context = {
      publicPages: [
        createNotePage({
          content: {
            head: {
              eyebrow: null,
              title: "Untagged Note",
              intro: null,
              showInBody: true,
            },
            content: [],
            footer: [],
          },
        }),
      ],
    } as unknown as AppContextPageContentResolverContext;

    expect(appContextResolveNoteListingItems(context)).toEqual([
      {
        id: "note-one",
        href: "/notes/note-one",
        title: "Untagged Note",
        intro: null,
        eyebrow: null,
        publishedAt: null,
        topic: null,
      },
    ]);
  });

  it("sorts by id when publication dates are identical", () => {
    const aPage = createNotePage({
      id: "a-note",
      slug: "/notes/a-note",
    });

    const bPage = createNotePage({
      id: "b-note",
      slug: "/notes/b-note",
    });

    const context = {
      publicPages: [bPage, aPage],
    } as unknown as AppContextPageContentResolverContext;

    expect(
      appContextResolveNoteListingItems(context).map((item) => item.id),
    ).toEqual(["a-note", "b-note"]);
  });

  it("sorts notes with missing publication dates after dated notes", () => {
    const datedPage = createNotePage({
      id: "dated-note",
      slug: "/notes/dated-note",
    });

    const undatedPage = createNotePage({
      id: "undated-note",
      slug: "/notes/undated-note",
      content: {
        head: {
          eyebrow: "Note",
          title: "Undated Note",
          intro: "Undated intro",
          showInBody: true,
        },
        content: [],
        footer: [],
      },
    });

    const context = {
      publicPages: [undatedPage, datedPage],
    } as unknown as AppContextPageContentResolverContext;

    expect(
      appContextResolveNoteListingItems(context).map((item) => item.id),
    ).toEqual(["dated-note", "undated-note"]);
  });

  it("sorts undated notes by id", () => {
    const bPage = createNotePage({
      id: "b-undated-note",
      slug: "/notes/b-undated-note",
      content: {
        head: {
          eyebrow: "Note",
          title: "B Undated Note",
          intro: "B intro",
          showInBody: true,
        },
        content: [],
        footer: [],
      },
    });

    const aPage = createNotePage({
      id: "a-undated-note",
      slug: "/notes/a-undated-note",
      content: {
        head: {
          eyebrow: "Note",
          title: "A Undated Note",
          intro: "A intro",
          showInBody: true,
        },
        content: [],
        footer: [],
      },
    });

    const context = {
      publicPages: [bPage, aPage],
    } as unknown as AppContextPageContentResolverContext;

    expect(
      appContextResolveNoteListingItems(context).map((item) => item.id),
    ).toEqual(["a-undated-note", "b-undated-note"]);
  });
});
