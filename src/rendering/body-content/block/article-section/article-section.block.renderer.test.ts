// src/rendering/body-content/block/article-section/article-section.block.renderer.test.ts

import type { AppRenderContextArticleSectionBlock } from "@shared-types/page-content/block/article-section/app-render-context.article-section.block.types";

import { renderArticleSectionBlock } from "@rendering/body-content/block/article-section/article-section.block.renderer";
import { renderBlock } from "@rendering/body-content/block/block.renderer";
import { renderHeading } from "@rendering/shared/heading.shared.renderer";

jest.mock("@rendering/body-content/block/block.renderer", () => ({
  renderBlock: jest.fn(),
}));

jest.mock("@rendering/shared/heading.shared.renderer", () => ({
  renderHeading: jest.fn(),
}));

describe("renderArticleSectionBlock", () => {
  const mockedRenderBlock = jest.mocked(renderBlock);
  const mockedRenderHeading = jest.mocked(renderHeading);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders article section heading and child modules", () => {
    mockedRenderHeading.mockReturnValue(
      `<h2 class="l-content">Birds Of Essex</h2>`,
    );

    mockedRenderBlock
      .mockReturnValueOnce(`<p>First block</p>`)
      .mockReturnValueOnce(`<blockquote>Second block</blockquote>`);

    const module = {
      kind: "articleSection",
      heading: {
        level: 2,
        text: "Birds Of Essex",
      },
      modules: [{ kind: "paragraph" }, { kind: "quote" }],
    } as unknown as AppRenderContextArticleSectionBlock;

    expect(renderArticleSectionBlock(module)).toBe(
      `<section class="m-articleSection"><h2 class="l-content">Birds Of Essex</h2><p>First block</p><blockquote>Second block</blockquote></section>`,
    );

    expect(mockedRenderHeading).toHaveBeenCalledWith(module.heading, {
      className: "l-content",
    });

    expect(mockedRenderBlock).toHaveBeenCalledTimes(2);

    expect(mockedRenderBlock).toHaveBeenNthCalledWith(
      1,
      module.modules[0],
      0,
      module.modules,
    );

    expect(mockedRenderBlock).toHaveBeenNthCalledWith(
      2,
      module.modules[1],
      1,
      module.modules,
    );
  });

  it("renders an article section without child modules", () => {
    mockedRenderHeading.mockReturnValue(
      `<h2 class="l-content">Empty Section</h2>`,
    );

    const module = {
      kind: "articleSection",
      heading: {
        level: 2,
        text: "Empty Section",
      },
      modules: [],
    } as unknown as AppRenderContextArticleSectionBlock;

    expect(renderArticleSectionBlock(module)).toBe(
      `<section class="m-articleSection"><h2 class="l-content">Empty Section</h2></section>`,
    );

    expect(mockedRenderBlock).not.toHaveBeenCalled();
  });
});
