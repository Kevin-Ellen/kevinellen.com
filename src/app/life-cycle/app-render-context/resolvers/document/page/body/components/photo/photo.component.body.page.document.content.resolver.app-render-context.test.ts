// src/app/life-cycle/app-render-context/resolvers/document/page/body/components/photo/photo.component.body.page.document.content.resolver.app-render-context.test.ts

import { resolvePhotoComponentContentAppRenderContext } from "./photo.component.body.page.document.content.resolver.app-render-context";

import { resolvePhotoAppRenderContext } from "../../../../../primitives/photo/photo.primitive.resolver.app-render-context";

jest.mock(
  "../../../../../primitives/photo/photo.primitive.resolver.app-render-context",
  () => ({
    resolvePhotoAppRenderContext: jest.fn(),
  }),
);

const mockedPhoto = jest.mocked(resolvePhotoAppRenderContext);

type Content = Parameters<
  typeof resolvePhotoComponentContentAppRenderContext
>[0]["content"];

type Photo = Content["photo"];
type ResolvedPhoto = ReturnType<typeof resolvePhotoAppRenderContext>;

describe("Photo component AppRenderContext resolver", () => {
  const photo = {
    id: "fox-001",
    title: "Red Fox",
    alt: "A fox in woodland",
    commentary: "Early morning encounter",
  } as unknown as Photo;

  const resolvedPhoto = {
    id: "fox-001",
    title: "Red Fox",
    alt: "Resolved alt text",
    commentary: "Resolved commentary",
    image: {
      id: "fox-001",
      src: "/media/photo/1200/800/fox-001",
      srcSet: "",
    },
  } as unknown as ResolvedPhoto;

  const createContent = (overrides: Record<string, unknown> = {}): Content =>
    ({
      kind: "photo",
      id: "featured-fox",
      photo,
      alt: "An authored description",
      commentary: "An authored field note",
      ...overrides,
    }) as unknown as Content;

  beforeEach(() => {
    jest.resetAllMocks();
    mockedPhoto.mockReturnValue(resolvedPhoto);
  });

  it("delegates photographic resolution to the photo primitive", () => {
    const content = createContent();

    resolvePhotoComponentContentAppRenderContext({ content });

    expect(mockedPhoto).toHaveBeenCalledTimes(1);
    expect(mockedPhoto).toHaveBeenCalledWith({
      photo,
      alt: "An authored description",
      commentary: "An authored field note",
    });
  });

  it("uses the exact resolved photo reference", () => {
    const result = resolvePhotoComponentContentAppRenderContext({
      content: createContent(),
    });

    expect(result.photo).toBe(resolvedPhoto);
  });

  it("preserves component properties other than photo overrides", () => {
    const content = createContent();

    const result = resolvePhotoComponentContentAppRenderContext({
      content,
    });

    expect(result).toEqual({
      kind: "photo",
      id: "featured-fox",
      photo: resolvedPhoto,
    });
  });

  it("does not expose alt or commentary at component level", () => {
    const result = resolvePhotoComponentContentAppRenderContext({
      content: createContent(),
    });

    expect(result).not.toHaveProperty("alt");
    expect(result).not.toHaveProperty("commentary");
  });

  it("forwards absent optional overrides as undefined", () => {
    const content = createContent({
      alt: undefined,
      commentary: undefined,
    });

    resolvePhotoComponentContentAppRenderContext({ content });

    expect(mockedPhoto).toHaveBeenCalledWith({
      photo,
      alt: undefined,
      commentary: undefined,
    });
  });

  it("preserves explicit null commentary", () => {
    const content = createContent({
      commentary: null,
    });

    resolvePhotoComponentContentAppRenderContext({ content });

    expect(mockedPhoto).toHaveBeenCalledWith({
      photo,
      alt: "An authored description",
      commentary: null,
    });
  });

  it("preserves empty string overrides", () => {
    const content = createContent({
      alt: "",
      commentary: "",
    });

    resolvePhotoComponentContentAppRenderContext({ content });

    expect(mockedPhoto).toHaveBeenCalledWith({
      photo,
      alt: "",
      commentary: "",
    });
  });

  it("propagates photo primitive errors", () => {
    const error = new Error("Photo resolution failed");

    mockedPhoto.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolvePhotoComponentContentAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);
  });

  it("does not mutate the original component", () => {
    const content = Object.freeze(createContent());

    const result = resolvePhotoComponentContentAppRenderContext({
      content,
    });

    expect(content.photo).toBe(photo);
    expect(content.alt).toBe("An authored description");
    expect(result).not.toBe(content);
  });
});
