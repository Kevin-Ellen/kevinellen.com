// src/shared/resolvers/content/components/component.content.resolver.shared.app-init.test.ts

import { resolveParagraphComponentContentAppInit } from "./paragraph/paragraph.component.content.resolver.shared.app-init";
import { resolveListComponentContentAppInit } from "./list/list.component.content.resolver.shared.app-init";
import { resolvePhotoComponentContentAppInit } from "./photo/photo.component.content.resolver.shared.app-init";
import { resolveEditorialPhotoComponentContentAppInit } from "./editorial-photo/editorial-photo.component.content.resolver.shared.app-init";
import { resolveRichListComponentContentAppInit } from "./rich-list/rich-list.component.content.resolver.shared.app-init";

import { resolveComponentContentAppInit } from "./component.content.resolver.shared.app-init";

jest.mock(
  "./paragraph/paragraph.component.content.resolver.shared.app-init",
  () => ({
    resolveParagraphComponentContentAppInit: jest.fn(),
  }),
);

jest.mock("./list/list.component.content.resolver.shared.app-init", () => ({
  resolveListComponentContentAppInit: jest.fn(),
}));

jest.mock("./photo/photo.component.content.resolver.shared.app-init", () => ({
  resolvePhotoComponentContentAppInit: jest.fn(),
}));

jest.mock(
  "./editorial-photo/editorial-photo.component.content.resolver.shared.app-init",
  () => ({
    resolveEditorialPhotoComponentContentAppInit: jest.fn(),
  }),
);

jest.mock(
  "./rich-list/rich-list.component.content.resolver.shared.app-init",
  () => ({
    resolveRichListComponentContentAppInit: jest.fn(),
  }),
);

const mockedParagraph = jest.mocked(resolveParagraphComponentContentAppInit);

const mockedList = jest.mocked(resolveListComponentContentAppInit);

const mockedPhoto = jest.mocked(resolvePhotoComponentContentAppInit);

const mockedEditorialPhoto = jest.mocked(
  resolveEditorialPhotoComponentContentAppInit,
);

const mockedRichList = jest.mocked(resolveRichListComponentContentAppInit);

type Input = Parameters<typeof resolveComponentContentAppInit>[0];
type Component = Input["authored"];
type ResolvedComponent = ReturnType<typeof resolveComponentContentAppInit>;

describe("Component content AppInit resolver", () => {
  const svgAssets = {} as Input["svgAssets"];
  const socialProfiles = {} as Input["socialProfiles"];

  const createComponent = (kind: Component["kind"]): Component =>
    ({
      kind,
    }) as Component;

  const resolve = (authored: Component) =>
    resolveComponentContentAppInit({
      authored,
      svgAssets,
      socialProfiles,
    });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("dispatches paragraph components", () => {
    const authored = createComponent("paragraph");

    const resolved = {
      kind: "paragraph",
      content: [],
    } as ResolvedComponent;

    mockedParagraph.mockReturnValue(
      resolved as ReturnType<typeof resolveParagraphComponentContentAppInit>,
    );

    expect(resolve(authored)).toBe(resolved);

    expect(mockedParagraph).toHaveBeenCalledWith({
      authored,
      svgAssets,
      socialProfiles,
    });
  });

  it("dispatches list components", () => {
    const authored = createComponent("list");

    const resolved = {
      kind: "list",
      items: [],
    } as ResolvedComponent;

    mockedList.mockReturnValue(
      resolved as ReturnType<typeof resolveListComponentContentAppInit>,
    );

    expect(resolve(authored)).toBe(resolved);

    expect(mockedList).toHaveBeenCalledWith({
      authored,
      svgAssets,
      socialProfiles,
    });
  });

  it("dispatches photo components without extra dependencies", () => {
    const authored = createComponent("photo");

    const resolved = {
      kind: "photo",
      photoId: "forest-fox",
    } as ResolvedComponent;

    mockedPhoto.mockReturnValue(
      resolved as ReturnType<typeof resolvePhotoComponentContentAppInit>,
    );

    expect(resolve(authored)).toBe(resolved);

    expect(mockedPhoto).toHaveBeenCalledWith({
      authored,
    });
  });

  it("dispatches editorial photo components", () => {
    const authored = createComponent("editorialPhoto");

    const resolved = {
      kind: "editorialPhoto",
      src: "/images/forest-fox.jpg",
      alt: "A red fox in Epping Forest",
      width: 1600,
      height: 1067,
    } as ResolvedComponent;

    mockedEditorialPhoto.mockReturnValue(
      resolved as ReturnType<
        typeof resolveEditorialPhotoComponentContentAppInit
      >,
    );

    expect(resolve(authored)).toBe(resolved);

    expect(mockedEditorialPhoto).toHaveBeenCalledWith(
      expect.objectContaining({
        authored,
      }),
    );
  });

  it("dispatches rich list components", () => {
    const authored = createComponent("richList");

    const resolved = {
      kind: "richList",
      items: [],
    } as ResolvedComponent;

    mockedRichList.mockReturnValue(
      resolved as ReturnType<typeof resolveRichListComponentContentAppInit>,
    );

    expect(resolve(authored)).toBe(resolved);

    expect(mockedRichList).toHaveBeenCalledWith(
      expect.objectContaining({
        authored,
        svgAssets,
      }),
    );
  });

  it("calls exactly one resolver per component", () => {
    const resolvers = [
      mockedParagraph,
      mockedList,
      mockedPhoto,
      mockedEditorialPhoto,
      mockedRichList,
    ];

    const kinds: Component["kind"][] = [
      "paragraph",
      "list",
      "photo",
      "editorialPhoto",
      "richList",
    ];

    kinds.forEach((kind, index) => {
      jest.clearAllMocks();

      resolve(createComponent(kind));

      resolvers.forEach((resolver, resolverIndex) => {
        expect(resolver).toHaveBeenCalledTimes(resolverIndex === index ? 1 : 0);
      });
    });
  });

  it("propagates paragraph resolution failures", () => {
    const error = new Error("Paragraph resolution failed");

    mockedParagraph.mockImplementation(() => {
      throw error;
    });

    expect(() => resolve(createComponent("paragraph"))).toThrow(error);
  });

  it("propagates list resolution failures", () => {
    const error = new Error("List resolution failed");

    mockedList.mockImplementation(() => {
      throw error;
    });

    expect(() => resolve(createComponent("list"))).toThrow(error);
  });

  it("propagates photo resolution failures", () => {
    const error = new Error("Photo resolution failed");

    mockedPhoto.mockImplementation(() => {
      throw error;
    });

    expect(() => resolve(createComponent("photo"))).toThrow(error);
  });

  it("propagates editorial photo resolution failures", () => {
    const error = new Error("Editorial photo resolution failed");

    mockedEditorialPhoto.mockImplementation(() => {
      throw error;
    });

    expect(() => resolve(createComponent("editorialPhoto"))).toThrow(error);
  });

  it("propagates rich list resolution failures", () => {
    const error = new Error("Rich list resolution failed");

    mockedRichList.mockImplementation(() => {
      throw error;
    });

    expect(() => resolve(createComponent("richList"))).toThrow(error);
  });
});
