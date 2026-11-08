// src/app/life-cycle/app-resolve/resolvers/content/modules/topic-explorer/topic-explorer.module.content.resolver.app-resolve.test.ts

import { resolveTopicExplorerModuleAppResolve } from "./topic-explorer.module.content.resolver.app-resolve";
import { resolveEditorialPhotoComponentContentAppResolve } from "../../components/editorial-photo/editorial-photo.component.content.resolver.app-resolve";

jest.mock(
  "../../components/editorial-photo/editorial-photo.component.content.resolver.app-resolve",
  () => ({
    resolveEditorialPhotoComponentContentAppResolve: jest.fn(),
  }),
);

const mockedEditorialPhoto = jest.mocked(
  resolveEditorialPhotoComponentContentAppResolve,
);

type Input = Parameters<typeof resolveTopicExplorerModuleAppResolve>[0];
type Content = Input["content"];
type Item = Content["unrankedItems"][number];
type Entry = Input["journalLedger"]["newestFirst"][number];
type TopicId = Item["id"];
type ResolvedImage = ReturnType<
  typeof resolveEditorialPhotoComponentContentAppResolve
>;

describe("Topic-explorer module AppResolve resolver", () => {
  const createItem = (id: string): Item =>
    ({
      id,
      label: `Topic ${id}`,
      href: `/topics/${id}`,
      image: {
        kind: "editorialPhoto",
        photoId: `image-${id}`,
      },
    }) as unknown as Item;

  const createEntry = (id: string, topics: readonly string[]): Entry =>
    ({
      id,
      topics: topics as unknown as Entry["topics"],
    }) as unknown as Entry;

  const createContent = (overrides: Record<string, unknown> = {}): Content =>
    ({
      kind: "topicExplorer",
      heading: "Explore topics",
      maxFeatured: 2,
      unrankedItems: [
        createItem("wildlife"),
        createItem("travel"),
        createItem("essex"),
        createItem("unused"),
      ],
      ...overrides,
    }) as unknown as Content;

  const createLedger = (
    entries: readonly Entry[] = [
      createEntry("one", ["wildlife", "essex"]),
      createEntry("two", ["wildlife", "travel"]),
      createEntry("three", ["wildlife"]),
      createEntry("four", ["travel"]),
      createEntry("five", ["essex"]),
    ],
  ): Input["journalLedger"] => ({
    newestFirst: entries,
    bySlug: {},
  });

  const resolve = (overrides: Partial<Input> = {}) =>
    resolveTopicExplorerModuleAppResolve({
      content: createContent(),
      journalLedger: createLedger(),
      ...overrides,
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedEditorialPhoto.mockImplementation(({ content }) => ({ ...content }));
  });

  it("ranks topics by their journal entry count", () => {
    const result = resolve();

    expect(result.featured.map((item) => item.id)).toEqual([
      "wildlife",
      "essex",
    ]);

    expect(result.links.map((item) => item.id)).toEqual(["travel"]);
  });

  it("uses alphabetical ID ordering when counts are equal", () => {
    const result = resolve({
      content: createContent({ maxFeatured: 3 }),
    });

    expect(result.featured.map((item) => item.id)).toEqual([
      "wildlife",
      "essex",
      "travel",
    ]);
  });

  it("counts each topic only once per journal entry", () => {
    const result = resolve({
      journalLedger: createLedger([
        createEntry("one", ["travel", "travel", "travel"]),
        createEntry("two", ["wildlife"]),
        createEntry("three", ["wildlife"]),
      ]),
    });

    expect(result.featured.map((item) => item.id)).toEqual([
      "wildlife",
      "travel",
    ]);
  });

  it("excludes topics without published journal entries", () => {
    const result = resolve();

    expect([
      ...result.featured.map((item) => item.id),
      ...result.links.map((item) => item.id),
    ]).not.toContain("unused");
  });

  it("limits featured topics to maxFeatured", () => {
    const result = resolve({
      content: createContent({ maxFeatured: 1 }),
    });

    expect(result.featured.map((item) => item.id)).toEqual(["wildlife"]);

    expect(result.links.map((item) => item.id)).toEqual(["essex", "travel"]);
  });

  it("supports zero featured topics", () => {
    const result = resolve({
      content: createContent({ maxFeatured: 0 }),
    });

    expect(result.featured).toEqual([]);
    expect(result.links.map((item) => item.id)).toEqual([
      "wildlife",
      "essex",
      "travel",
    ]);

    expect(mockedEditorialPhoto).not.toHaveBeenCalled();
  });

  it("supports a featured limit exceeding the topic count", () => {
    const result = resolve({
      content: createContent({ maxFeatured: 10 }),
    });

    expect(result.featured).toHaveLength(3);
    expect(result.links).toEqual([]);
    expect(mockedEditorialPhoto).toHaveBeenCalledTimes(3);
  });

  it("resolves an image for every featured topic", () => {
    const content = createContent();
    const result = resolve({ content });

    expect(mockedEditorialPhoto).toHaveBeenCalledTimes(2);

    const wildlife = content.unrankedItems.find(
      (item) => item.id === ("wildlife" as TopicId),
    );
    const essex = content.unrankedItems.find(
      (item) => item.id === ("essex" as TopicId),
    );

    expect(mockedEditorialPhoto).toHaveBeenNthCalledWith(1, {
      content: wildlife?.image,
    });

    expect(mockedEditorialPhoto).toHaveBeenNthCalledWith(2, {
      content: essex?.image,
    });

    expect(result.featured).toHaveLength(2);
  });

  it("preserves the returned featured image reference", () => {
    const image = {
      kind: "editorialPhoto",
      photoId: "resolved",
    } as unknown as ResolvedImage;

    mockedEditorialPhoto.mockReturnValue(image);

    const result = resolve();

    expect(result.featured[0]?.image).toBe(image);
  });

  it("creates lightweight links for non-featured topics", () => {
    const result = resolve();

    expect(result.links).toEqual([
      {
        id: "travel",
        label: "Topic travel",
        href: "/topics/travel",
      },
    ]);

    expect(result.links[0]).not.toHaveProperty("image");
  });

  it("supports an empty published ledger", () => {
    const result = resolve({
      journalLedger: createLedger([]),
    });

    expect(result.featured).toEqual([]);
    expect(result.links).toEqual([]);
    expect(mockedEditorialPhoto).not.toHaveBeenCalled();
  });

  it("supports no configured topics", () => {
    const result = resolve({
      content: createContent({ unrankedItems: [] }),
    });

    expect(result.featured).toEqual([]);
    expect(result.links).toEqual([]);
  });

  it("preserves configuration without exposing unrankedItems", () => {
    const content = createContent();
    const result = resolve({ content });

    expect(result.kind).toBe(content.kind);
    expect(result).not.toHaveProperty("unrankedItems");
    expect(result).toHaveProperty("featured");
    expect(result).toHaveProperty("links");
  });

  it("does not mutate configured items or ledger entries", () => {
    const content = createContent();
    const journalLedger = createLedger();

    const originalItems = content.unrankedItems;
    const originalEntries = journalLedger.newestFirst;

    resolve({ content, journalLedger });

    expect(content.unrankedItems).toBe(originalItems);
    expect(journalLedger.newestFirst).toBe(originalEntries);
    expect(content.unrankedItems[0]?.id).toBe("wildlife");
  });

  it("propagates featured image resolution failures", () => {
    const error = new Error("Invalid editorial photo");

    mockedEditorialPhoto.mockImplementation(() => {
      throw error;
    });

    expect(() => resolve()).toThrow(error);
  });
});
