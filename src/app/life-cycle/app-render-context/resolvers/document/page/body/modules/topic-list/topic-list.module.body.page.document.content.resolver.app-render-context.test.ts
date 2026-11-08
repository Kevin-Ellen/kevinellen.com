// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/topic-list/topic-list.module.body.page.document.content.resolver.app-render-context.test.ts

import { resolveTopicListingModuleAppRenderContext } from "./topic-list.module.body.page.document.content.resolver.app-render-context";

import { resolveEditorialPhotoComponentContentAppRenderContext } from "../../components/editorial-photo/editorial-photo.component.body.page.document.content.resolver.app-render-context";
import { resolvePaginationAppRenderContext } from "../../../../../primitives/pagination/pagination.primitive.resolver.app-render-context";

jest.mock(
  "../../components/editorial-photo/editorial-photo.component.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveEditorialPhotoComponentContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "../../../../../primitives/pagination/pagination.primitive.resolver.app-render-context",
  () => ({
    resolvePaginationAppRenderContext: jest.fn(),
  }),
);

const mockedImage = jest.mocked(
  resolveEditorialPhotoComponentContentAppRenderContext,
);
const mockedPagination = jest.mocked(resolvePaginationAppRenderContext);

type Content = Parameters<
  typeof resolveTopicListingModuleAppRenderContext
>[0]["content"];

type Item = Content["items"][number];
type Image = Item["image"];
type ResolvedImage = ReturnType<
  typeof resolveEditorialPhotoComponentContentAppRenderContext
>;
type ResolvedPagination = ReturnType<typeof resolvePaginationAppRenderContext>;

describe("Topic listing module AppRenderContext resolver", () => {
  const createImage = (id: string): Image => ({
    kind: "editorialPhoto",
    src: `/media/${id}`,
    alt: id,
    width: 1200,
    height: 800,
  });

  const firstImage = createImage("foxes");
  const secondImage = createImage("deer");

  const createItem = (id: string, image: Image): Item =>
    ({
      id,
      label: id,
      href: `/topics/${id}`,
      image,
    }) as unknown as Item;

  const createContent = (overrides: Partial<Content> = {}): Content =>
    ({
      kind: "topicListing",
      items: [createItem("foxes", firstImage), createItem("deer", secondImage)],
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
    next: "/topics/page-2",
    pages: [],
  } as ResolvedPagination;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedImage.mockImplementation(({ content }) => ({
      ...content,
    }));

    mockedPagination.mockReturnValue(resolvedPagination);
  });

  it("resolves every topic image in order", () => {
    const content = createContent();

    resolveTopicListingModuleAppRenderContext({ content });

    expect(mockedImage).toHaveBeenCalledTimes(2);
    expect(mockedImage).toHaveBeenNthCalledWith(1, {
      content: firstImage,
    });
    expect(mockedImage).toHaveBeenNthCalledWith(2, {
      content: secondImage,
    });
  });

  it("preserves exact resolved image references", () => {
    const first = {
      ...firstImage,
      description: "Foxes",
    } as ResolvedImage;

    const second = {
      ...secondImage,
      description: "Deer",
    } as ResolvedImage;

    mockedImage.mockReturnValueOnce(first).mockReturnValueOnce(second);

    const result = resolveTopicListingModuleAppRenderContext({
      content: createContent(),
    });

    expect(result.items[0]?.image).toBe(first);
    expect(result.items[1]?.image).toBe(second);
  });

  it("preserves topic item metadata", () => {
    const content = createContent();

    const result = resolveTopicListingModuleAppRenderContext({
      content,
    });

    result.items.forEach((item, index) => {
      expect(item).toEqual({
        ...content.items[index],
        image: item.image,
      });
    });
  });

  it("resolves pagination with the topics base path", () => {
    const content = createContent();

    resolveTopicListingModuleAppRenderContext({ content });

    expect(mockedPagination).toHaveBeenCalledTimes(1);
    expect(mockedPagination).toHaveBeenCalledWith({
      pagination: content.pagination,
      basePath: "/topics",
    });
  });

  it("preserves the resolved pagination reference", () => {
    const result = resolveTopicListingModuleAppRenderContext({
      content: createContent(),
    });

    expect(result.pagination).toBe(resolvedPagination);
  });

  it("returns null when pagination is absent", () => {
    const result = resolveTopicListingModuleAppRenderContext({
      content: createContent({ pagination: null }),
    });

    expect(result.pagination).toBeNull();
    expect(mockedPagination).not.toHaveBeenCalled();
  });

  it("supports an empty topic collection", () => {
    const result = resolveTopicListingModuleAppRenderContext({
      content: createContent({
        items: [],
        pagination: null,
      }),
    });

    expect(result.items).toEqual([]);
    expect(result.pagination).toBeNull();
    expect(mockedImage).not.toHaveBeenCalled();
  });

  it("creates new module, items and item objects", () => {
    const content = createContent();

    const result = resolveTopicListingModuleAppRenderContext({
      content,
    });

    expect(result).not.toBe(content);
    expect(result.items).not.toBe(content.items);
    expect(result.items[0]).not.toBe(content.items[0]);
  });

  it("propagates image resolution errors", () => {
    const error = new Error("Topic image failed");

    mockedImage.mockImplementationOnce(() => {
      throw error;
    });

    expect(() =>
      resolveTopicListingModuleAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);

    expect(mockedPagination).not.toHaveBeenCalled();
  });

  it("propagates pagination resolution errors", () => {
    const error = new Error("Topic pagination failed");

    mockedPagination.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveTopicListingModuleAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);

    expect(mockedImage).toHaveBeenCalledTimes(2);
  });

  it("does not mutate the original topic collection", () => {
    const content = createContent();
    const originalItems = content.items;
    const originalPagination = content.pagination;

    resolveTopicListingModuleAppRenderContext({ content });

    expect(content.items).toBe(originalItems);
    expect(content.pagination).toBe(originalPagination);
  });
});
