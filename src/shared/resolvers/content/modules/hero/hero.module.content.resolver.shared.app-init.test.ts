// src/shared/resolvers/content/modules/hero/hero.module.content.resolver.shared.app-init.test.ts

import { resolveSvgReferenceAppInit } from "../../primitives/svg/svg.primitive.content.resolver.shared.app-init";

import { resolveHeroModuleContentSharedAppInit } from "./hero.module.content.resolver.shared.app-init";

jest.mock(
  "../../primitives/svg/svg.primitive.content.resolver.shared.app-init",
  () => ({
    resolveSvgReferenceAppInit: jest.fn(),
  }),
);

const mockedSvgResolver = jest.mocked(resolveSvgReferenceAppInit);

type Input = Parameters<typeof resolveHeroModuleContentSharedAppInit>[0];
type Authored = Input["authored"];
type Location = NonNullable<Authored["location"]>;
type ResolvedIcon = ReturnType<typeof resolveSvgReferenceAppInit>;

describe("Hero module AppInit resolver", () => {
  const svgAssets = {} as Input["svgAssets"];

  const createLocation = (): Location => ({
    label: "Epping Forest",
    icon: {
      id: "icon-location-dot",
    },
  });

  const createAuthored = (overrides: Partial<Authored> = {}): Authored =>
    ({
      kind: "hero",
      title: "Wildlife photography",
      ...overrides,
    }) as unknown as Authored;

  const resolve = (authored: Authored) =>
    resolveHeroModuleContentSharedAppInit({
      authored,
      svgAssets,
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedSvgResolver.mockReturnValue({
      id: "icon-location-dot",
      width: 24,
      height: 24,
    });
  });

  describe("Optional location", () => {
    it("normalises an omitted location to null", () => {
      const result = resolve(createAuthored());

      expect(result.location).toBeNull();
      expect(mockedSvgResolver).not.toHaveBeenCalled();
    });

    it("normalises an undefined location to null", () => {
      const result = resolve(
        createAuthored({
          location: undefined,
        }),
      );

      expect(result.location).toBeNull();
      expect(mockedSvgResolver).not.toHaveBeenCalled();
    });

    it("resolves the location icon against the SVG registry", () => {
      const location = createLocation();

      const result = resolve(createAuthored({ location }));

      expect(mockedSvgResolver).toHaveBeenCalledWith({
        authored: location.icon,
        registry: svgAssets,
      });

      expect(mockedSvgResolver).toHaveBeenCalledTimes(1);

      expect(result.location?.icon).toEqual({
        id: "icon-location-dot",
        width: 24,
        height: 24,
      });
    });

    it("preserves the resolved icon reference", () => {
      const icon = {
        id: "icon-location-dot",
        width: 32,
        height: 32,
      } as ResolvedIcon;

      mockedSvgResolver.mockReturnValue(icon);

      const result = resolve(
        createAuthored({
          location: createLocation(),
        }),
      );

      expect(result.location?.icon).toBe(icon);
    });

    it("preserves other location properties", () => {
      const location = {
        ...createLocation(),
        customLabel: "Loughton, Essex",
      };

      const result = resolve(createAuthored({ location }));

      expect(result.location).toMatchObject({
        customLabel: "Loughton, Essex",
      });
    });
  });

  describe("Data integrity", () => {
    it("preserves unrelated hero properties", () => {
      const authored = {
        ...createAuthored(),
        identifier: "homepage-hero",
      };

      const result = resolve(authored);

      expect(result).toMatchObject({
        identifier: "homepage-hero",
      });
    });

    it("does not mutate the authored location", () => {
      const location = createLocation();
      const authored = createAuthored({ location });

      const original = {
        ...location,
        icon: location.icon,
      };

      resolve(authored);

      expect(location).toEqual(original);
      expect(authored.location).toBe(location);
    });

    it("creates new hero and location objects", () => {
      const location = createLocation();
      const authored = createAuthored({ location });

      const result = resolve(authored);

      expect(result).not.toBe(authored);
      expect(result.location).not.toBe(location);
    });

    it("returns a new hero when location is absent", () => {
      const authored = createAuthored();

      expect(resolve(authored)).not.toBe(authored);
    });

    it("preserves unrelated nested references", () => {
      const metadata = {
        area: "Essex",
      };

      const authored = {
        ...createAuthored(),
        metadata,
      };

      const result = resolve(authored);

      expect(
        (
          result as typeof result & {
            metadata: typeof metadata;
          }
        ).metadata,
      ).toBe(metadata);
    });
  });

  describe("Failure propagation", () => {
    it("propagates SVG resolution failures", () => {
      const error = new Error("Unknown SVG asset");

      mockedSvgResolver.mockImplementation(() => {
        throw error;
      });

      expect(() =>
        resolve(
          createAuthored({
            location: createLocation(),
          }),
        ),
      ).toThrow(error);
    });
  });
});
