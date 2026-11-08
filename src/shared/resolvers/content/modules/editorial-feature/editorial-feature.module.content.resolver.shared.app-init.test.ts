// src/shared/resolvers/content/modules/editorial-feature/editorial-feature.module.content.resolver.shared.app-init.test.ts

import { resolveComponentContentAppInit } from "../../components/component.content.resolver.shared.app-init";
import { resolveEditorialPhotoComponentContentAppInit } from "../../components/editorial-photo/editorial-photo.component.content.resolver.shared.app-init";

import { resolveEditorialFeatureModuleContentAppInit } from "./editorial-feature.module.content.resolver.shared.app-init";

jest.mock(
  "../../components/component.content.resolver.shared.app-init",
  () => ({
    resolveComponentContentAppInit: jest.fn(),
  }),
);

jest.mock(
  "../../components/editorial-photo/editorial-photo.component.content.resolver.shared.app-init",
  () => ({
    resolveEditorialPhotoComponentContentAppInit: jest.fn(),
  }),
);

const mockedComponentResolver = jest.mocked(resolveComponentContentAppInit);

const mockedPhotoResolver = jest.mocked(
  resolveEditorialPhotoComponentContentAppInit,
);

type Input = Parameters<typeof resolveEditorialFeatureModuleContentAppInit>[0];

type Authored = Input["authored"];
type Component = Authored["components"][number];

describe("Editorial feature module AppInit resolver", () => {
  const svgAssets = {} as Input["svgAssets"];
  const socialProfiles = {} as Input["socialProfiles"];

  const createComponent = (id: string): Component =>
    ({
      kind: "paragraph",
      id,
      content: [],
    }) as unknown as Component;

  const createAuthored = (
    components: readonly Component[] = [],
    overrides: Partial<Authored> = {},
  ): Authored =>
    ({
      kind: "editorialFeature",
      media: {
        kind: "editorialPhoto",
        src: "/images/forest.jpg",
        alt: "Forest landscape",
        width: 1600,
        height: 1067,
      },
      components,
      ...overrides,
    }) as unknown as Authored;

  const resolve = (authored: Authored) =>
    resolveEditorialFeatureModuleContentAppInit({
      authored,
      svgAssets,
      socialProfiles,
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedComponentResolver.mockImplementation(
      ({ authored }) =>
        ({ ...authored }) as ReturnType<typeof resolveComponentContentAppInit>,
    );

    mockedPhotoResolver.mockImplementation(({ authored }) => ({ ...authored }));
  });

  it("resolves editorial feature media", () => {
    const authored = createAuthored();

    const result = resolve(authored);

    expect(mockedPhotoResolver).toHaveBeenCalledWith({
      authored: authored.media,
    });

    expect(result.media).toEqual(authored.media);
  });

  it("preserves resolved media references", () => {
    const resolvedMedia = {
      kind: "editorialPhoto",
      src: "/images/resolved.jpg",
      alt: "Resolved editorial photograph",
      width: 1200,
      height: 800,
    } as ReturnType<typeof resolveEditorialPhotoComponentContentAppInit>;

    mockedPhotoResolver.mockReturnValue(resolvedMedia);

    const result = resolve(createAuthored());

    expect(result.media).toBe(resolvedMedia);
  });

  it("handles an empty components array", () => {
    const result = resolve(createAuthored());

    expect(result.components).toEqual([]);
    expect(mockedComponentResolver).not.toHaveBeenCalled();
    expect(mockedPhotoResolver).toHaveBeenCalledTimes(1);
  });

  it("resolves a single component", () => {
    const component = createComponent("introduction");

    resolve(createAuthored([component]));

    expect(mockedComponentResolver).toHaveBeenCalledWith({
      authored: component,
      svgAssets,
      socialProfiles,
    });
  });

  it("resolves multiple components in order", () => {
    const components = [
      createComponent("first"),
      createComponent("second"),
      createComponent("third"),
    ];

    resolve(createAuthored(components));

    expect(mockedComponentResolver).toHaveBeenCalledTimes(3);

    components.forEach((component, index) => {
      expect(mockedComponentResolver).toHaveBeenNthCalledWith(index + 1, {
        authored: component,
        svgAssets,
        socialProfiles,
      });
    });
  });

  it("preserves resolved component references", () => {
    type Resolved = ReturnType<typeof resolveComponentContentAppInit>;

    const first = {
      kind: "paragraph",
      content: [],
    } as Resolved;

    const second = {
      kind: "paragraph",
      content: [],
    } as Resolved;

    mockedComponentResolver
      .mockReturnValueOnce(first)
      .mockReturnValueOnce(second);

    const result = resolve(
      createAuthored([createComponent("first"), createComponent("second")]),
    );

    expect(result.components[0]).toBe(first);
    expect(result.components[1]).toBe(second);
  });

  it("resolves components before media", () => {
    resolve(createAuthored([createComponent("first")]));

    expect(mockedComponentResolver.mock.invocationCallOrder[0]).toBeLessThan(
      mockedPhotoResolver.mock.invocationCallOrder[0],
    );
  });

  it("preserves unrelated editorial properties", () => {
    const authored = {
      ...createAuthored(),
      identifier: "featured-story",
    };

    const result = resolve(authored);

    expect((result as typeof result & { identifier: string }).identifier).toBe(
      "featured-story",
    );
  });

  it("does not mutate authored content", () => {
    const component = createComponent("first");
    const authored = createAuthored([component]);

    const original = {
      ...authored,
      components: [...authored.components],
    };

    resolve(authored);

    expect(authored).toEqual(original);
    expect(authored.components[0]).toBe(component);
  });

  it("creates new module and component arrays", () => {
    const authored = createAuthored([createComponent("first")]);

    const result = resolve(authored);

    expect(result).not.toBe(authored);
    expect(result.components).not.toBe(authored.components);
    expect(result.components[0]).not.toBe(authored.components[0]);
  });

  it("propagates component resolution failures", () => {
    const error = new Error("Component resolution failed");

    mockedComponentResolver.mockImplementation(() => {
      throw error;
    });

    expect(() => resolve(createAuthored([createComponent("first")]))).toThrow(
      error,
    );

    expect(mockedPhotoResolver).not.toHaveBeenCalled();
  });

  it("propagates media resolution failures", () => {
    const error = new Error("Media resolution failed");

    mockedPhotoResolver.mockImplementation(() => {
      throw error;
    });

    expect(() => resolve(createAuthored())).toThrow(error);
  });

  it("stops processing after a component failure", () => {
    mockedComponentResolver.mockImplementation(() => {
      throw new Error("Resolution stopped");
    });

    expect(() =>
      resolve(
        createAuthored([createComponent("first"), createComponent("second")]),
      ),
    ).toThrow("Resolution stopped");

    expect(mockedComponentResolver).toHaveBeenCalledTimes(1);
    expect(mockedPhotoResolver).not.toHaveBeenCalled();
  });
});
