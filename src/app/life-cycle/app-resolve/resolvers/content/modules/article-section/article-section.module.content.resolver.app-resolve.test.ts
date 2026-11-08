// src/app/life-cycle/app-resolve/resolvers/content/modules/article-section/article-section.module.content.resolver.app-resolve.test.ts


import { resolveArticleSectionModuleContentAppResolve } from "./article-section.module.content.resolver.app-resolve";

type Input = Parameters<typeof resolveArticleSectionModuleContentAppResolve>[0];

type Content = Input["content"];
type Entry = Content["entries"][number];
type NestedModule = Entry["module"];
type ResolvedModule = Awaited<ReturnType<Input["resolveModule"]>>;

const mockedModule = jest.fn<Promise<ResolvedModule>, [NestedModule]>();

describe("Article section module AppResolve resolver", () => {
  const createEntry = (kind: string, id: string): Entry =>
    ({
      id,
      module: {
        kind,
      },
    }) as unknown as Entry;

  const createContent = (
    entries: readonly Entry[] = [
      createEntry("paragraph", "first"),
      createEntry("quote", "second"),
    ],
  ): Content =>
    ({
      kind: "articleSection",
      heading: {
        id: "forest-encounters",
      },
      entries,
    }) as unknown as Content;

  const createResolvedModule = (kind: string): ResolvedModule =>
    ({
      kind,
    }) as unknown as ResolvedModule;

  const resolve = (content: Content = createContent()) =>
    resolveArticleSectionModuleContentAppResolve({
      content,
      resolveModule: mockedModule as unknown as Input["resolveModule"],
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedModule.mockImplementation(async (content) =>
      createResolvedModule(content.kind),
    );
  });

  it("resolves every nested module", async () => {
    const content = createContent();

    const result = await resolve(content);

    expect(mockedModule).toHaveBeenCalledTimes(2);
    expect(result.entries).toHaveLength(2);
    expect(result.entries[0]?.module.kind).toBe("paragraph");
    expect(result.entries[1]?.module.kind).toBe("quote");
  });

  it("passes nested modules directly to the injected resolver", async () => {
    const content = createContent();

    await resolve(content);

    content.entries.forEach((entry, index) => {
      expect(mockedModule).toHaveBeenNthCalledWith(index + 1, entry.module);

      expect(mockedModule.mock.calls[index]?.[0]).toBe(entry.module);
    });
  });

  it("preserves the resolved module references", async () => {
    const resolvedModule = createResolvedModule("quote");

    mockedModule.mockResolvedValue(resolvedModule);

    const result = await resolve(
      createContent([createEntry("quote", "first")]),
    );

    expect(result.entries[0]?.module).toBe(resolvedModule);
  });

  it("preserves additional entry properties", async () => {
    const content = createContent();

    const result = await resolve(content);

    expect(result.entries).toEqual([
      {
        ...content.entries[0],
        module: expect.objectContaining({ kind: "paragraph" }),
      },
      {
        ...content.entries[1],
        module: expect.objectContaining({ kind: "quote" }),
      },
    ]);
  });

  it("supports an article section without entries", async () => {
    const result = await resolve(createContent([]));

    expect(result.entries).toEqual([]);
    expect(mockedModule).not.toHaveBeenCalled();
  });

  it("rejects an entry without a module", async () => {
    const entry = {
      id: "invalid",
      module: null,
    } as unknown as Entry;

    await expect(resolve(createContent([entry]))).rejects.toThrow(
      'Invalid module in articleSection "forest-encounters" at entry 0',
    );

    expect(mockedModule).not.toHaveBeenCalled();
  });

  it("rejects an entry with a missing module kind", async () => {
    const entry = {
      id: "invalid",
      module: {},
    } as unknown as Entry;

    await expect(resolve(createContent([entry]))).rejects.toThrow(
      'Invalid module in articleSection "forest-encounters" at entry 0',
    );

    expect(mockedModule).not.toHaveBeenCalled();
  });

  it("includes the correct index for an invalid later entry", async () => {
    const entries = [
      createEntry("quote", "valid"),
      {
        id: "invalid",
        module: null,
      } as unknown as Entry,
    ];

    await expect(resolve(createContent(entries))).rejects.toThrow(
      'Invalid module in articleSection "forest-encounters" at entry 1',
    );
  });

  it("wraps nested module errors with section and entry context", async () => {
    const cause = new Error("Photo metadata unavailable");

    mockedModule.mockRejectedValue(cause);

    const content = createContent([createEntry("photo", "first")]);

    await expect(resolve(content)).rejects.toThrow(
      'Failed to resolve module "photo" in articleSection "forest-encounters" at entry 0',
    );
  });

  it("preserves the original error as the cause", async () => {
    const cause = new Error("Nested resolution failed");

    mockedModule.mockRejectedValue(cause);

    try {
      await resolve(createContent([createEntry("quote", "first")]));

      throw new Error("Expected resolution to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).cause).toBe(cause);
    }
  });

  it("preserves the index when a later module fails", async () => {
    mockedModule
      .mockResolvedValueOnce(createResolvedModule("paragraph"))
      .mockRejectedValueOnce(new Error("Second module failed"));

    await expect(resolve()).rejects.toThrow(
      'Failed to resolve module "quote" in articleSection "forest-encounters" at entry 1',
    );
  });

  it("returns a new section and new entry objects", async () => {
    const content = createContent();

    const result = await resolve(content);

    expect(result).not.toBe(content);
    expect(result.entries).not.toBe(content.entries);
    expect(result.entries[0]).not.toBe(content.entries[0]);
  });

  it("does not mutate the source entries", async () => {
    const content = createContent();
    const originalModule = content.entries[0]?.module;

    await resolve(content);

    expect(content.entries[0]?.module).toBe(originalModule);
  });
});
