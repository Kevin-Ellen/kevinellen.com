// tests/src/app-context/resolve/page/content/block/journal-listing.resolve.app-context.test.ts

import type { AppContextPhotoMetadata } from "@shared-types/media/photo/app-context.photo.types";

import { appContextResolveJournalListingBlockContentModule } from "@app-context/resolve/page/content/block/journal-listing.resolve.app-context";

describe("appContextResolveJournalListingBlockContentModule", () => {
  const module = {
    kind: "journalListing",
    pagination: {
      pageSize: 2,
    },
    flow: "content",
  } as const;

  const createJournalPage = ({
    id,
    slug,
    title,
    publishedAt,
    photoId = null,
  }: {
    id: string;
    slug: `/${string}`;
    title: string;
    publishedAt: string | null;
    photoId?: string | null;
  }) => ({
    id,
    kind: "journal",
    slug,
    label: title,
    content: {
      header: {
        eyebrow: "Field Notes",
        title,
        intro: `${title} intro`,
      },
      content:
        photoId === null
          ? []
          : [
              {
                kind: "articleSection",
                modules: [
                  {
                    kind: "hero",
                    photoId,
                  },
                ],
              },
            ],
      footer:
        publishedAt === null
          ? []
          : [
              {
                kind: "journalEntryFooter",
                publication: {
                  publishedAt,
                },
              },
            ],
    },
  });

  it("filters to journal pages, sorts newest first, slices by page size, and maps items", () => {
    const result = appContextResolveJournalListingBlockContentModule(module, {
      photos: [],
      metadataLabels: {} as never,
      resolveInternalLink: jest.fn(),
      routingPagination: { currentPage: 1 },
      publicPages: [
        {
          id: "about",
          kind: "static",
          slug: "/about",
        },
        createJournalPage({
          id: "journal:older",
          slug: "/journal/older",
          title: "Older",
          publishedAt: "2026-01-01T00:00:00+00:00",
        }),
        createJournalPage({
          id: "journal:newer",
          slug: "/journal/newer",
          title: "Newer",
          publishedAt: "2026-02-01T00:00:00+00:00",
        }),
        createJournalPage({
          id: "journal:newest",
          slug: "/journal/newest",
          title: "Newest",
          publishedAt: "2026-03-01T00:00:00+00:00",
        }),
      ] as never,
    });

    expect(result).toEqual({
      kind: "journalListing",
      flow: "content",
      pagination: {
        pageSize: 2,
        currentPage: 1,
        totalItems: 3,
        totalPages: 2,
        previousHref: null,
        nextHref: "/journal/page-2",
      },
      items: [
        {
          id: "journal:newest",
          href: "/journal/newest",
          title: "Newest",
          intro: "Newest intro",
          eyebrow: "Field Notes",
          publishedAt: "2026-03-01T00:00:00+00:00",
          image: null,
        },
        {
          id: "journal:newer",
          href: "/journal/newer",
          title: "Newer",
          intro: "Newer intro",
          eyebrow: "Field Notes",
          publishedAt: "2026-02-01T00:00:00+00:00",
          image: null,
        },
      ],
    });
  });

  it("uses routing pagination to return the requested page slice", () => {
    const result = appContextResolveJournalListingBlockContentModule(module, {
      photos: [],
      metadataLabels: {} as never,
      resolveInternalLink: jest.fn(),
      routingPagination: { currentPage: 2 },
      publicPages: [
        createJournalPage({
          id: "journal:newest",
          slug: "/journal/newest",
          title: "Newest",
          publishedAt: "2026-03-01T00:00:00+00:00",
        }),
        createJournalPage({
          id: "journal:newer",
          slug: "/journal/newer",
          title: "Newer",
          publishedAt: "2026-02-01T00:00:00+00:00",
        }),
        createJournalPage({
          id: "journal:older",
          slug: "/journal/older",
          title: "Older",
          publishedAt: "2026-01-01T00:00:00+00:00",
        }),
      ] as never,
    });

    expect(result.pagination).toEqual({
      pageSize: 2,
      currentPage: 2,
      totalItems: 3,
      totalPages: 2,
      previousHref: "/journal",
      nextHref: null,
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe("journal:older");
  });

  it("resolves the listing image from the first hero photo", () => {
    const photo = {
      id: "photo:one",
      alt: "A bird in reeds",
    } as AppContextPhotoMetadata;

    const result = appContextResolveJournalListingBlockContentModule(module, {
      photos: [photo],
      metadataLabels: {} as never,
      resolveInternalLink: jest.fn(),
      routingPagination: { currentPage: 1 },
      publicPages: [
        createJournalPage({
          id: "journal:with-photo",
          slug: "/journal/with-photo",
          title: "With photo",
          publishedAt: "2026-03-01T00:00:00+00:00",
          photoId: "photo:one",
        }),
      ] as never,
    });

    expect(result.items[0].image).toBe(photo);
  });

  it("uses null image when hero photo metadata is missing", () => {
    const result = appContextResolveJournalListingBlockContentModule(module, {
      photos: [],
      metadataLabels: {} as never,
      resolveInternalLink: jest.fn(),
      routingPagination: { currentPage: 1 },
      publicPages: [
        createJournalPage({
          id: "journal:with-missing-photo",
          slug: "/journal/with-missing-photo",
          title: "Missing photo",
          publishedAt: "2026-03-01T00:00:00+00:00",
          photoId: "photo:missing",
        }),
      ] as never,
    });

    expect(result.items[0].image).toBeNull();
  });

  it("sorts entries without published dates last", () => {
    const result = appContextResolveJournalListingBlockContentModule(module, {
      photos: [],
      metadataLabels: {} as never,
      resolveInternalLink: jest.fn(),
      routingPagination: { currentPage: 1 },
      publicPages: [
        createJournalPage({
          id: "journal:no-date",
          slug: "/journal/no-date",
          title: "No date",
          publishedAt: null,
        }),
        createJournalPage({
          id: "journal:dated",
          slug: "/journal/dated",
          title: "Dated",
          publishedAt: "2026-03-01T00:00:00+00:00",
        }),
      ] as never,
    });

    expect(result.items.map((item) => item.id)).toEqual([
      "journal:dated",
      "journal:no-date",
    ]);
  });

  it("ignores journal pages without slugs", () => {
    const result = appContextResolveJournalListingBlockContentModule(module, {
      photos: [],
      metadataLabels: {} as never,
      resolveInternalLink: jest.fn(),
      routingPagination: { currentPage: 1 },
      publicPages: [
        createJournalPage({
          id: "journal:with-slug",
          slug: "/journal/with-slug",
          title: "With slug",
          publishedAt: "2026-03-01T00:00:00+00:00",
        }),
        {
          ...createJournalPage({
            id: "journal:no-slug",
            slug: "/journal/no-slug",
            title: "No slug",
            publishedAt: "2026-04-01T00:00:00+00:00",
          }),
          slug: null,
        },
      ] as never,
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe("journal:with-slug");
  });

  it("defaults to page 1 when routing pagination is null", () => {
    const result = appContextResolveJournalListingBlockContentModule(module, {
      photos: [],
      metadataLabels: {} as never,
      resolveInternalLink: jest.fn(),
      routingPagination: null,
      publicPages: [
        createJournalPage({
          id: "journal:one",
          slug: "/journal/one",
          title: "One",
          publishedAt: "2026-03-01T00:00:00+00:00",
        }),
      ] as never,
    });

    expect(result.pagination.currentPage).toBe(1);
  });

  it("sorts undated entries by id when both dates are missing", () => {
    const result = appContextResolveJournalListingBlockContentModule(module, {
      photos: [],
      metadataLabels: {} as never,
      resolveInternalLink: jest.fn(),
      routingPagination: { currentPage: 1 },
      publicPages: [
        createJournalPage({
          id: "journal:b",
          slug: "/journal/b",
          title: "B",
          publishedAt: null,
        }),
        createJournalPage({
          id: "journal:a",
          slug: "/journal/a",
          title: "A",
          publishedAt: null,
        }),
      ] as never,
    });

    expect(result.items.map((item) => item.id)).toEqual([
      "journal:a",
      "journal:b",
    ]);
  });

  it("skips non-article sections when resolving listing photo", () => {
    const photo = { id: "photo:one" } as AppContextPhotoMetadata;

    const page = createJournalPage({
      id: "journal:with-photo",
      slug: "/journal/with-photo",
      title: "With photo",
      publishedAt: "2026-03-01T00:00:00+00:00",
      photoId: "photo:one",
    });

    const result = appContextResolveJournalListingBlockContentModule(module, {
      photos: [photo],
      metadataLabels: {} as never,
      resolveInternalLink: jest.fn(),
      routingPagination: { currentPage: 1 },
      publicPages: [
        {
          ...page,
          content: {
            ...page.content,
            content: [{ kind: "paragraph" }, ...page.content.content],
          },
        },
      ] as never,
    });

    expect(result.items[0].image).toBe(photo);
  });

  it("uses null image when article sections contain no hero module", () => {
    const result = appContextResolveJournalListingBlockContentModule(module, {
      photos: [],
      metadataLabels: {} as never,
      resolveInternalLink: jest.fn(),
      routingPagination: { currentPage: 1 },
      publicPages: [
        {
          ...createJournalPage({
            id: "journal:no-hero",
            slug: "/journal/no-hero",
            title: "No hero",
            publishedAt: "2026-03-01T00:00:00+00:00",
          }),
          content: {
            header: {
              eyebrow: "Field Notes",
              title: "No hero",
              intro: "No hero intro",
            },
            content: [
              {
                kind: "articleSection",
                modules: [{ kind: "paragraph" }],
              },
            ],
            footer: [
              {
                kind: "journalEntryFooter",
                publication: {
                  publishedAt: "2026-03-01T00:00:00+00:00",
                },
              },
            ],
          },
        },
      ] as never,
    });

    expect(result.items[0].image).toBeNull();
  });

  it("keeps dated entries before undated entries when undated entry is second", () => {
    const result = appContextResolveJournalListingBlockContentModule(module, {
      photos: [],
      metadataLabels: {} as never,
      resolveInternalLink: jest.fn(),
      routingPagination: { currentPage: 1 },
      publicPages: [
        createJournalPage({
          id: "journal:dated",
          slug: "/journal/dated",
          title: "Dated",
          publishedAt: "2026-03-01T00:00:00+00:00",
        }),
        createJournalPage({
          id: "journal:no-date",
          slug: "/journal/no-date",
          title: "No date",
          publishedAt: null,
        }),
      ] as never,
    });

    expect(result.items.map((item) => item.id)).toEqual([
      "journal:dated",
      "journal:no-date",
    ]);
  });

  it("sorts entries with the same published date by id", () => {
    const result = appContextResolveJournalListingBlockContentModule(module, {
      photos: [],
      metadataLabels: {} as never,
      resolveInternalLink: jest.fn(),
      routingPagination: { currentPage: 1 },
      publicPages: [
        createJournalPage({
          id: "journal:b",
          slug: "/journal/b",
          title: "B",
          publishedAt: "2026-03-01T00:00:00+00:00",
        }),
        createJournalPage({
          id: "journal:a",
          slug: "/journal/a",
          title: "A",
          publishedAt: "2026-03-01T00:00:00+00:00",
        }),
      ] as never,
    });

    expect(result.items.map((item) => item.id)).toEqual([
      "journal:a",
      "journal:b",
    ]);
  });
});
