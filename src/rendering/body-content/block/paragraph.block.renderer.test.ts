// src/rendering/body-content/block/paragraph.block.renderer.test.ts

import type { AppRenderContextBlock } from "@shared-types/page-content/block/app-render-context.block.types";

import { renderParagraphBlock } from "@rendering/body-content/block/paragraph.block.renderer";
import { renderBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.helper";
import { renderInlineContent } from "@rendering/body-content/inline/inline.renderer";

jest.mock("@rendering/body-content/block/helpers/flow.block.helper", () => ({
  renderBlockFlowClass: jest.fn(),
}));

jest.mock("@rendering/body-content/inline/inline.renderer", () => ({
  renderInlineContent: jest.fn(),
}));

type ParagraphBlock = Extract<AppRenderContextBlock, { kind: "paragraph" }>;

const createModule = (
  overrides: Partial<ParagraphBlock> = {},
): ParagraphBlock =>
  ({
    kind: "paragraph",
    flow: "content",
    content: [{ kind: "text", value: "Hello paragraph." }],
    ...overrides,
  }) as ParagraphBlock;

describe("renderParagraphBlock", () => {
  const mockedRenderBlockFlowClass = jest.mocked(renderBlockFlowClass);
  const mockedRenderInlineContent = jest.mocked(renderInlineContent);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderBlockFlowClass.mockReturnValue("l-content");
    mockedRenderInlineContent.mockReturnValue("Hello paragraph.");
  });

  it("renders paragraph block", () => {
    expect(renderParagraphBlock(createModule())).toBe(
      `<p class="m-contentBlock m-contentBlock--paragraph l-content">Hello paragraph.</p>`,
    );

    expect(mockedRenderBlockFlowClass).toHaveBeenCalledWith("content");
    expect(mockedRenderInlineContent).toHaveBeenCalledWith(
      createModule().content,
    );
  });

  it("renders empty inline content", () => {
    mockedRenderInlineContent.mockReturnValue("");

    expect(renderParagraphBlock(createModule())).toBe(
      `<p class="m-contentBlock m-contentBlock--paragraph l-content"></p>`,
    );
  });
});
