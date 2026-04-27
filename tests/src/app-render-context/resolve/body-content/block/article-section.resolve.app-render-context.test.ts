// tests/src/app-render-context/resolve/body-content/block/article-section.resolve.app-render-context.test.ts

import {
  resolveArticleSectionBlockContentModuleAppRenderContext,
  resolveArticleSectionHeadingBlockContentModuleAppRenderContext,
} from "@app-render-context/resolve/body-content/block/article-section.resolve.app-render-context";
import { resolveBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/block.resolve.app-render-context";

import type {
  AppContextArticleSectionBlockContentModule,
  AppContextArticleSectionHeadingBlockContentModule,
} from "@shared-types/page-content/block/article-section/app-context.article-section.block.page-content.types";

import type { AppContext } from "@app-context/class.app-context";

jest.mock(
  "@app-render-context/resolve/body-content/block/block.resolve.app-render-context",
  () => ({
    resolveBlockContentModuleAppRenderContext: jest.fn(),
  }),
);

describe("article-section block resolvers", () => {
  const appContext = {} as AppContext;

  it("returns the heading unchanged", () => {
    const heading = {
      text: "Section heading",
      level: 2,
      visuallyHidden: false,
    } as AppContextArticleSectionHeadingBlockContentModule;

    const result =
      resolveArticleSectionHeadingBlockContentModuleAppRenderContext(
        appContext,
        heading,
      );

    expect(result).toBe(heading);
  });

  it("resolves child modules inside an article section", () => {
    const childModule = {
      kind: "paragraph",
      flow: "content",
      content: [],
    } as never;

    const resolvedChildModule = {
      kind: "paragraph",
      flow: "content",
      content: [{ kind: "text", value: "Resolved" }],
    } as never;

    const module = {
      kind: "articleSection",
      heading: {
        text: "Section heading",
        level: 2,
        visuallyHidden: false,
      },
      modules: [childModule],
    } as AppContextArticleSectionBlockContentModule;

    jest
      .mocked(resolveBlockContentModuleAppRenderContext)
      .mockReturnValue(resolvedChildModule);

    const result = resolveArticleSectionBlockContentModuleAppRenderContext(
      appContext,
      module,
    );

    expect(resolveBlockContentModuleAppRenderContext).toHaveBeenCalledWith(
      appContext,
      childModule,
    );

    expect(result).toEqual({
      ...module,
      heading: module.heading,
      modules: [resolvedChildModule],
    });
  });
});
