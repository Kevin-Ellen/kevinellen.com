// src/app/life-cycle/app-resolve/resolvers/content/components/list/list.component.content.resolver.app-resolve.test.ts

import { resolveListComponentContentAppResolve } from "./list.component.content.resolver.app-resolve";

import { resolveContentInlineAppResolve } from "../../inline/inline.content.resolver.app-resolve";

jest.mock("../../inline/inline.content.resolver.app-resolve", () => ({
  resolveContentInlineAppResolve: jest.fn(),
}));

const mockedInline = jest.mocked(resolveContentInlineAppResolve);

type Input = Parameters<typeof resolveListComponentContentAppResolve>[0];
type Content = Input["content"];
type Item = Content["items"][number];
type Inline = Item["content"][number];
type ResolvedInline = ReturnType<typeof resolveContentInlineAppResolve>;

describe("List component AppResolve resolver", () => {
  const contentRegistry = {
    bySlug: {},
    errorsByStatus: {},
  } as Input["contentRegistry"];

  const createInline = (text: string): Inline =>
    ({
      kind: "text",
      text,
    }) as unknown as Inline;

  const createItem = (id: string, inline: readonly Inline[]): Item =>
    ({
      id,
      content: inline,
    }) as unknown as Item;

  const createContent = (
    items: readonly Item[] = [
      createItem("first", [createInline("One"), createInline("Two")]),
      createItem("second", [createInline("Three")]),
    ],
  ): Content =>
    ({
      kind: "list",
      items,
    }) as unknown as Content;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedInline.mockImplementation(
      ({ content }) => content as unknown as ResolvedInline,
    );
  });

  it("resolves inline content across all list items", () => {
    const content = createContent();

    const result = resolveListComponentContentAppResolve({
      content,
      contentRegistry,
    });

    expect(mockedInline).toHaveBeenCalledTimes(3);
    expect(result.items).toHaveLength(2);
    expect(result.items[0]?.content).toHaveLength(2);
    expect(result.items[1]?.content).toHaveLength(1);
  });

  it("preserves inline resolution order", () => {
    const content = createContent();

    resolveListComponentContentAppResolve({
      content,
      contentRegistry,
    });

    expect(mockedInline).toHaveBeenNthCalledWith(1, {
      content: content.items[0]?.content[0],
      contentRegistry,
    });

    expect(mockedInline).toHaveBeenNthCalledWith(2, {
      content: content.items[0]?.content[1],
      contentRegistry,
    });

    expect(mockedInline).toHaveBeenNthCalledWith(3, {
      content: content.items[1]?.content[0],
      contentRegistry,
    });
  });

  it("preserves list item properties", () => {
    const content = createContent();

    const result = resolveListComponentContentAppResolve({
      content,
      contentRegistry,
    });

    expect(result.items[0]).toMatchObject({ id: "first" });
    expect(result.items[1]).toMatchObject({ id: "second" });
  });

  it("uses the returned inline objects", () => {
    const resolved = {
      kind: "text",
      text: "Resolved text",
    } as unknown as ResolvedInline;

    mockedInline.mockReturnValue(resolved);

    const result = resolveListComponentContentAppResolve({
      content: createContent([createItem("first", [createInline("Original")])]),
      contentRegistry,
    });

    expect(result.items[0]?.content[0]).toBe(resolved);
  });

  it("supports an empty list", () => {
    const result = resolveListComponentContentAppResolve({
      content: createContent([]),
      contentRegistry,
    });

    expect(result.items).toEqual([]);
    expect(mockedInline).not.toHaveBeenCalled();
  });

  it("supports an item without inline content", () => {
    const result = resolveListComponentContentAppResolve({
      content: createContent([createItem("empty", [])]),
      contentRegistry,
    });

    expect(result.items[0]?.content).toEqual([]);
    expect(mockedInline).not.toHaveBeenCalled();
  });

  it("creates new list and item objects", () => {
    const content = createContent();

    const result = resolveListComponentContentAppResolve({
      content,
      contentRegistry,
    });

    expect(result).not.toBe(content);
    expect(result.items).not.toBe(content.items);
    expect(result.items[0]).not.toBe(content.items[0]);
    expect(result.items[0]?.content).not.toBe(content.items[0]?.content);
  });

  it("does not mutate the source list", () => {
    const content = Object.freeze(createContent());

    resolveListComponentContentAppResolve({
      content,
      contentRegistry,
    });

    expect(content.items).toHaveLength(2);
    expect(content.items[0]?.content).toHaveLength(2);
  });

  it("propagates inline resolution failures", () => {
    const error = new Error("Inline resolution failed");

    mockedInline.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveListComponentContentAppResolve({
        content: createContent(),
        contentRegistry,
      }),
    ).toThrow(error);
  });
});
