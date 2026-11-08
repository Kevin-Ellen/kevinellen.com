// src/shared/resolvers/content/components/rich-list/rich-list.component.content.resolver.shared.app-init.test.ts

import type { RichListComponentContentAuthored } from "../../../../../content-schema/content/components/rich-list.component.content.content-schema.authored.type";

import { resolveSvgReferenceAppInit } from "../../primitives/svg/svg.primitive.content.resolver.shared.app-init";

import { resolveRichListComponentContentAppInit } from "./rich-list.component.content.resolver.shared.app-init";

jest.mock(
  "../../primitives/svg/svg.primitive.content.resolver.shared.app-init",
  () => ({
    resolveSvgReferenceAppInit: jest.fn(),
  }),
);

const mockedSvgResolver = jest.mocked(resolveSvgReferenceAppInit);

type Input = Parameters<typeof resolveRichListComponentContentAppInit>[0];
type Item = Input["authored"]["items"][number];
type Icon = Item["icon"];
type ResolvedIcon = ReturnType<typeof resolveSvgReferenceAppInit>;

describe("Rich list component AppInit resolver", () => {
  const svgAssets = {} as Input["svgAssets"];

  const createIcon = (id: string): Icon => ({
    id,
  });

  const createItem = (
    id: string,
    overrides: Record<string, unknown> = {},
  ): Item =>
    ({
      id,
      title: id,
      icon: createIcon(id),
      ...overrides,
    }) as unknown as Item;

  const createAuthored = (
    items: readonly Item[] = [],
    overrides: Record<string, unknown> = {},
  ): RichListComponentContentAuthored =>
    ({
      kind: "richList",
      items,
      ...overrides,
    }) as unknown as RichListComponentContentAuthored;

  const resolve = (authored: Input["authored"]) =>
    resolveRichListComponentContentAppInit({
      authored,
      svgAssets,
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedSvgResolver.mockImplementation(
      ({ authored }) =>
        ({
          authored,
          resolved: true,
        }) as unknown as ResolvedIcon,
    );
  });

  describe("List mapping", () => {
    it("returns an empty list without calling the SVG resolver", () => {
      const result = resolve(createAuthored());

      expect(result.items).toEqual([]);
      expect(mockedSvgResolver).not.toHaveBeenCalled();
    });

    it("resolves a single item icon", () => {
      const item = createItem("camera");

      const result = resolve(createAuthored([item]));

      expect(mockedSvgResolver).toHaveBeenCalledWith({
        authored: item.icon,
        registry: svgAssets,
      });

      expect(result.items).toHaveLength(1);
      expect(mockedSvgResolver).toHaveBeenCalledTimes(1);
    });

    it("resolves all icons in item order", () => {
      const items = [
        createItem("camera"),
        createItem("forest"),
        createItem("wildlife"),
      ];

      resolve(createAuthored(items));

      expect(mockedSvgResolver).toHaveBeenCalledTimes(3);

      items.forEach((item, index) => {
        expect(mockedSvgResolver).toHaveBeenNthCalledWith(index + 1, {
          authored: item.icon,
          registry: svgAssets,
        });
      });
    });

    it("preserves resolved icon references", () => {
      const first = {
        id: "resolved-camera",
      } as unknown as ResolvedIcon;

      const second = {
        id: "resolved-forest",
      } as unknown as ResolvedIcon;

      mockedSvgResolver.mockReturnValueOnce(first).mockReturnValueOnce(second);

      const result = resolve(
        createAuthored([createItem("camera"), createItem("forest")]),
      );

      expect(result.items[0]?.icon).toBe(first);
      expect(result.items[1]?.icon).toBe(second);
    });

    it("preserves item properties other than icon", () => {
      const item = createItem("camera", {
        title: "Photography equipment",
        description: "Equipment used in the field",
      });

      const result = resolve(createAuthored([item]));

      expect(result.items[0]).toMatchObject({
        id: "camera",
        title: "Photography equipment",
        description: "Equipment used in the field",
      });
    });

    it("preserves component-level properties", () => {
      const authored = createAuthored([], {
        title: "Equipment",
        identifier: "equipment-list",
      });

      const result = resolve(authored);

      expect(result).toMatchObject({
        title: "Equipment",
        identifier: "equipment-list",
      });
    });
  });

  describe("Data integrity", () => {
    it("does not mutate the authored list", () => {
      const item = createItem("camera");
      const authored = createAuthored([item]);

      const original = {
        ...authored,
        items: [...authored.items],
      };

      resolve(authored);

      expect(authored).toEqual(original);
      expect(authored.items[0]).toBe(item);
    });

    it("creates new component, array and item objects", () => {
      const authored = createAuthored([createItem("camera")]);

      const result = resolve(authored);

      expect(result).not.toBe(authored);
      expect(result.items).not.toBe(authored.items);
      expect(result.items[0]).not.toBe(authored.items[0]);
    });

    it("preserves unrelated nested references", () => {
      const metadata = {
        category: "photography",
      };

      const item = createItem("camera", { metadata });
      const authored = createAuthored([item]);

      const result = resolve(authored) as unknown as {
        items: readonly { metadata: typeof metadata }[];
      };

      expect(result.items[0]?.metadata).toBe(metadata);
    });
  });

  describe("Failure propagation", () => {
    it("propagates SVG resolution errors", () => {
      const error = new Error("Unknown SVG asset");

      mockedSvgResolver.mockImplementation(() => {
        throw error;
      });

      expect(() => resolve(createAuthored([createItem("missing")]))).toThrow(
        error,
      );
    });

    it("stops mapping after an SVG resolution failure", () => {
      mockedSvgResolver.mockImplementation(() => {
        throw new Error("Resolution stopped");
      });

      expect(() =>
        resolve(createAuthored([createItem("first"), createItem("second")])),
      ).toThrow("Resolution stopped");

      expect(mockedSvgResolver).toHaveBeenCalledTimes(1);
    });
  });
});
