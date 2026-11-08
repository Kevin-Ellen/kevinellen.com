// src/app/life-cycle/app-resolve/resolvers/content/inline/inline.content.resolver.app-resolve.test.ts

import { resolveContentInlineAppResolve } from "./inline.content.resolver.app-resolve";

import { resolveTextInlineContentAppResolve } from "./text/text.inline.content.resolver.app-resolve";
import { resolveLinkInlineContentAppResolve } from "./link/link.inline.content.resolver.app-resolve";

jest.mock("./text/text.inline.content.resolver.app-resolve", () => ({
  resolveTextInlineContentAppResolve: jest.fn(),
}));

jest.mock("./link/link.inline.content.resolver.app-resolve", () => ({
  resolveLinkInlineContentAppResolve: jest.fn(),
}));

const mockedText = jest.mocked(resolveTextInlineContentAppResolve);
const mockedLink = jest.mocked(resolveLinkInlineContentAppResolve);

type Input = Parameters<typeof resolveContentInlineAppResolve>[0];
type Content = Input["content"];
type ResolvedContent = ReturnType<typeof resolveContentInlineAppResolve>;

describe("Inline content AppResolve resolver", () => {
  const contentRegistry = {
    bySlug: {},
    errorsByStatus: {},
  } as Input["contentRegistry"];

  const textContent = {
    kind: "text",
    text: "A quiet morning in Epping Forest.",
  } as unknown as Extract<Content, { kind: "text" }>;

  const linkContent = {
    kind: "link",
    link: {
      kind: "internal",
      pageId: "about",
      label: "About",
    },
  } as unknown as Extract<Content, { kind: "link" }>;

  const resolvedText = {
    kind: "text",
    text: "A quiet morning in Epping Forest.",
  } as unknown as ReturnType<typeof resolveTextInlineContentAppResolve>;

  const resolvedLink = {
    kind: "link",
    link: {
      href: "/about",
      label: "About",
    },
  } as unknown as ReturnType<typeof resolveLinkInlineContentAppResolve>;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedText.mockReturnValue(resolvedText);
    mockedLink.mockReturnValue(resolvedLink);
  });

  it("dispatches text content to the text resolver", () => {
    const result = resolveContentInlineAppResolve({
      content: textContent,
      contentRegistry,
    });

    expect(mockedText).toHaveBeenCalledTimes(1);
    expect(mockedText).toHaveBeenCalledWith({
      content: textContent,
      contentRegistry,
    });

    expect(mockedLink).not.toHaveBeenCalled();
    expect(result).toBe(resolvedText);
  });

  it("dispatches link content to the link resolver", () => {
    const result = resolveContentInlineAppResolve({
      content: linkContent,
      contentRegistry,
    });

    expect(mockedLink).toHaveBeenCalledTimes(1);
    expect(mockedLink).toHaveBeenCalledWith({
      content: linkContent,
      contentRegistry,
    });

    expect(mockedText).not.toHaveBeenCalled();
    expect(result).toBe(resolvedLink);
  });

  it("preserves the exact content registry reference", () => {
    resolveContentInlineAppResolve({
      content: linkContent,
      contentRegistry,
    });

    expect(mockedLink).toHaveBeenCalledWith(
      expect.objectContaining({
        contentRegistry,
      }),
    );
  });

  it("returns the exact result from the selected resolver", () => {
    const customResult = {
      kind: "text",
      text: "Different text",
    } as unknown as ResolvedContent;

    mockedText.mockReturnValue(
      customResult as ReturnType<typeof resolveTextInlineContentAppResolve>,
    );

    const result = resolveContentInlineAppResolve({
      content: textContent,
      contentRegistry,
    });

    expect(result).toBe(customResult);
  });

  it("propagates text resolver failures", () => {
    const error = new Error("Text resolution failed");

    mockedText.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveContentInlineAppResolve({
        content: textContent,
        contentRegistry,
      }),
    ).toThrow(error);

    expect(mockedLink).not.toHaveBeenCalled();
  });

  it("propagates link resolver failures", () => {
    const error = new Error("Link resolution failed");

    mockedLink.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveContentInlineAppResolve({
        content: linkContent,
        contentRegistry,
      }),
    ).toThrow(error);

    expect(mockedText).not.toHaveBeenCalled();
  });

  it("does not mutate the original inline content", () => {
    const content = Object.freeze(textContent);

    resolveContentInlineAppResolve({
      content,
      contentRegistry,
    });

    expect(content).toBe(textContent);
    expect(content.kind).toBe("text");
  });
});
