// src/app-context/resolve/page-content/shared/journal-listing-items.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";

import { appContextResolveJournalListingItems } from "@app-context/resolve/page-content/shared/journal-listing-items.resolve.app-context";

const createJournalPage = (
  overrides: Partial<AppStatePageDefinition> = {},
): AppStatePageDefinition =>
  ({
    id: "journal-one",
    kind: "journal",
    slug: "/journal/one",
    content: {
      head: {
        title: "Journal One",
        intro: "Intro one",
        eyebrow: "Journal",
        showInBody: true,
      },
      content: [],
      footer: [],
    },
    ...overrides,
  }) as AppStatePageDefinition;

const createPublishedJournalPage = (
  id: string,
  publishedAt: string,
): AppStatePageDefinition =>
  createJournalPage({
    id,
    slug: `/journal/${id}`,
    content: {
      head: {
        title: id,
        intro: `${id} intro`,
        eyebrow: "Journal",
        showInBody: true,
      },
      content: [],
      footer: [
        {
          kind: "journalEntryFooter",
          publication: {
            author: "Kevin",
            publishedAt,
            updatedAt: [],
          },
          tags: [],
        },
      ],
    },
  });

describe("appContextResolveJournalListingItems", () => {
  it("returns public journal pages newest first", () => {
    const olderPage = createPublishedJournalPage("older-entry", "2025-01-01");
    const newerPage = createPublishedJournalPage("newer-entry", "2025-02-01");

    const context = {
      publicPages: [olderPage, newerPage],
      resolvePhoto: jest.fn(() => null),
    } as unknown as AppContextPageContentResolverContext;

    expect(
      appContextResolveJournalListingItems(context).map((item) => item.id),
    ).toEqual(["newer-entry", "older-entry"]);
  });

  it("ignores non-journal pages and journal pages without slugs", () => {
    const context = {
      publicPages: [
        createJournalPage({
          id: "valid",
          slug: "/journal/valid",
        }),
        createJournalPage({
          id: "missing-slug",
          slug: null,
        }),
        createJournalPage({
          id: "article",
          kind: "note",
          slug: "/articles/example",
        }),
      ],
      resolvePhoto: jest.fn(() => null),
    } as unknown as AppContextPageContentResolverContext;

    expect(appContextResolveJournalListingItems(context)).toEqual([
      {
        id: "valid",
        href: "/journal/valid",
        title: "Journal One",
        intro: "Intro one",
        eyebrow: "Journal",
        publishedAt: null,
        image: null,
      },
    ]);
  });

  it("sorts undated pages last and then by id", () => {
    const context = {
      publicPages: [
        createJournalPage({
          id: "z-entry",
          slug: "/journal/z-entry",
        }),
        createJournalPage({
          id: "a-entry",
          slug: "/journal/a-entry",
        }),
        createPublishedJournalPage("dated-entry", "2025-01-01"),
      ],
      resolvePhoto: jest.fn(() => null),
    } as unknown as AppContextPageContentResolverContext;

    expect(
      appContextResolveJournalListingItems(context).map((item) => item.id),
    ).toEqual(["dated-entry", "a-entry", "z-entry"]);
  });

  it("resolves the first hero photo found inside article sections", () => {
    const photo = {
      id: "hero-photo",
      title: "Hero photo",
    };

    const page = createJournalPage({
      content: {
        head: {
          title: "Hero listing image",
          intro: "Intro",
          eyebrow: "Journal",
          showInBody: true,
        },
        content: [
          {
            kind: "paragraph",
            flow: "content",
            content: [],
          },
          {
            kind: "articleSection",
            heading: {
              text: "Section",
              level: 2,
              visuallyHidden: false,
            },
            modules: [
              {
                kind: "hero",
                photoId: "hero-photo",
                immersive: false,
                flow: "content",
              },
            ],
          },
        ],
        footer: [],
      },
    });

    const context = {
      publicPages: [page],
      resolvePhoto: jest.fn((photoId: string) =>
        photoId === "hero-photo" ? photo : null,
      ),
    } as unknown as AppContextPageContentResolverContext;

    expect(appContextResolveJournalListingItems(context)[0]).toEqual({
      id: "journal-one",
      href: "/journal/one",
      title: "Hero listing image",
      intro: "Intro",
      eyebrow: "Journal",
      publishedAt: null,
      image: photo,
    });

    expect(context.resolvePhoto).toHaveBeenCalledWith("hero-photo");
  });

  it("uses null image when no listing photo can be resolved", () => {
    const page = createJournalPage();

    const context = {
      publicPages: [page],
      resolvePhoto: jest.fn(() => null),
    } as unknown as AppContextPageContentResolverContext;

    expect(appContextResolveJournalListingItems(context)[0].image).toBeNull();
    expect(context.resolvePhoto).not.toHaveBeenCalled();
  });
});
