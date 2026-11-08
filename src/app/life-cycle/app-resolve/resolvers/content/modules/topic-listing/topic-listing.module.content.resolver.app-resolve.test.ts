// src/app/life-cycle/app-resolve/resolvers/content/modules/topic-listing/topic-listing.module.content.resolver.app-resolve.test.ts

import { resolveTopicListingModuleAppResolve } from "./topic-listing.module.content.resolver.app-resolve";
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

type Input = Parameters<typeof resolveTopicListingModuleAppResolve>[0];
type Content = Input["content"];
type Item = Content["items"][number];
type ResolvedImage = ReturnType<
  typeof resolveEditorialPhotoComponentContentAppResolve
>;

describe("Topic-listing module AppResolve resolver", () => {
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

  const createContent = (overrides: Record<string, unknown> = {}): Content =>
    ({
      kind: "topicListing",
      heading: "All topics",
      pageSize: 2,
      pagination: true,
      items: [
        createItem("wildlife"),
        createItem("essex"),
        createItem("travel"),
        createItem("forests"),
        createItem("wetlands"),
      ],
      ...overrides,
    }) as unknown as Content;

  const resolve = (content: Content = createContent(), requestedPage = 1) =>
    resolveTopicListingModuleAppResolve({
      content,
      requestedPage,
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedEditorialPhoto.mockImplementation(({ content }) => ({ ...content }));
  });

  it("returns the first page in authored order", () => {
    const result = resolve();

    expect(result.items.map((item) => item.id)).toEqual(["wildlife", "essex"]);

    expect(result.pagination).toEqual({
      currentPage: 1,
      totalPages: 3,
      totalItems: 5,
      pageSize: 2,
    });
  });

  it("returns the requested subsequent page", () => {
    const result = resolve(createContent(), 2);

    expect(result.items.map((item) => item.id)).toEqual(["travel", "forests"]);

    expect(result.pagination).toMatchObject({
      currentPage: 2,
      totalPages: 3,
    });
  });

  it("supports a partially filled final page", () => {
    const result = resolve(createContent(), 3);

    expect(result.items.map((item) => item.id)).toEqual(["wetlands"]);

    expect(mockedEditorialPhoto).toHaveBeenCalledTimes(1);
  });

  it("resolves only images belonging to the selected page", () => {
    const content = createContent();

    const result = resolve(content, 2);

    expect(mockedEditorialPhoto).toHaveBeenCalledTimes(2);

    expect(mockedEditorialPhoto).toHaveBeenNthCalledWith(1, {
      content: content.items[2]?.image,
    });

    expect(mockedEditorialPhoto).toHaveBeenNthCalledWith(2, {
      content: content.items[3]?.image,
    });

    expect(result.items).toHaveLength(2);
  });

  it("preserves resolved image references", () => {
    const image = {
      kind: "editorialPhoto",
      photoId: "resolved-image",
    } as unknown as ResolvedImage;

    mockedEditorialPhoto.mockReturnValue(image);

    const result = resolve();

    expect(result.items[0]?.image).toBe(image);
    expect(result.items[1]?.image).toBe(image);
  });

  it("preserves the remaining topic properties", () => {
    const content = createContent();

    const result = resolve(content);

    expect(result.items[0]).toMatchObject({
      id: "wildlife",
      label: "Topic wildlife",
      href: "/topics/wildlife",
    });

    expect(result.items[0]).not.toBe(content.items[0]);
  });

  it("omits pagination metadata when disabled", () => {
    const content = createContent({
      pagination: false,
    });

    const result = resolve(content);

    expect(result.pagination).toBeNull();
    expect(result.items).toHaveLength(2);
  });

  it("preserves the module presentation settings", () => {
    const content = createContent();

    const result = resolve(content);

    expect(result.kind).toBe(content.kind);
    expect(result.heading).toBe(content.heading);
    expect(result.pageSize).toBe(content.pageSize);
  });

  it("throws when the requested page is out of range", () => {
    expect(() => resolve(createContent(), 99)).toThrow(
      "Topic listing page 99 is out of range",
    );

    expect(mockedEditorialPhoto).not.toHaveBeenCalled();
  });

  it("supports a single-page listing", () => {
    const content = createContent({
      pageSize: 10,
    });

    const result = resolve(content);

    expect(result.items).toHaveLength(5);
    expect(result.pagination).toMatchObject({
      currentPage: 1,
      totalPages: 1,
      totalItems: 5,
      pageSize: 10,
    });
  });

  it("does not mutate the original topic collection", () => {
    const content = Object.freeze(createContent());

    const originalItems = content.items;
    const originalImage = content.items[0]?.image;

    resolve(content);

    expect(content.items).toBe(originalItems);
    expect(content.items[0]?.image).toBe(originalImage);
  });

  it("propagates editorial image resolution errors", () => {
    const error = new Error("Editorial image failed");

    mockedEditorialPhoto.mockImplementation(() => {
      throw error;
    });

    expect(() => resolve()).toThrow(error);
  });
});
