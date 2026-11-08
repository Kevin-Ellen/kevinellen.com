// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/topic-explorer/topic-explorer.module.body.page.content.resolver.app-render-context.test.ts

import { resolveTopicExplorerModuleAppRenderContext } from "./topic-explorer.module.body.page.content.resolver.app-render-context";

import { resolveEditorialPhotoComponentContentAppRenderContext } from "../../components/editorial-photo/editorial-photo.component.body.page.document.content.resolver.app-render-context";

jest.mock(
  "../../components/editorial-photo/editorial-photo.component.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveEditorialPhotoComponentContentAppRenderContext: jest.fn(),
  }),
);

const mockedImage = jest.mocked(
  resolveEditorialPhotoComponentContentAppRenderContext,
);

type Content = Parameters<
  typeof resolveTopicExplorerModuleAppRenderContext
>[0]["content"];

type Featured = Content["featured"][number];
type Image = Featured["image"];
type ResolvedImage = ReturnType<
  typeof resolveEditorialPhotoComponentContentAppRenderContext
>;

describe("Topic explorer module AppRenderContext resolver", () => {
  const createImage = (src: string): Image => ({
    kind: "editorialPhoto",
    src,
    alt: "Wildlife photograph",
    width: 1200,
    height: 800,
  });

  const firstImage = createImage("/media/fox");
  const secondImage = createImage("/media/deer");

  const createFeatured = (id: string, image: Image): Featured =>
    ({
      id,
      label: id,
      href: `/topics/${id}`,
      image,
    }) as unknown as Featured;

  const createContent = (
    featured: Featured[] = [
      createFeatured("foxes", firstImage),
      createFeatured("deer", secondImage),
    ],
  ): Content =>
    ({
      kind: "topicExplorer",
      featured,
      links: [
        {
          id: "woodland",
          label: "Woodland",
          href: "/topics/woodland",
        },
      ],
    }) as unknown as Content;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedImage.mockImplementation(({ content }) => ({
      ...content,
    }));
  });

  it("resolves each featured topic image in order", () => {
    const content = createContent();

    resolveTopicExplorerModuleAppRenderContext({ content });

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
      description: "Fox",
    } as ResolvedImage;

    const second = {
      ...secondImage,
      description: "Deer",
    } as ResolvedImage;

    mockedImage.mockReturnValueOnce(first).mockReturnValueOnce(second);

    const result = resolveTopicExplorerModuleAppRenderContext({
      content: createContent(),
    });

    expect(result.featured[0]?.image).toBe(first);
    expect(result.featured[1]?.image).toBe(second);
  });

  it("preserves featured item metadata", () => {
    const content = createContent();

    const result = resolveTopicExplorerModuleAppRenderContext({
      content,
    });

    result.featured.forEach((item, index) => {
      expect(item).toEqual({
        ...content.featured[index],
        image: item.image,
      });
    });
  });

  it("preserves non-featured links by reference", () => {
    const content = createContent();

    const result = resolveTopicExplorerModuleAppRenderContext({
      content,
    });

    expect(result.links).toBe(content.links);
  });

  it("supports an empty featured collection", () => {
    const result = resolveTopicExplorerModuleAppRenderContext({
      content: createContent([]),
    });

    expect(result.featured).toEqual([]);
    expect(mockedImage).not.toHaveBeenCalled();
  });

  it("creates new module, featured array and featured items", () => {
    const content = createContent();

    const result = resolveTopicExplorerModuleAppRenderContext({
      content,
    });

    expect(result).not.toBe(content);
    expect(result.featured).not.toBe(content.featured);
    expect(result.featured[0]).not.toBe(content.featured[0]);
  });

  it("propagates image resolution errors", () => {
    const error = new Error("Featured topic image failed");

    mockedImage.mockImplementationOnce(() => {
      throw error;
    });

    expect(() =>
      resolveTopicExplorerModuleAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);

    expect(mockedImage).toHaveBeenCalledTimes(1);
  });

  it("does not mutate the source topic collection", () => {
    const content = createContent();
    const originalFeatured = content.featured;
    const originalImage = content.featured[0]?.image;

    resolveTopicExplorerModuleAppRenderContext({ content });

    expect(content.featured).toBe(originalFeatured);
    expect(content.featured[0]?.image).toBe(originalImage);
  });
});
