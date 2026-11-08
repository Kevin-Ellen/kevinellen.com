// src/app/life-cycle/app-resolve/resolvers/content/modules/journal-listing/journal-listing.module.content.resolver.app-resolve.test.ts

import { resolveJournalListingModuleAppResolve } from "./journal-listing.module.content.resolver.app-resolve";
import { resolvePhotoMetadataAppResolve } from "../../../primitives/photo-metadata/photo-metadata.primitive.resolver.app-resolve";

jest.mock(
  "../../../primitives/photo-metadata/photo-metadata.primitive.resolver.app-resolve",
  () => ({
    resolvePhotoMetadataAppResolve: jest.fn(),
  }),
);

const mockedPhoto = jest.mocked(resolvePhotoMetadataAppResolve);

type Input = Parameters<typeof resolveJournalListingModuleAppResolve>[0];
type Content = Input["content"];
type Ledger = Input["journalLedger"];
type Entry = Ledger["newestFirst"][number];
type Photo = Awaited<ReturnType<typeof resolvePhotoMetadataAppResolve>>;

describe("Journal-listing module AppResolve resolver", () => {
  const getPhoto = jest.fn<
    ReturnType<Input["getPhoto"]>,
    Parameters<Input["getPhoto"]>
  >();

  const createEntry = (
    id: string,
    topics: string[] = ["wildlife"],
    photos: string[] = [`photo-${id}`],
  ): Entry =>
    ({
      id,
      slug: `/journals/${id}`,
      title: `Journal ${id}`,
      topics,
      photos,
    }) as unknown as Entry;

  const createLedger = (
    entries: readonly Entry[] = [
      createEntry("one", ["wildlife", "essex"], ["one-a", "one-b"]),
      createEntry("two", ["travel"], ["two-a"]),
      createEntry("three", ["wildlife"], ["three-a"]),
      createEntry("four", ["travel"], ["four-a"]),
      createEntry("five", ["wildlife"], ["five-a"]),
    ],
  ): Ledger => ({
    newestFirst: entries,
    bySlug: {},
  });

  const createContent = (overrides: Record<string, unknown> = {}): Content =>
    ({
      kind: "journalListing",
      topicId: null,
      heading: { text: "Journals" },
      eyebrow: null,
      pageSize: 2,
      photoLimit: 2,
      displayFeatured: false,
      showViewAllLink: true,
      pagination: true,
      ...overrides,
    }) as unknown as Content;

  const resolve = (options: Partial<Input> = {}) =>
    resolveJournalListingModuleAppResolve({
      content: createContent(),
      journalLedger: createLedger(),
      getPhoto,
      requestedPage: 1,
      ...options,
    });

  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();

    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);

    mockedPhoto.mockImplementation(
      async ({ photoId }) =>
        ({
          id: photoId,
          alt: `Photo ${photoId}`,
        }) as unknown as Photo,
    );
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("selects the first page in newest-first order", async () => {
    const result = await resolve();

    expect(result.entries.map((entry) => entry.id)).toEqual(["one", "two"]);

    expect(result.featured).toBeNull();
    expect(result.displayFeatured).toBe(false);
  });

  it("selects the requested subsequent page", async () => {
    const result = await resolve({ requestedPage: 2 });

    expect(result.entries.map((entry) => entry.id)).toEqual(["three", "four"]);

    expect(result.pagination).toMatchObject({
      currentPage: 2,
      totalPages: 3,
      totalItems: 5,
      pageSize: 2,
    });
  });

  it("filters entries by topic before pagination", async () => {
    const result = await resolve({
      content: createContent({ topicId: "wildlife" }),
    });

    expect(result.entries.map((entry) => entry.id)).toEqual(["one", "three"]);

    expect(result.pagination).toMatchObject({
      totalItems: 3,
      totalPages: 2,
    });
  });

  it("returns the second page of filtered entries", async () => {
    const result = await resolve({
      content: createContent({ topicId: "wildlife" }),
      requestedPage: 2,
    });

    expect(result.entries.map((entry) => entry.id)).toEqual(["five"]);

    expect(result.topicId).toBe("wildlife");
  });

  it("uses only the first photo for ordinary listing entries", async () => {
    const result = await resolve();

    expect(result.entries[0]?.photos).toMatchObject([{ id: "one-a" }]);

    expect(mockedPhoto).toHaveBeenCalledTimes(2);
    expect(mockedPhoto).toHaveBeenNthCalledWith(1, {
      photoId: "one-a",
      getPhoto,
    });
    expect(mockedPhoto).toHaveBeenNthCalledWith(2, {
      photoId: "two-a",
      getPhoto,
    });
  });

  it("features the first entry on page one when enabled", async () => {
    const result = await resolve({
      content: createContent({ displayFeatured: true }),
    });

    expect(result.displayFeatured).toBe(true);
    expect(result.featured?.id).toBe("one");
    expect(result.entries.map((entry) => entry.id)).toEqual(["two"]);

    expect(result.featured?.photos).toMatchObject([
      { id: "one-a" },
      { id: "one-b" },
    ]);
  });

  it("respects the featured photo limit", async () => {
    const result = await resolve({
      content: createContent({
        displayFeatured: true,
        photoLimit: 1,
      }),
    });

    expect(result.featured?.photos).toHaveLength(1);
    expect(result.featured?.photos[0]).toMatchObject({
      id: "one-a",
    });
  });

  it("does not feature an entry on subsequent pages", async () => {
    const result = await resolve({
      content: createContent({ displayFeatured: true }),
      requestedPage: 2,
    });

    expect(result.displayFeatured).toBe(false);
    expect(result.featured).toBeNull();
    expect(result.entries.map((entry) => entry.id)).toEqual(["three", "four"]);
  });

  it("does not feature an entry when disabled", async () => {
    const result = await resolve({
      content: createContent({ displayFeatured: false }),
    });

    expect(result.featured).toBeNull();
    expect(result.entries).toHaveLength(2);
  });

  it("omits pagination metadata when disabled", async () => {
    const result = await resolve({
      content: createContent({ pagination: false }),
    });

    expect(result.pagination).toBeNull();
    expect(result.entries).toHaveLength(2);
  });

  it("preserves presentation settings", async () => {
    const content = createContent();

    const result = await resolve({ content });

    expect(result.kind).toBe(content.kind);
    expect(result.heading).toBe(content.heading);
    expect(result.eyebrow).toBe(content.eyebrow);
    expect(result.pageSize).toBe(content.pageSize);
    expect(result.showViewAllLink).toBe(content.showViewAllLink);
  });

  it("throws when a requested page is outside the available range", async () => {
    await expect(resolve({ requestedPage: 99 })).rejects.toThrow(
      "Journal listing page 99 is out of range",
    );

    expect(mockedPhoto).not.toHaveBeenCalled();
  });

  it("rejects an ordinary listing entry without photos", async () => {
    const journalLedger = createLedger([
      createEntry("no-photo", ["wildlife"], []),
    ]);

    await expect(resolve({ journalLedger })).rejects.toThrow(
      'Journal entry "/journals/no-photo" has no photos',
    );
  });

  it("allows a featured entry with no photos", async () => {
    const journalLedger = createLedger([
      createEntry("no-photo", ["wildlife"], []),
    ]);

    const result = await resolve({
      content: createContent({ displayFeatured: true }),
      journalLedger,
    });

    expect(result.featured?.id).toBe("no-photo");
    expect(result.featured?.photos).toEqual([]);
    expect(result.entries).toEqual([]);
  });

  it("propagates failures while resolving listing photos", async () => {
    const error = new Error("KV photo unavailable");
    mockedPhoto.mockRejectedValue(error);

    await expect(resolve()).rejects.toThrow(error);
  });

  it("propagates failures while resolving featured photos", async () => {
    const error = new Error("Featured photo unavailable");
    mockedPhoto.mockRejectedValue(error);

    await expect(
      resolve({
        content: createContent({ displayFeatured: true }),
      }),
    ).rejects.toThrow(error);
  });

  it("does not mutate ledger entries", async () => {
    const journalLedger = createLedger();
    const originalPhotos = journalLedger.newestFirst[0]?.photos;

    await resolve({ journalLedger });

    expect(journalLedger.newestFirst[0]?.photos).toBe(originalPhotos);
    expect(journalLedger.newestFirst[0]?.photos).toEqual(["one-a", "one-b"]);
  });

  it("handles an empty featured listing", async () => {
    const result = await resolve({
      content: createContent({
        displayFeatured: true,
        topicId: "wildlife",
      }),
      journalLedger: createLedger([]),
    });

    expect(result.displayFeatured).toBe(true);
    expect(result.featured).toBeNull();
    expect(result.entries).toEqual([]);
    expect(mockedPhoto).not.toHaveBeenCalled();
  });
});
