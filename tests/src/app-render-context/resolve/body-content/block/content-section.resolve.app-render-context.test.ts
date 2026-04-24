// tests/src/app-render-context/resolve/body-content/block/content-section.resolve.app-render-context.test.ts

import {
  resolveContentSectionBlockContentModuleAppRenderContext,
  resolveContentSectionHeadingBlockContentModuleAppRenderContext,
} from "@app-render-context/resolve/body-content/block/content-section.resolve.app-render-context";
import { resolveBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/block.resolve.app-render-context";

import type {
  AppContextContentSectionBlockContentModule,
  AppContextContentSectionHeadingBlockContentModule,
} from "@shared-types/page-content/block/content-section/app-context.content-section.block.page-content.types";

import type { AppContext } from "@app-context/class.app-context";

jest.mock(
  "@app-render-context/resolve/body-content/block/block.resolve.app-render-context",
  () => ({
    resolveBlockContentModuleAppRenderContext: jest.fn(),
  }),
);

describe("content-section block resolvers", () => {
  const appContext = {} as AppContext;

  const heading = {
    text: "Section heading",
    level: 2,
    visuallyHidden: false,
  } as unknown as AppContextContentSectionHeadingBlockContentModule;

  it("returns the heading unchanged", () => {
    const heading = {
      text: "Section heading",
      level: 2,
      visuallyHidden: false,
    } as const;

    const result =
      resolveContentSectionHeadingBlockContentModuleAppRenderContext(
        appContext,
        heading,
      );

    expect(result).toBe(heading);
  });

  it("resolves child modules inside a content section", () => {
    const childModule = {
      kind: "paragraph",
      content: [],
    };

    const resolvedChildModule = {
      kind: "paragraph",
      content: [{ kind: "text", value: "Resolved" }],
    };

    const module = {
      kind: "contentSection",
      heading: {
        text: "Section heading",
        level: 2,
        visuallyHidden: false,
      },
      modules: [childModule],
    } as unknown as AppContextContentSectionBlockContentModule;

    jest
      .mocked(resolveBlockContentModuleAppRenderContext)
      .mockReturnValue(resolvedChildModule as never);

    const result = resolveContentSectionBlockContentModuleAppRenderContext(
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
