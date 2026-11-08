// src/app/life-cycle/app-resolve/resolvers/content/components/paragraph/paragraph.component.content.resolver.app-resolve.test.ts

import { resolveParagraphComponentContentAppResolve } from "./paragraph.component.content.resolver.app-resolve";

import { resolveContentInlineAppResolve } from "../../inline/inline.content.resolver.app-resolve";

jest.mock("../../inline/inline.content.resolver.app-resolve", () => ({
  resolveContentInlineAppResolve: jest.fn(),
}));

const mockedInline = jest.mocked(resolveContentInlineAppResolve);

type Input = Parameters<typeof resolveParagraphComponentContentAppResolve>[0];
type Content = Input["content"];
type Inline = Content["content"][number];
type ResolvedInline = ReturnType<typeof resolveContentInlineAppResolve>;

describe("Paragraph component AppResolve resolver", () => {
  const contentRegistry = {
    bySlug: {},
    errorsByStatus: {},
  } as Input["contentRegistry"];

  const createInline = (text: string): Inline =>
    ({
      kind: "text",
      text,
    }) as unknown as Inline;

  const createContent = (
    inline: readonly Inline[] = [createInline("First"), createInline("Second")],
  ): Content =>
    ({
      kind: "paragraph",
      content: inline,
    }) as unknown as Content;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedInline.mockImplementation(
      ({ content }) => content as unknown as ResolvedInline,
    );
  });

  it("resolves every inline entry in order", () => {
    const content = createContent();

    const result = resolveParagraphComponentContentAppResolve({
      content,
      contentRegistry,
    });

    expect(mockedInline).toHaveBeenCalledTimes(2);
    expect(result.content).toHaveLength(2);

    content.content.forEach((inline, index) => {
      expect(mockedInline).toHaveBeenNthCalledWith(index + 1, {
        content: inline,
        contentRegistry,
      });
    });
  });

  it("preserves returned inline references", () => {
    const resolved = {
      kind: "text",
      text: "Resolved",
    } as unknown as ResolvedInline;

    mockedInline.mockReturnValue(resolved);

    const result = resolveParagraphComponentContentAppResolve({
      content: createContent([createInline("Original")]),
      contentRegistry,
    });

    expect(result.content[0]).toBe(resolved);
  });

  it("supports an empty paragraph", () => {
    const result = resolveParagraphComponentContentAppResolve({
      content: createContent([]),
      contentRegistry,
    });

    expect(result.content).toEqual([]);
    expect(mockedInline).not.toHaveBeenCalled();
  });

  it("creates a new component and inline collection", () => {
    const content = createContent();

    const result = resolveParagraphComponentContentAppResolve({
      content,
      contentRegistry,
    });

    expect(result).not.toBe(content);
    expect(result.content).not.toBe(content.content);
  });

  it("does not mutate the original content", () => {
    const content = Object.freeze(createContent());

    resolveParagraphComponentContentAppResolve({
      content,
      contentRegistry,
    });

    expect(content.content).toHaveLength(2);
  });

  it("propagates inline resolution failures", () => {
    const error = new Error("Inline resolution failed");

    mockedInline.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveParagraphComponentContentAppResolve({
        content: createContent(),
        contentRegistry,
      }),
    ).toThrow(error);
  });
});
