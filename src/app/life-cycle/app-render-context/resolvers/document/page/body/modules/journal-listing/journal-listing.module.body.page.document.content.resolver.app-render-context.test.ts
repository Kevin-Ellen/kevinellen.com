// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/journal-listing/journal-listing.module.body.page.document.content.resolver.app-render-context.test.ts

import { resolveJournalListingModuleAppRenderContext } from "./journal-listing.module.body.page.document.content.resolver.app-render-context";

import { resolvePhotoAppRenderContext } from "../../../../../primitives/photo/photo.primitive.resolver.app-render-context";
import { resolvePaginationAppRenderContext } from "../../../../../primitives/pagination/pagination.primitive.resolver.app-render-context";

jest.mock(
  "../../../../../primitives/photo/photo.primitive.resolver.app-render-context",
  () => ({
    resolvePhotoAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "../../../../../primitives/pagination/pagination.primitive.resolver.app-render-context",
  () => ({
    resolvePaginationAppRenderContext: jest.fn(),
  }),
);

const mockedPhoto = jest.mocked(resolvePhotoAppRenderContext);
const mockedPagination = jest.mocked(resolvePaginationAppRenderContext);

type Content = Parameters<
  typeof resolveJournalListingModuleAppRenderContext
>[0]["content"];

type Entry = Content["entries"][number];
type Photo = Entry["photos"][number];
type ResolvedPhoto = ReturnType<typeof resolvePhotoAppRenderContext>;
type ResolvedPagination = ReturnType<typeof resolvePaginationAppRenderContext>;

describe("Journal listing module AppRenderContext resolver", () => {
  const createPhoto = (id: string): Photo =>
    ({
      id,
      title: id,
    }) as unknown as Photo;

  const createEntry = (id: string, photos: Photo[]): Entry =>
    ({
      id,
      title: id,
      photos,
    }) as unknown as Entry;

  const featuredPhoto = createPhoto("featured-photo");
  const firstPhoto = createPhoto("first-photo");
  const secondPhoto = createPhoto("second-photo");
  const thirdPhoto = createPhoto("third-photo");

  const createContent = (overrides: Record<string, unknown> = {}): Content =>
    ({
      kind: "journalListing",
      topicId: null,
      featured: {
        id: "featured-entry",
        title: "Featured journal",
        photos: [featuredPhoto],
      },
      entries: [
        createEntry("first", [firstPhoto, secondPhoto]),
        createEntry("second", [thirdPhoto]),
      ],
      pagination: {
        currentPage: 1,
        totalPages: 3,
      },
      ...overrides,
    }) as unknown as Content;

  const resolvedPagination = {
    currentPage: 1,
    totalPages: 3,
    previous: null,
    next: "/journal/page-2",
    pages: [],
  } as ResolvedPagination;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedPhoto.mockImplementation(
      ({ photo }) =>
        ({
          id: photo.id,
          image: {
            src: `/resolved/${photo.id}`,
          },
        }) as unknown as ResolvedPhoto,
    );

    mockedPagination.mockReturnValue(resolvedPagination);
  });

  it("resolves featured photos and entry photos in order", () => {
    const content = createContent();

    resolveJournalListingModuleAppRenderContext({ content });

    expect(mockedPhoto).toHaveBeenCalledTimes(4);

    expect(mockedPhoto).toHaveBeenNthCalledWith(1, {
      photo: featuredPhoto,
    });
    expect(mockedPhoto).toHaveBeenNthCalledWith(2, {
      photo: firstPhoto,
    });
    expect(mockedPhoto).toHaveBeenNthCalledWith(3, {
      photo: secondPhoto,
    });
    expect(mockedPhoto).toHaveBeenNthCalledWith(4, {
      photo: thirdPhoto,
    });
  });

  it("preserves the order and identity of resolved photos", () => {
    const resolvedPhotos = [
      "featured-photo",
      "first-photo",
      "second-photo",
      "third-photo",
    ].map(
      (id) =>
        ({
          id,
          image: { src: `/resolved/${id}` },
        }) as unknown as ResolvedPhoto,
    );

    resolvedPhotos.forEach((photo) => {
      mockedPhoto.mockReturnValueOnce(photo);
    });

    const result = resolveJournalListingModuleAppRenderContext({
      content: createContent(),
    });

    expect(result.featured?.photos[0]).toBe(resolvedPhotos[0]);
    expect(result.entries[0]?.photos[0]).toBe(resolvedPhotos[1]);
    expect(result.entries[0]?.photos[1]).toBe(resolvedPhotos[2]);
    expect(result.entries[1]?.photos[0]).toBe(resolvedPhotos[3]);
  });

  it("preserves featured entry metadata", () => {
    const content = createContent();

    const result = resolveJournalListingModuleAppRenderContext({
      content,
    });

    expect(result.featured).toMatchObject({
      id: "featured-entry",
      title: "Featured journal",
    });
  });

  it("returns null for an absent featured entry", () => {
    const result = resolveJournalListingModuleAppRenderContext({
      content: createContent({ featured: null }),
    });

    expect(result.featured).toBeNull();
    expect(mockedPhoto).toHaveBeenCalledTimes(3);
  });

  it("preserves entry metadata", () => {
    const content = createContent();

    const result = resolveJournalListingModuleAppRenderContext({
      content,
    });

    expect(result.entries.map((entry) => entry.id)).toEqual([
      "first",
      "second",
    ]);
  });

  it("supports entries with no photos", () => {
    const result = resolveJournalListingModuleAppRenderContext({
      content: createContent({
        featured: null,
        entries: [createEntry("empty", [])],
      }),
    });

    expect(result.entries[0]?.photos).toEqual([]);
    expect(mockedPhoto).not.toHaveBeenCalled();
  });

  it("supports an empty listing", () => {
    const result = resolveJournalListingModuleAppRenderContext({
      content: createContent({
        featured: null,
        entries: [],
        pagination: null,
      }),
    });

    expect(result.featured).toBeNull();
    expect(result.entries).toEqual([]);
    expect(result.pagination).toBeNull();

    expect(mockedPhoto).not.toHaveBeenCalled();
    expect(mockedPagination).not.toHaveBeenCalled();
  });

  it("uses /journal as the base pagination path", () => {
    const content = createContent();

    resolveJournalListingModuleAppRenderContext({ content });

    expect(mockedPagination).toHaveBeenCalledTimes(1);
    expect(mockedPagination).toHaveBeenCalledWith({
      pagination: content.pagination,
      basePath: "/journal",
    });
  });

  it("uses the topic URL for a topic-filtered listing", () => {
    const content = createContent({
      topicId: "wildlife",
    });

    resolveJournalListingModuleAppRenderContext({ content });

    expect(mockedPagination).toHaveBeenCalledWith({
      pagination: content.pagination,
      basePath: "/topics/wildlife",
    });
  });

  it("does not resolve pagination when it is absent", () => {
    const result = resolveJournalListingModuleAppRenderContext({
      content: createContent({ pagination: null }),
    });

    expect(result.pagination).toBeNull();
    expect(mockedPagination).not.toHaveBeenCalled();
  });

  it("preserves the exact resolved pagination reference", () => {
    const result = resolveJournalListingModuleAppRenderContext({
      content: createContent(),
    });

    expect(result.pagination).toBe(resolvedPagination);
  });

  it("creates new featured, entries and photo collections", () => {
    const content = createContent();

    const result = resolveJournalListingModuleAppRenderContext({
      content,
    });

    expect(result).not.toBe(content);
    expect(result.featured).not.toBe(content.featured);
    expect(result.entries).not.toBe(content.entries);

    expect(result.entries[0]).not.toBe(content.entries[0]);
    expect(result.entries[0]?.photos).not.toBe(content.entries[0]?.photos);

    expect(result.featured?.photos).not.toBe(content.featured?.photos);
  });

  it("propagates photo resolver errors", () => {
    const error = new Error("Journal photo failed");

    mockedPhoto.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveJournalListingModuleAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);

    expect(mockedPagination).not.toHaveBeenCalled();
  });

  it("propagates pagination resolver errors", () => {
    const error = new Error("Pagination resolution failed");

    mockedPagination.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveJournalListingModuleAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);

    expect(mockedPhoto).toHaveBeenCalledTimes(4);
  });

  it("does not mutate the source listing", () => {
    const content = createContent();

    const originalEntries = content.entries;
    const originalFeatured = content.featured;
    const originalPagination = content.pagination;

    resolveJournalListingModuleAppRenderContext({ content });

    expect(content.entries).toBe(originalEntries);
    expect(content.featured).toBe(originalFeatured);
    expect(content.pagination).toBe(originalPagination);
  });
});
