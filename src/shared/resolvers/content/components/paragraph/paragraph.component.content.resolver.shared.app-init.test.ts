// src/shared/resolvers/content/components/paragraph/paragraph.component.content.resolver.shared.app-init.test.ts

import type { ParagraphComponentContentAuthored } from "../../../../../content-schema/content/components/paragraph.component.content.content-schema.authored.type";

import { resolveInlineContentAppInit } from "../../inline/inline.content.resolver.shared.app-init";

import { resolveParagraphComponentContentAppInit } from "./paragraph.component.content.resolver.shared.app-init";

jest.mock("../../inline/inline.content.resolver.shared.app-init", () => ({
  resolveInlineContentAppInit: jest.fn(),
}));

const mockedInlineResolver = jest.mocked(resolveInlineContentAppInit);

type Input = Parameters<typeof resolveParagraphComponentContentAppInit>[0];
type Inline = Input["authored"]["content"][number];
type ResolvedInline = ReturnType<typeof resolveInlineContentAppInit>;

describe("Paragraph component AppInit resolver", () => {
  const svgAssets = {} as Input["svgAssets"];
  const socialProfiles = {} as Input["socialProfiles"];

  const createInline = (value: string): Inline =>
    ({
      kind: "text",
      value,
    }) as unknown as Inline;

  const createAuthored = (
    content: readonly Inline[] = [],
    overrides: Record<string, unknown> = {},
  ): ParagraphComponentContentAuthored =>
    ({
      kind: "paragraph",
      content,
      ...overrides,
    }) as unknown as ParagraphComponentContentAuthored;

  const resolve = (authored: ParagraphComponentContentAuthored) =>
    resolveParagraphComponentContentAppInit({
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

  describe("Inline content", () => {
    it("returns an empty content array when no inline content exists", () => {
      const result = resolve(createAuthored());

      expect(result.content).toEqual([]);
      expect(mockedInlineResolver).not.toHaveBeenCalled();
    });

    it("resolves a single inline element", () => {
      const inline = createInline("Epping Forest");

      const result = resolve(createAuthored([inline]));

      expect(mockedInlineResolver).toHaveBeenCalledWith({
        authored: inline,
        svgAssets,
        socialProfiles,
      });

      expect(result.content).toHaveLength(1);
    });

    it("resolves multiple inline elements in order", () => {
      const first = createInline("Wildlife");
      const second = createInline("photography");
      const third = createInline("in Essex");

      resolve(createAuthored([first, second, third]));

      expect(mockedInlineResolver).toHaveBeenCalledTimes(3);

      [first, second, third].forEach((inline, index) => {
        expect(mockedInlineResolver).toHaveBeenNthCalledWith(index + 1, {
          authored: inline,
          svgAssets,
          socialProfiles,
        });
      });
    });

    it("preserves resolved inline references and order", () => {
      const first = { id: "first" } as unknown as ResolvedInline;
      const second = { id: "second" } as unknown as ResolvedInline;

      mockedInlineResolver
        .mockReturnValueOnce(first)
        .mockReturnValueOnce(second);

      const result = resolve(
        createAuthored([createInline("First"), createInline("Second")]),
      );

      expect(result.content).toEqual([first, second]);
      expect(result.content[0]).toBe(first);
      expect(result.content[1]).toBe(second);
    });

    it("forwards shared dependencies by reference", () => {
      const inline = createInline("Fox");

      resolve(createAuthored([inline]));

      const input = mockedInlineResolver.mock.calls[0]?.[0];

      expect(input?.authored).toBe(inline);
      expect(input?.svgAssets).toBe(svgAssets);
      expect(input?.socialProfiles).toBe(socialProfiles);
    });
  });

  describe("Property preservation", () => {
    it("preserves other paragraph properties", () => {
      const authored = createAuthored([], {
        identifier: "opening-paragraph",
        className: "editorial-introduction",
      });

      const result = resolve(authored);

      expect(result).toMatchObject({
        identifier: "opening-paragraph",
        className: "editorial-introduction",
      });
    });

    it("does not mutate the authored paragraph", () => {
      const content = [createInline("Fox"), createInline("Deer")];

      const authored = createAuthored(content);

      const original = [...content];

      resolve(authored);

      expect(authored.content).toEqual(original);
      expect(authored.content[0]).toBe(content[0]);
    });

    it("creates a new paragraph and content array", () => {
      const authored = createAuthored([createInline("Epping Forest")]);

      const result = resolve(authored);

      expect(result).not.toBe(authored);
      expect(result.content).not.toBe(authored.content);
    });
  });

  describe("Failure propagation", () => {
    it("propagates inline resolution errors", () => {
      const error = new Error("Inline resolution failed");

      mockedInlineResolver.mockImplementation(() => {
        throw error;
      });

      expect(() => resolve(createAuthored([createInline("Fox")]))).toThrow(
        error,
      );
    });

    it("does not process later inline elements after an error", () => {
      mockedInlineResolver.mockImplementation(() => {
        throw new Error("Resolution stopped");
      });

      expect(() =>
        resolve(
          createAuthored([createInline("First"), createInline("Second")]),
        ),
      ).toThrow("Resolution stopped");

      expect(mockedInlineResolver).toHaveBeenCalledTimes(1);
    });
  });
});
