// src/app/life-cycle/app-render-context/resolvers/document/page/body/inline/inline.body.page.document.content.resolver.app-render-context.test.ts

import { resolveContentInlineAppRenderContext } from "./inline.body.page.document.content.resolver.app-render-context";

import { resolveTextInlineContentAppRenderContext } from "./text/text.inline.body.page.document.content.resolver.app-render-context";
import { resolveLinkInlineContentAppRenderContext } from "./link/link.inline.body.page.document.content.resolver.app-render-context";

jest.mock(
  "./text/text.inline.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveTextInlineContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "./link/link.inline.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveLinkInlineContentAppRenderContext: jest.fn(),
  }),
);

const mockedText = jest.mocked(resolveTextInlineContentAppRenderContext);
const mockedLink = jest.mocked(resolveLinkInlineContentAppRenderContext);

type Content = Parameters<
  typeof resolveContentInlineAppRenderContext
>[0]["content"];

type ResolvedContent = ReturnType<typeof resolveContentInlineAppRenderContext>;

describe("Inline content AppRenderContext dispatcher", () => {
  const createContent = (
    kind: Content["kind"],
    overrides: Record<string, unknown> = {},
  ): Content =>
    ({
      kind,
      ...overrides,
    }) as unknown as Content;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("dispatches text content to the text resolver", () => {
    const content = createContent("text", {
      value: "A morning in Epping Forest",
    });

    const resolved = {
      kind: "text",
      value: "Resolved text",
    } as unknown as ResolvedContent;

    mockedText.mockReturnValue(resolved as ReturnType<typeof mockedText>);

    const result = resolveContentInlineAppRenderContext({ content });

    expect(mockedText).toHaveBeenCalledTimes(1);
    expect(mockedText).toHaveBeenCalledWith({ content });
    expect(mockedLink).not.toHaveBeenCalled();
    expect(result).toBe(resolved);
  });

  it("dispatches link content to the link resolver", () => {
    const content = createContent("link", {
      label: "Journals",
      href: "/journals",
    });

    const resolved = {
      kind: "link",
      label: "Resolved link",
      href: "/journals",
    } as unknown as ResolvedContent;

    mockedLink.mockReturnValue(resolved as ReturnType<typeof mockedLink>);

    const result = resolveContentInlineAppRenderContext({ content });

    expect(mockedLink).toHaveBeenCalledTimes(1);
    expect(mockedLink).toHaveBeenCalledWith({ content });
    expect(mockedText).not.toHaveBeenCalled();
    expect(result).toBe(resolved);
  });

  it("propagates a text resolver error", () => {
    const error = new Error("Text resolution failed");

    mockedText.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveContentInlineAppRenderContext({
        content: createContent("text"),
      }),
    ).toThrow(error);
  });

  it("propagates a link resolver error", () => {
    const error = new Error("Link resolution failed");

    mockedLink.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveContentInlineAppRenderContext({
        content: createContent("link"),
      }),
    ).toThrow(error);
  });

  it("preserves the original input reference when forwarded", () => {
    const content = Object.freeze(
      createContent("text", {
        value: "Woodland observations",
      }),
    );

    mockedText.mockReturnValue(content as ReturnType<typeof mockedText>);

    const result = resolveContentInlineAppRenderContext({ content });

    expect(mockedText.mock.calls[0]?.[0].content).toBe(content);
    expect(result).toBe(content);
  });
});
