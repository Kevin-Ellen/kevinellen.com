// src/shared/resolvers/content/modules/editorial-split/editorial-split.module.content.resolver.shared.app-init.test.ts

import { resolveComponentContentAppInit } from "../../components/component.content.resolver.shared.app-init";

import { resolveEditorialSplitModuleContentAppInit } from "./editorial-split.module.content.resolver.shared.app-init";

jest.mock(
  "../../components/component.content.resolver.shared.app-init",
  () => ({
    resolveComponentContentAppInit: jest.fn(),
  }),
);

const mockedComponentResolver = jest.mocked(resolveComponentContentAppInit);

type Input = Parameters<typeof resolveEditorialSplitModuleContentAppInit>[0];
type Authored = Input["authored"];
type Component = Authored["components"][number];
type ResolvedComponent = ReturnType<typeof resolveComponentContentAppInit>;

describe("Editorial split module AppInit resolver", () => {
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
      kind: "editorialSplit",
      components,
      media: {
        kind: "photo",
        photoId: "forest-fox",
      },
      ...overrides,
    }) as unknown as Authored;

  const resolve = (authored: Authored) =>
    resolveEditorialSplitModuleContentAppInit({
      authored,
      svgAssets,
      socialProfiles,
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedComponentResolver.mockImplementation(
      ({ authored }) => ({ ...authored }) as ResolvedComponent,
    );
  });

  describe("Component resolution", () => {
    it("returns an empty components array when none exist", () => {
      const result = resolve(createAuthored());

      expect(result.components).toEqual([]);
      expect(mockedComponentResolver).toHaveBeenCalledTimes(1);
    });

    it("resolves a single component", () => {
      const component = createComponent("intro");
      const authored = createAuthored([component]);

      const result = resolve(authored);

      expect(mockedComponentResolver).toHaveBeenCalledWith({
        authored: component,
        svgAssets,
        socialProfiles,
      });

      expect(result.components).toHaveLength(1);
    });

    it("resolves multiple components in authored order", () => {
      const components = [
        createComponent("first"),
        createComponent("second"),
        createComponent("third"),
      ];

      const authored = createAuthored(components);

      resolve(authored);

      expect(mockedComponentResolver).toHaveBeenCalledTimes(4);

      components.forEach((component, index) => {
        expect(mockedComponentResolver).toHaveBeenNthCalledWith(index + 1, {
          authored: component,
          svgAssets,
          socialProfiles,
        });
      });

      expect(mockedComponentResolver).toHaveBeenNthCalledWith(4, {
        authored: authored.media,
        svgAssets,
        socialProfiles,
      });
    });

    it("preserves resolved component references", () => {
      const first = {
        kind: "paragraph",
        content: [],
      } as ResolvedComponent;

      const second = {
        kind: "paragraph",
        content: [],
      } as ResolvedComponent;

      const media = {
        kind: "photo",
        photoId: "resolved-photo",
      } as unknown as ResolvedComponent;

      mockedComponentResolver
        .mockReturnValueOnce(first)
        .mockReturnValueOnce(second)
        .mockReturnValueOnce(media);

      const result = resolve(
        createAuthored([createComponent("first"), createComponent("second")]),
      );

      expect(result.components[0]).toBe(first);
      expect(result.components[1]).toBe(second);
      expect(result.media).toBe(media);
    });
  });

  describe("Media resolution", () => {
    it("resolves media using the shared component resolver", () => {
      const authored = createAuthored();

      resolve(authored);

      expect(mockedComponentResolver).toHaveBeenCalledWith({
        authored: authored.media,
        svgAssets,
        socialProfiles,
      });
    });

    it("resolves components before media", () => {
      const authored = createAuthored([createComponent("intro")]);

      resolve(authored);

      expect(mockedComponentResolver.mock.calls[0]?.[0].authored).toBe(
        authored.components[0],
      );

      expect(mockedComponentResolver.mock.calls[1]?.[0].authored).toBe(
        authored.media,
      );
    });

    it("preserves the resolved media reference", () => {
      const media = {
        kind: "photo",
        photoId: "resolved-photo",
      } as unknown as ResolvedComponent;

      mockedComponentResolver.mockReturnValue(media);

      const result = resolve(createAuthored());

      expect(result.media).toBe(media);
    });
  });

  describe("Data integrity", () => {
    it("preserves unrelated module properties", () => {
      const authored = {
        ...createAuthored(),
        identifier: "editorial-split",
      };

      const result = resolve(authored);

      expect(
        (result as typeof result & { identifier: string }).identifier,
      ).toBe("editorial-split");
    });

    it("does not mutate authored components or media", () => {
      const component = createComponent("intro");
      const authored = createAuthored([component]);

      const original = {
        ...authored,
        components: [...authored.components],
      };

      resolve(authored);

      expect(authored).toEqual(original);
      expect(authored.components[0]).toBe(component);
    });

    it("creates a new module and components array", () => {
      const authored = createAuthored([createComponent("intro")]);

      const result = resolve(authored);

      expect(result).not.toBe(authored);
      expect(result.components).not.toBe(authored.components);
      expect(result.components[0]).not.toBe(authored.components[0]);
    });
  });

  describe("Failure propagation", () => {
    it("propagates component resolution failures", () => {
      const error = new Error("Component resolution failed");

      mockedComponentResolver.mockImplementation(() => {
        throw error;
      });

      expect(() => resolve(createAuthored([createComponent("intro")]))).toThrow(
        error,
      );

      expect(mockedComponentResolver).toHaveBeenCalledTimes(1);
    });

    it("propagates media resolution failures", () => {
      const error = new Error("Media resolution failed");

      mockedComponentResolver
        .mockReturnValueOnce({
          kind: "paragraph",
          content: [],
        })
        .mockImplementationOnce(() => {
          throw error;
        });

      expect(() => resolve(createAuthored([createComponent("intro")]))).toThrow(
        error,
      );

      expect(mockedComponentResolver).toHaveBeenCalledTimes(2);
    });

    it("does not resolve media if a component fails", () => {
      const authored = createAuthored([
        createComponent("first"),
        createComponent("second"),
      ]);

      mockedComponentResolver.mockImplementation(() => {
        throw new Error("Resolution stopped");
      });

      expect(() => resolve(authored)).toThrow("Resolution stopped");

      expect(mockedComponentResolver).toHaveBeenCalledTimes(1);
      expect(mockedComponentResolver).not.toHaveBeenCalledWith({
        authored: authored.media,
        svgAssets,
        socialProfiles,
      });
    });
  });
});
