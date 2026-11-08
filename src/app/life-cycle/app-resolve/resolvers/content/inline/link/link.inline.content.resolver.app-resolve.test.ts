// src/app/life-cycle/app-resolve/resolvers/content/inline/link/link.inline.content.resolver.app-resolve.test.ts

import { resolveLinkInlineContentAppResolve } from "./link.inline.content.resolver.app-resolve";

import { resolveLinkAppResolve } from "../../../primitives/link/link.primitive.resolver.app-resolve";

jest.mock(
  "../../../primitives/link/link.primitive.resolver.app-resolve",
  () => ({
    resolveLinkAppResolve: jest.fn(),
  }),
);

const mockedResolveLink = jest.mocked(resolveLinkAppResolve);

type Input = Parameters<typeof resolveLinkInlineContentAppResolve>[0];
type Content = Input["content"];
type ResolvedLink = ReturnType<typeof resolveLinkAppResolve>;

describe("Link inline content AppResolve resolver", () => {
  const contentRegistry = {
    bySlug: {},
    errorsByStatus: {},
  } as Input["contentRegistry"];

  const createContent = (): Content =>
    ({
      kind: "link",
      link: {
        kind: "internal",
        pageId: "about",
        label: "About",
      },
    }) as unknown as Content;

  const resolvedLink = {
    href: "/about",
    label: "About",
  } as ResolvedLink;

  beforeEach(() => {
    jest.resetAllMocks();
    mockedResolveLink.mockReturnValue(resolvedLink);
  });

  it("passes the original link and registry to the primitive resolver", () => {
    const content = createContent();

    resolveLinkInlineContentAppResolve({
      content,
      contentRegistry,
    });

    expect(mockedResolveLink).toHaveBeenCalledTimes(1);
    expect(mockedResolveLink).toHaveBeenCalledWith({
      link: content.link,
      registry: contentRegistry,
    });
  });

  it("replaces the initialised link with the resolved link", () => {
    const content = createContent();

    const result = resolveLinkInlineContentAppResolve({
      content,
      contentRegistry,
    });

    expect(result.link).toBe(resolvedLink);
  });

  it("preserves the surrounding inline content properties", () => {
    const content = createContent();

    const result = resolveLinkInlineContentAppResolve({
      content,
      contentRegistry,
    });

    expect(result).toEqual({
      ...content,
      link: resolvedLink,
    });
  });

  it("returns a new content object", () => {
    const content = createContent();

    const result = resolveLinkInlineContentAppResolve({
      content,
      contentRegistry,
    });

    expect(result).not.toBe(content);
  });

  it("does not mutate the original inline link", () => {
    const content = Object.freeze(createContent());
    const originalLink = content.link;

    resolveLinkInlineContentAppResolve({
      content,
      contentRegistry,
    });

    expect(content.link).toBe(originalLink);
  });

  it("supports external links", () => {
    const content = {
      ...createContent(),
      link: {
        kind: "external",
        href: "https://example.com",
      },
    } as unknown as Content;

    const externalResolvedLink = {
      href: "https://example.com",
      label: "External website",
      target: "_blank",
      rel: ["noopener"],
    } as unknown as ResolvedLink;

    mockedResolveLink.mockReturnValue(externalResolvedLink);

    const result = resolveLinkInlineContentAppResolve({
      content,
      contentRegistry,
    });

    expect(mockedResolveLink).toHaveBeenCalledWith({
      link: content.link,
      registry: contentRegistry,
    });

    expect(result.link).toBe(externalResolvedLink);
  });

  it("propagates link resolution errors", () => {
    const error = new Error("Unable to resolve internal link: missing");

    mockedResolveLink.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveLinkInlineContentAppResolve({
        content: createContent(),
        contentRegistry,
      }),
    ).toThrow(error);
  });
});
