// src/app/life-cycle/app-render-context/resolvers/document/page/body/components/paragraph/paragraph.component.body.page.document.content.resolver.app-render-context.test.ts

import { resolveParagraphComponentContentAppRenderContext } from "./paragraph.component.body.page.document.content.resolver.app-render-context";

import { resolveContentInlineAppRenderContext } from "../../inline/inline.body.page.document.content.resolver.app-render-context";

jest.mock(
  "../../inline/inline.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveContentInlineAppRenderContext: jest.fn(),
  }),
);

const mockedInline = jest.mocked(resolveContentInlineAppRenderContext);

type Content = Parameters<
  typeof resolveParagraphComponentContentAppRenderContext
>[0]["content"];

type Inline = Content["content"][number];

type ResolvedInline = ReturnType<typeof resolveContentInlineAppRenderContext>;

describe("Paragraph component AppRenderContext resolver", () => {
  const createInline = (kind: Inline["kind"], value: string): Inline =>
    ({
      kind,
      value,
      label: value,
      href: "/journals",
    }) as unknown as Inline;

  const createContent = (
    inline: Inline[] = [
      createInline("text", "A morning in "),
      createInline("link", "Epping Forest"),
      createInline("text", " observing wildlife."),
    ],
  ): Content =>
    ({
      kind: "paragraph",
      content: inline,
    }) as unknown as Content;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedInline.mockImplementation(({ content }) => content);
  });

  it("resolves every inline element in order", () => {
    const content = createContent();

    resolveParagraphComponentContentAppRenderContext({ content });

    expect(mockedInline).toHaveBeenCalledTimes(3);

    content.content.forEach((inline, index) => {
      expect(mockedInline).toHaveBeenNthCalledWith(index + 1, {
        content: inline,
      });
    });
  });

  it("preserves the order and references of resolved elements", () => {
    const first = {
      kind: "text",
      value: "Resolved first",
    } as unknown as ResolvedInline;

    const second = {
      kind: "link",
      label: "Resolved link",
      href: "/journals",
    } as unknown as ResolvedInline;

    const third = {
      kind: "text",
      value: "Resolved third",
    } as unknown as ResolvedInline;

    mockedInline
      .mockReturnValueOnce(first)
      .mockReturnValueOnce(second)
      .mockReturnValueOnce(third);

    const result = resolveParagraphComponentContentAppRenderContext({
      content: createContent(),
    });

    expect(result.content).toEqual([first, second, third]);
    expect(result.content[0]).toBe(first);
    expect(result.content[1]).toBe(second);
    expect(result.content[2]).toBe(third);
  });

  it("preserves paragraph properties other than inline content", () => {
    const content = {
      ...createContent(),
      className: "editorial-introduction",
    } as unknown as Content;

    const result = resolveParagraphComponentContentAppRenderContext({
      content,
    });

    expect(result).toEqual({
      ...content,
      content: result.content,
    });
  });

  it("creates a new paragraph and inline collection", () => {
    const content = createContent();

    const result = resolveParagraphComponentContentAppRenderContext({
      content,
    });

    expect(result).not.toBe(content);
    expect(result.content).not.toBe(content.content);
  });

  it("supports empty paragraphs", () => {
    const content = createContent([]);

    const result = resolveParagraphComponentContentAppRenderContext({
      content,
    });

    expect(result.content).toEqual([]);
    expect(mockedInline).not.toHaveBeenCalled();
  });

  it("supports paragraphs containing only text", () => {
    const content = createContent([
      createInline("text", "An uninterrupted observation"),
    ]);

    const result = resolveParagraphComponentContentAppRenderContext({
      content,
    });

    expect(result.content).toHaveLength(1);
    expect(result.content[0]?.kind).toBe("text");
    expect(mockedInline).toHaveBeenCalledTimes(1);
  });

  it("propagates errors from inline resolution", () => {
    const error = new Error("Inline content resolution failed");

    mockedInline.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveParagraphComponentContentAppRenderContext({
        content: createContent(),
      }),
    ).toThrow(error);
  });

  it("does not mutate the original paragraph", () => {
    const content = createContent();
    const originalInline = content.content;

    const result = resolveParagraphComponentContentAppRenderContext({
      content,
    });

    expect(content.content).toBe(originalInline);
    expect(result.content).not.toBe(originalInline);
  });

  it("accepts frozen paragraph content", () => {
    const content = Object.freeze(createContent());

    expect(() =>
      resolveParagraphComponentContentAppRenderContext({
        content,
      }),
    ).not.toThrow();
  });
});
