// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/article-section/article-section.module.body.page.document.content.resolver.app-render-context.test.ts

import { resolveArticleSectionModuleContentAppRenderContext } from "./article-section.module.body.page.document.content.resolver.app-render-context";

type Input = Parameters<
  typeof resolveArticleSectionModuleContentAppRenderContext
>[0];

type Content = Input["content"];
type Entry = Content["entries"][number];
type NestedModule = Entry["module"];
type ResolvedModule = ReturnType<Input["resolveModule"]>;

const mockedModule = jest.fn<ResolvedModule, [NestedModule]>();

describe("Article section module AppRenderContext resolver", () => {
  const createEntry = (id: string, kind: NestedModule["kind"]): Entry =>
    ({
      id,
      module: { kind },
    }) as unknown as Entry;

  const createContent = (
    entries: Entry[] = [
      createEntry("introduction", "hero"),
      createEntry("observations", "quote"),
    ],
  ): Content =>
    ({
      kind: "articleSection",
      id: "field-notes",
      entries,
    }) as unknown as Content;

  const resolve = (content: Content = createContent()) =>
    resolveArticleSectionModuleContentAppRenderContext({
      content,
      resolveModule: mockedModule as unknown as Input["resolveModule"],
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedModule.mockImplementation(
      (content) => ({ kind: content.kind }) as ResolvedModule,
    );
  });

  it("resolves each nested module in order", () => {
    const content = createContent();

    resolve(content);

    expect(mockedModule).toHaveBeenCalledTimes(2);

    content.entries.forEach((entry, index) => {
      expect(mockedModule).toHaveBeenNthCalledWith(index + 1, entry.module);

      expect(mockedModule.mock.calls[index]?.[0]).toBe(entry.module);
    });
  });

  it("preserves resolved module references", () => {
    const first = {
      kind: "hero",
    } as ResolvedModule;

    const second = {
      kind: "quote",
    } as ResolvedModule;

    mockedModule.mockReturnValueOnce(first).mockReturnValueOnce(second);

    const result = resolve();

    expect(result.entries[0]?.module).toBe(first);
    expect(result.entries[1]?.module).toBe(second);
  });

  it("preserves entry metadata", () => {
    const content = createContent();

    const result = resolve(content);

    result.entries.forEach((entry, index) => {
      const original = content.entries[index];

      expect(entry).toEqual({
        ...original,
        module: entry.module,
      });
    });
  });

  it("creates new module, entries and entry objects", () => {
    const content = createContent();

    const result = resolve(content);

    expect(result).not.toBe(content);
    expect(result.entries).not.toBe(content.entries);
    expect(result.entries[0]).not.toBe(content.entries[0]);
    expect(result.entries[1]).not.toBe(content.entries[1]);
  });

  it("supports empty sections", () => {
    const result = resolve(createContent([]));

    expect(result.entries).toEqual([]);
    expect(mockedModule).not.toHaveBeenCalled();
  });

  it("propagates nested module failures", () => {
    const error = new Error("Nested module resolution failed");

    mockedModule.mockImplementation(() => {
      throw error;
    });

    expect(() => resolve()).toThrow(error);
    expect(mockedModule).toHaveBeenCalledTimes(1);
  });

  it("does not mutate the original entries", () => {
    const content = createContent();
    const originalEntries = content.entries;
    const originalModule = content.entries[0]?.module;

    resolve(content);

    expect(content.entries).toBe(originalEntries);
    expect(content.entries[0]?.module).toBe(originalModule);
  });
});
