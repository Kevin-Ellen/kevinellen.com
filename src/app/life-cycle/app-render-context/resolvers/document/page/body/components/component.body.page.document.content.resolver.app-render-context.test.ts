// src/app/life-cycle/app-render-context/resolvers/document/page/body/components/component.body.page.document.content.resolver.app-render-context.test.ts

import { resolveComponentContentAppRenderContext } from "./component.body.page.document.content.resolver.app-render-context";

import { resolveParagraphComponentContentAppRenderContext } from "./paragraph/paragraph.component.body.page.document.content.resolver.app-render-context";
import { resolveListComponentContentAppRenderContext } from "./list/list.component.body.page.document.content.resolver.app-render-context";
import { resolvePhotoComponentContentAppRenderContext } from "./photo/photo.component.body.page.document.content.resolver.app-render-context";
import { resolveEditorialPhotoComponentContentAppRenderContext } from "./editorial-photo/editorial-photo.component.body.page.document.content.resolver.app-render-context";
import { resolveRichListComponentContentAppRenderContext } from "./rich-list/rich-list.component.body.page.document.content.resolver.app-render-context";

jest.mock(
  "./paragraph/paragraph.component.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveParagraphComponentContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "./list/list.component.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveListComponentContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "./photo/photo.component.body.page.document.content.resolver.app-render-context",
  () => ({
    resolvePhotoComponentContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "./editorial-photo/editorial-photo.component.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveEditorialPhotoComponentContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "./rich-list/rich-list.component.body.page.document.content.resolver.app-render-context",
  () => ({
    resolveRichListComponentContentAppRenderContext: jest.fn(),
  }),
);

type Content = Parameters<
  typeof resolveComponentContentAppRenderContext
>[0]["content"];

type Kind = Content["kind"];

type ResolvedContent = ReturnType<
  typeof resolveComponentContentAppRenderContext
>;

const resolvers: Record<Kind, jest.Mock> = {
  paragraph: resolveParagraphComponentContentAppRenderContext as jest.Mock,

  list: resolveListComponentContentAppRenderContext as jest.Mock,

  photo: resolvePhotoComponentContentAppRenderContext as jest.Mock,

  editorialPhoto:
    resolveEditorialPhotoComponentContentAppRenderContext as jest.Mock,

  richList: resolveRichListComponentContentAppRenderContext as jest.Mock,
};

describe("Component content AppRenderContext dispatcher", () => {
  const kinds = Object.keys(resolvers) as Kind[];

  const createContent = (kind: Kind): Content => ({ kind }) as Content;

  beforeEach(() => {
    jest.resetAllMocks();

    for (const kind of kinds) {
      resolvers[kind].mockReturnValue({ kind });
    }
  });

  it.each(kinds)("dispatches %s to the correct resolver", (kind) => {
    const content = createContent(kind);

    const result = resolveComponentContentAppRenderContext({
      content,
    });

    expect(resolvers[kind]).toHaveBeenCalledTimes(1);
    expect(resolvers[kind]).toHaveBeenCalledWith({ content });
    expect(result.kind).toBe(kind);

    for (const otherKind of kinds) {
      if (otherKind !== kind) {
        expect(resolvers[otherKind]).not.toHaveBeenCalled();
      }
    }
  });

  it.each(kinds)("preserves the exact resolved result for %s", (kind) => {
    const content = createContent(kind);

    const expected = {
      kind,
      marker: "resolved",
    } as unknown as ResolvedContent;

    resolvers[kind].mockReturnValue(expected);

    const result = resolveComponentContentAppRenderContext({
      content,
    });

    expect(result).toBe(expected);
  });

  it.each(kinds)("propagates errors from the %s resolver", (kind) => {
    const error = new Error(`${kind} resolution failed`);

    resolvers[kind].mockImplementation(() => {
      throw error;
    });

    expect(() =>
      resolveComponentContentAppRenderContext({
        content: createContent(kind),
      }),
    ).toThrow(error);
  });

  it("preserves the original content reference when forwarding", () => {
    const content = Object.freeze(createContent("paragraph"));

    const resolved = {
      kind: "paragraph",
    } as unknown as ResolvedContent;

    resolvers.paragraph.mockReturnValue(resolved);

    resolveComponentContentAppRenderContext({ content });

    expect(resolvers.paragraph.mock.calls[0]?.[0].content).toBe(content);
  });
});
