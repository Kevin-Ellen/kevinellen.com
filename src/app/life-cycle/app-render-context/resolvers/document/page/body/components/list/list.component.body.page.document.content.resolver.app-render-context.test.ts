// src/app/life-cycle/app-render-context/resolvers/document/page/body/components/list/list.component.body.page.document.content.resolver.app-render-context.test.ts

import { resolveListComponentContentAppRenderContext } from "./list.component.body.page.document.content.resolver.app-render-context";

import { resolveContentInlineAppRenderContext } from "../../inline/inline.body.page.document.content.resolver.app-render-context";

jest.mock(
  "../../inline/inline.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveContentInlineAppRenderContext: jest.fn(),
  }),
);

const mockedInline = jest.mocked(resolveContentInlineAppRenderContext);

type Content = Parameters<
  typeof resolveListComponentContentAppRenderContext
>[0]["content"];

type Item = Content["items"][number];
type Inline = Item["content"][number];
type ResolvedInline = ReturnType<typeof resolveContentInlineAppRenderContext>;

describe("List component AppRenderContext resolver", () => {
  const createInline = (kind: Inline["kind"], id: string): Inline =>
    ({
      kind,
      value: id,
      href: "/journals",
      label: id,
    }) as unknown as Inline;

  const createItem = (id: string, content: Inline[]): Item =>
    ({
      id,
      content,
    }) as unknown as Item;

  const createContent = (
    items: Item[] = [
      createItem("first", [
        createInline("text", "first-text"),
        createInline("link", "first-link"),
      ]),
      createItem("second", [createInline("text", "second-text")]),
    ],
  ): Content =>
    ({
      kind: "list",
      items,
    }) as unknown as Content;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedInline.mockImplementation(({ content }) => content);
  });

  it("resolves every inline element in every item", () => {
    const content = createContent();

    resolveListComponentContentAppRenderContext({ content });

    expect(mockedInline).toHaveBeenCalledTimes(3);

    expect(mockedInline).toHaveBeenNthCalledWith(1, {
      content: content.items[0]?.content[0],
    });

    expect(mockedInline).toHaveBeenNthCalledWith(2, {
      content: content.items[0]?.content[1],
    });

    expect(mockedInline).toHaveBeenNthCalledWith(3, {
      content: content.items[1]?.content[0],
    });
  });

  it("preserves item ordering and inline ordering", () => {
    const first = {
      kind: "text",
      value: "Resolved first",
    } as unknown as ResolvedInline;

    const second = {
      kind: "link",
      label: "Resolved second",
    } as unknown as ResolvedInline;

    const third = {
      kind: "text",
      value: "Resolved third",
    } as unknown as ResolvedInline;

    mockedInline
      .mockReturnValueOnce(first)
      .mockReturnValueOnce(second)
      .mockReturnValueOnce(third);

    const result = resolveListComponentContentAppRenderContext({
      content: createContent(),
    });

    expect(result.items[0]?.content).toEqual([first, second]);
    expect(result.items[1]?.content).toEqual([third]);

    expect(result.items[0]?.content[0]).toBe(first);
    expect(result.items[0]?.content[1]).toBe(second);
    expect(result.items[1]?.content[0]).toBe(third);
  });

  it("preserves item metadata while replacing inline content", () => {
    const content = createContent([
      createItem("field-note", [createInline("text", "observation")]),
    ]);

    const result = resolveListComponentContentAppRenderContext({
      content,
    });

    expect(result.items[0]).toEqual({
      ...content.items[0],
      content: result.items[0]?.content,
    });
  });

  it("preserves top-level component properties", () => {
    const content = createContent();

    const result = resolveListComponentContentAppRenderContext({
      content,
    });

    expect(result.kind).toBe("list");
    expect(result.items).toHaveLength(2);
  });

  it("creates new component, items and item objects", () => {
    const content = createContent();

    const result = resolveListComponentContentAppRenderContext({
      content,
    });

    expect(result).not.toBe(content);
    expect(result.items).not.toBe(content.items);

    expect(result.items[0]).not.toBe(content.items[0]);
    expect(result.items[1]).not.toBe(content.items[1]);

    expect(result.items[0]?.content).not.toBe(content.items[0]?.content);
  });

  it("supports an empty item collection", () => {
    const content = createContent([]);

    const result = resolveListComponentContentAppRenderContext({
      content,
    });

    expect(result.items).toEqual([]);
    expect(mockedInline).not.toHaveBeenCalled();
  });

  it("supports items without inline content", () => {
    const content = createContent([createItem("empty", [])]);

    const result = resolveListComponentContentAppRenderContext({
      content,
    });

    expect(result.items[0]?.content).toEqual([]);
    expect(mockedInline).not.toHaveBeenCalled();
  });

  it("propagates inline resolver failures", () => {
    const error = new Error("Inline resolution failed");

    mockedInline.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveListComponentContentAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);
  });

  it("does not mutate the original list", () => {
    const content = createContent();
    const originalItems = content.items;
    const originalInline = content.items[0]?.content;

    resolveListComponentContentAppRenderContext({ content });

    expect(content.items).toBe(originalItems);
    expect(content.items[0]?.content).toBe(originalInline);
  });
});
