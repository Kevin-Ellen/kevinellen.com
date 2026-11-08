// src/shared/resolvers/content/topics/topics.resolve.shared.app-init.test.ts

import { resolveEditorialPhotoComponentContentAppInit } from "../components/editorial-photo/editorial-photo.component.content.resolver.shared.app-init";

import { resolveTopicsConfigAppInit } from "./topics.resolve.shared.app-init";

jest.mock(
  "../components/editorial-photo/editorial-photo.component.content.resolver.shared.app-init",
  () => ({
    resolveEditorialPhotoComponentContentAppInit: jest.fn(),
  }),
);

const mockedPhotoResolver = jest.mocked(
  resolveEditorialPhotoComponentContentAppInit,
);

type Input = Parameters<typeof resolveTopicsConfigAppInit>[0];
type Authored = Input["authored"];
type Topic = Authored[keyof Authored];
type ResolvedImage = ReturnType<
  typeof resolveEditorialPhotoComponentContentAppInit
>;

describe("Topics configuration AppInit resolver", () => {
  const createImage = (id: string): Topic["image"] => ({
    kind: "editorialPhoto",
    src: `/images/${id}.jpg`,
    alt: `${id} photograph`,
    width: 1600,
    height: 1067,
  });

  const createTopic = (id: string, overrides: Partial<Topic> = {}): Topic => ({
    label: id,
    description: `${id} photography`,
    introduction: `Photography and field notes about ${id}.`,
    image: createImage(id),
    dates: {} as Topic["dates"],
    ...overrides,
  });

  const createAuthored = (topics: Record<string, Topic> = {}): Authored =>
    topics as Authored;

  const resolve = (authored: Authored) =>
    resolveTopicsConfigAppInit({ authored });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedPhotoResolver.mockImplementation(({ authored }) => ({
      ...authored,
    }));
  });

  describe("Topic mapping", () => {
    it("returns an empty registry when no topics exist", () => {
      expect(resolve(createAuthored())).toEqual({});

      expect(mockedPhotoResolver).not.toHaveBeenCalled();
    });

    it("resolves a single topic", () => {
      const topic = createTopic("wildlife");
      const authored = createAuthored({ wildlife: topic });

      const result = resolve(authored);

      expect(result).toHaveProperty("wildlife");
      expect(mockedPhotoResolver).toHaveBeenCalledTimes(1);

      expect(mockedPhotoResolver).toHaveBeenCalledWith({
        authored: topic.image,
      });
    });

    it("resolves multiple topics", () => {
      const essex = createTopic("essex");
      const raptors = createTopic("raptors");
      const natureReserves = createTopic("nature-reserves");

      const result = resolve(
        createAuthored({
          essex,
          raptors,
          "nature-reserves": natureReserves,
        }),
      );

      expect(Object.keys(result)).toEqual([
        "essex",
        "raptors",
        "nature-reserves",
      ]);

      expect(mockedPhotoResolver).toHaveBeenCalledTimes(3);
    });

    it("resolves topic images in authored order", () => {
      const wildlife = createTopic("wildlife");
      const forests = createTopic("forests");

      resolve(
        createAuthored({
          wildlife,
          forests,
        }),
      );

      expect(mockedPhotoResolver).toHaveBeenNthCalledWith(1, {
        authored: wildlife.image,
      });

      expect(mockedPhotoResolver).toHaveBeenNthCalledWith(2, {
        authored: forests.image,
      });
    });

    it("uses the registry key as the resolved topic key", () => {
      const topic = createTopic("wildlife");

      const result = resolve(
        createAuthored({
          "nature-photography": topic,
        }),
      );

      expect(result).toHaveProperty("nature-photography");
      expect(result).not.toHaveProperty("wildlife");
    });
  });

  describe("Editorial photo resolution", () => {
    it("replaces authored images with resolved images", () => {
      const topic = createTopic("essex");

      const resolvedImage = {
        kind: "editorialPhoto",
        src: "/images/resolved-essex.jpg",
        alt: "Essex wildlife photograph",
        width: 1200,
        height: 800,
      } as ResolvedImage;

      mockedPhotoResolver.mockReturnValue(resolvedImage);

      const result = resolve(createAuthored({ essex: topic }));

      expect(result.essex.image).toBe(resolvedImage);
    });

    it("resolves every topic image independently", () => {
      const first = {
        kind: "editorialPhoto",
        src: "/images/essex.jpg",
        alt: "Essex wildlife",
        width: 1200,
        height: 800,
      } as ResolvedImage;

      const second = {
        kind: "editorialPhoto",
        src: "/images/raptors.jpg",
        alt: "Birds of prey",
        width: 1200,
        height: 800,
      } as ResolvedImage;

      mockedPhotoResolver
        .mockReturnValueOnce(first)
        .mockReturnValueOnce(second);

      const result = resolve(
        createAuthored({
          essex: createTopic("essex"),
          raptors: createTopic("raptors"),
        }),
      );

      expect(result.essex.image).toBe(first);
      expect(result.raptors.image).toBe(second);
    });

    it("preserves topic properties other than image", () => {
      const topic = createTopic("essex", {
        introduction: "Wildlife photography",
        description: "Wildlife encounters in Essex",
      });

      const result = resolve(createAuthored({ essex: topic }));

      expect(result.essex).toMatchObject({
        introduction: "Wildlife photography",
        description: "Wildlife encounters in Essex",
      });
    });
  });

  describe("Data integrity", () => {
    it("does not mutate authored topics", () => {
      const topic = createTopic("wildlife");
      const original = { ...topic };

      resolve(createAuthored({ wildlife: topic }));

      expect(topic).toEqual(original);
    });

    it("preserves the authored image reference", () => {
      const topic = createTopic("wildlife");
      const originalImage = topic.image;

      resolve(createAuthored({ wildlife: topic }));

      expect(topic.image).toBe(originalImage);
    });

    it("creates a new topics registry", () => {
      const authored = createAuthored({
        wildlife: createTopic("wildlife"),
      });

      const result = resolve(authored);

      expect(result).not.toBe(authored);
    });

    it("creates new topic objects", () => {
      const topic = createTopic("wildlife");

      const result = resolve(createAuthored({ wildlife: topic }));

      expect(result.essex).not.toBe(topic);
    });

    it("preserves unrelated nested references", () => {
      const metadata = {
        category: "nature",
      };

      const topic = {
        ...createTopic("essex"),
        metadata,
      };

      const result = resolve(createAuthored({ essex: topic }));

      expect(
        (
          result.essex as typeof result.essex & {
            metadata: typeof metadata;
          }
        ).metadata,
      ).toBe(metadata);
    });

    it("returns fresh topic objects on repeated resolution", () => {
      const authored = createAuthored({
        raptors: createTopic("raptors"),
      });

      const first = resolve(authored);
      const second = resolve(authored);

      expect(first).not.toBe(second);

      expect(first.raptors).toBeDefined();
      expect(second.raptors).toBeDefined();

      expect(first.raptors).not.toBe(second.raptors);
    });
  });

  describe("Failure propagation", () => {
    it("propagates editorial photo resolution errors", () => {
      const error = new Error("Editorial photo resolution failed");

      mockedPhotoResolver.mockImplementation(() => {
        throw error;
      });

      expect(() =>
        resolve(
          createAuthored({
            raptors: createTopic("raptors"),
          }),
        ),
      ).toThrow(error);
    });

    it("stops resolving topics after the first failure", () => {
      mockedPhotoResolver.mockImplementation(() => {
        throw new Error("Resolution stopped");
      });

      expect(() =>
        resolve(
          createAuthored({
            raptors: createTopic("raptors"),
            essex: createTopic("essex"),
          }),
        ),
      ).toThrow("Resolution stopped");

      expect(mockedPhotoResolver).toHaveBeenCalledTimes(1);
    });
  });
});
