// src/shared/resolvers/content/modules/article-section/article-section.module.content.resolver.shared.app-init.test.ts


import { resolveArticleSectionModuleContentAppInit } from "./article-section.module.content.resolver.shared.app-init";

type Input = Parameters<typeof resolveArticleSectionModuleContentAppInit>[0];

type Authored = Input["authored"];
type Entry = Authored["entries"][number];
type NestedModule = Entry["module"];
type ResolvedModule = ReturnType<Input["resolveModule"]>;

const mockedModuleResolver = jest.fn<ResolvedModule, [NestedModule]>();

describe("Article section module AppInit resolver", () => {
  const svgAssets = {} as Input["svgAssets"];
  const socialProfiles = {} as Input["socialProfiles"];
  const dates = {} as Input["dates"];
  const topics = {} as Input["topics"];

  const createModule = (id: string): NestedModule =>
    ({
      kind: "paragraph",
      id,
      content: [],
    }) as unknown as NestedModule;

  const createEntry = (
    id: string,
    overrides: Record<string, unknown> = {},
  ): Entry =>
    ({
      id,
      module: createModule(id),
      ...overrides,
    }) as unknown as Entry;

  const createAuthored = (
    entries: readonly Entry[] = [],
    overrides: Record<string, unknown> = {},
  ): Authored =>
    ({
      kind: "articleSection",
      entries,
      ...overrides,
    }) as unknown as Authored;

  const resolve = (authored: Authored) =>
    resolveArticleSectionModuleContentAppInit({
      authored,
      svgAssets,
      socialProfiles,
      dates,
      topics,
      resolveModule: mockedModuleResolver as unknown as Input["resolveModule"],
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedModuleResolver.mockImplementation(
      (authored) =>
        ({
          ...authored,
          resolved: true,
        }) as unknown as ResolvedModule,
    );
  });

  describe("Entry mapping", () => {
    it("returns an empty entries array for an empty section", () => {
      const result = resolve(createAuthored());

      expect(result.entries).toEqual([]);
      expect(mockedModuleResolver).not.toHaveBeenCalled();
    });

    it("resolves a single nested module", () => {
      const entry = createEntry("introduction");

      const result = resolve(createAuthored([entry]));

      expect(mockedModuleResolver).toHaveBeenCalledWith(entry.module);
      expect(mockedModuleResolver).toHaveBeenCalledTimes(1);
      expect(result.entries).toHaveLength(1);
    });

    it("resolves entries in authored order", () => {
      const entries = [
        createEntry("first"),
        createEntry("second"),
        createEntry("third"),
      ];

      resolve(createAuthored(entries));

      expect(mockedModuleResolver).toHaveBeenCalledTimes(3);

      entries.forEach((entry, index) => {
        expect(mockedModuleResolver).toHaveBeenNthCalledWith(
          index + 1,
          entry.module,
        );
      });
    });

    it("preserves resolved module references and ordering", () => {
      const first = {
        kind: "paragraph",
        id: "resolved-first",
      } as unknown as ResolvedModule;

      const second = {
        kind: "paragraph",
        id: "resolved-second",
      } as unknown as ResolvedModule;

      mockedModuleResolver
        .mockReturnValueOnce(first)
        .mockReturnValueOnce(second);

      const result = resolve(
        createAuthored([createEntry("first"), createEntry("second")]),
      );

      expect(result.entries[0]?.module).toBe(first);
      expect(result.entries[1]?.module).toBe(second);
    });

    it("preserves entry properties other than module", () => {
      const entry = createEntry("introduction", {
        title: "Introduction",
        anchor: "introduction",
      });

      const result = resolve(createAuthored([entry]));

      expect(result.entries[0]).toMatchObject({
        id: "introduction",
        title: "Introduction",
        anchor: "introduction",
      });
    });

    it("preserves section-level properties", () => {
      const authored = createAuthored([], {
        title: "Field observations",
        identifier: "field-observations",
      });

      const result = resolve(authored);

      expect(result).toMatchObject({
        title: "Field observations",
        identifier: "field-observations",
      });
    });
  });

  describe("Dependency injection", () => {
    it("passes the original nested module reference to the injected resolver", () => {
      const entry = createEntry("introduction");

      resolve(createAuthored([entry]));

      expect(mockedModuleResolver).toHaveBeenCalledTimes(1);
      expect(mockedModuleResolver.mock.calls[0]?.[0]).toBe(entry.module);
    });
  });

  describe("Data integrity", () => {
    it("does not mutate the authored section or entries", () => {
      const entry = createEntry("introduction");
      const authored = createAuthored([entry]);

      const original = {
        ...authored,
        entries: [...authored.entries],
      };

      resolve(authored);

      expect(authored).toEqual(original);
      expect(authored.entries[0]).toBe(entry);
    });

    it("creates new section, entries array and entry objects", () => {
      const authored = createAuthored([createEntry("introduction")]);

      const result = resolve(authored);

      expect(result).not.toBe(authored);
      expect(result.entries).not.toBe(authored.entries);
      expect(result.entries[0]).not.toBe(authored.entries[0]);
    });

    it("preserves unrelated nested references", () => {
      const metadata = {
        category: "wildlife",
      };

      const entry = {
        ...createEntry("introduction"),
        metadata,
      };

      const result = resolve(createAuthored([entry]));

      expect(
        (
          result.entries[0] as (typeof result.entries)[0] & {
            metadata: typeof metadata;
          }
        ).metadata,
      ).toBe(metadata);
    });

    it("returns fresh entry objects on repeated resolution", () => {
      const authored = createAuthored([createEntry("introduction")]);

      const first = resolve(authored);
      const second = resolve(authored);

      expect(first).not.toBe(second);
      expect(first.entries).not.toBe(second.entries);
      expect(first.entries[0]).not.toBe(second.entries[0]);
    });
  });

  describe("Failure propagation", () => {
    it("propagates nested module resolution errors", () => {
      const error = new Error("Nested module resolution failed");

      mockedModuleResolver.mockImplementation(() => {
        throw error;
      });

      expect(() =>
        resolve(createAuthored([createEntry("introduction")])),
      ).toThrow(error);
    });

    it("stops processing after a nested module failure", () => {
      mockedModuleResolver.mockImplementation(() => {
        throw new Error("Resolution stopped");
      });

      expect(() =>
        resolve(createAuthored([createEntry("first"), createEntry("second")])),
      ).toThrow("Resolution stopped");

      expect(mockedModuleResolver).toHaveBeenCalledTimes(1);
    });
  });
});
