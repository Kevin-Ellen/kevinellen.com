// src/shared/resolvers/content/components/list/list.component.content.resolver.shared.app-init.test.ts

import type { ListComponentContentAuthored } from "../../../../../content-schema/content/components/list.component.content.content-schema.authored.type";

import { resolveInlineContentAppInit } from "../../inline/inline.content.resolver.shared.app-init";

import { resolveListComponentContentAppInit } from "./list.component.content.resolver.shared.app-init";

jest.mock("../../inline/inline.content.resolver.shared.app-init", () => ({
  resolveInlineContentAppInit: jest.fn(),
}));

const mockedInlineResolver = jest.mocked(resolveInlineContentAppInit);

type Input = Parameters<typeof resolveListComponentContentAppInit>[0];
type ListItem = Input["authored"]["items"][number];
type Inline = ListItem["content"][number];
type ResolvedInline = ReturnType<typeof resolveInlineContentAppInit>;

describe("List component AppInit resolver", () => {
  const svgAssets = {} as Input["svgAssets"];
  const socialProfiles = {} as Input["socialProfiles"];

  const createInline = (value: string): Inline =>
    ({
      kind: "text",
      value,
    }) as unknown as Inline;

  const createItem = (
    content: readonly Inline[],
    overrides: Record<string, unknown> = {},
  ): ListItem => ({
    content,
    ...overrides,
  });

  const createAuthored = (
    items: readonly ListItem[] = [],
  ): ListComponentContentAuthored =>
    ({
      kind: "list",
      items,
    }) as unknown as ListComponentContentAuthored;

  const resolve = (authored: ListComponentContentAuthored) =>
    resolveListComponentContentAppInit({
      authored,
      svgAssets,
      socialProfiles,
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedInlineResolver.mockImplementation(
      ({ authored }) =>
        ({
          ...authored,
          resolved: true,
        }) as unknown as ResolvedInline,
    );
  });

  describe("List mapping", () => {
    it("returns an empty items array for an empty list", () => {
      const result = resolve(createAuthored());

      expect(result.items).toEqual([]);
      expect(mockedInlineResolver).not.toHaveBeenCalled();
    });

    it("preserves list-level properties", () => {
      const authored = {
        ...createAuthored(),
        ordered: true,
        customProperty: "preserved",
      } as unknown as ListComponentContentAuthored;

      const result = resolve(authored);

      expect(result).toMatchObject({
        ordered: true,
        customProperty: "preserved",
      });
    });

    it("preserves items with empty inline content", () => {
      const item = createItem([], {
        marker: "first",
      });

      const result = resolve(createAuthored([item]));

      expect(result.items).toEqual([
        {
          marker: "first",
          content: [],
        },
      ]);

      expect(mockedInlineResolver).not.toHaveBeenCalled();
    });

    it("resolves a single inline element", () => {
      const inline = createInline("Epping Forest");

      const result = resolve(createAuthored([createItem([inline])]));

      expect(mockedInlineResolver).toHaveBeenCalledWith({
        authored: inline,
        svgAssets,
        socialProfiles,
      });

      expect(result.items[0]?.content).toHaveLength(1);
    });

    it("resolves every inline element in list order", () => {
      const first = createInline("Fox");
      const second = createInline("Deer");
      const third = createInline("Owl");

      resolve(
        createAuthored([createItem([first, second]), createItem([third])]),
      );

      expect(mockedInlineResolver).toHaveBeenCalledTimes(3);

      expect(mockedInlineResolver).toHaveBeenNthCalledWith(1, {
        authored: first,
        svgAssets,
        socialProfiles,
      });

      expect(mockedInlineResolver).toHaveBeenNthCalledWith(2, {
        authored: second,
        svgAssets,
        socialProfiles,
      });

      expect(mockedInlineResolver).toHaveBeenNthCalledWith(3, {
        authored: third,
        svgAssets,
        socialProfiles,
      });
    });

    it("preserves resolved inline references and order", () => {
      const first = { id: "first" } as unknown as ResolvedInline;
      const second = { id: "second" } as unknown as ResolvedInline;

      mockedInlineResolver
        .mockReturnValueOnce(first)
        .mockReturnValueOnce(second);

      const result = resolve(
        createAuthored([
          createItem([createInline("One"), createInline("Two")]),
        ]),
      );

      expect(result.items[0]?.content).toEqual([first, second]);
      expect(result.items[0]?.content[0]).toBe(first);
      expect(result.items[0]?.content[1]).toBe(second);
    });

    it("retains unrelated item metadata", () => {
      const item = createItem([createInline("Fox")], {
        marker: "wildlife",
        identifier: "item-one",
      });

      const result = resolve(createAuthored([item]));

      expect(result.items[0]).toMatchObject({
        marker: "wildlife",
        identifier: "item-one",
      });
    });
  });

  describe("Immutability", () => {
    it("does not mutate the authored list", () => {
      const inline = createInline("Fox");
      const item = createItem([inline]);
      const authored = createAuthored([item]);

      resolve(authored);

      expect(authored.items[0]).toBe(item);
      expect(authored.items[0]?.content[0]).toBe(inline);
      expect(authored).toEqual(createAuthored([item]));
    });

    it("creates new item and content arrays", () => {
      const authored = createAuthored([createItem([createInline("Fox")])]);

      const result = resolve(authored);

      expect(result).not.toBe(authored);
      expect(result.items).not.toBe(authored.items);
      expect(result.items[0]).not.toBe(authored.items[0]);
      expect(result.items[0]?.content).not.toBe(authored.items[0]?.content);
    });
  });

  describe("Failure propagation", () => {
    it("propagates inline resolution failures", () => {
      const error = new Error("Inline resolution failed");

      mockedInlineResolver.mockImplementation(() => {
        throw error;
      });

      expect(() =>
        resolve(createAuthored([createItem([createInline("Fox")])])),
      ).toThrow(error);
    });

    it("stops processing after an inline resolution failure", () => {
      mockedInlineResolver.mockImplementation(() => {
        throw new Error("Resolution stopped");
      });

      expect(() =>
        resolve(
          createAuthored([
            createItem([createInline("First"), createInline("Second")]),
          ]),
        ),
      ).toThrow("Resolution stopped");

      expect(mockedInlineResolver).toHaveBeenCalledTimes(1);
    });
  });
});
