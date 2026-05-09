// src/rendering/body-content/block/list.block.renderer.test.ts

import type { AppRenderContextListBlock } from "@shared-types/page-content/block/list/app-render-context.list.block.types";

import { renderListBlock } from "@rendering/body-content/block/list.block.renderer";
import { renderBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.helper";
import { renderInlineContent } from "@rendering/body-content/inline/inline.renderer";

jest.mock("@rendering/body-content/block/helpers/flow.block.helper", () => ({
  renderBlockFlowClass: jest.fn(),
}));

jest.mock("@rendering/body-content/inline/inline.renderer", () => ({
  renderInlineContent: jest.fn(),
}));

const createModule = (
  overrides: Partial<AppRenderContextListBlock> = {},
): AppRenderContextListBlock =>
  ({
    kind: "list",
    style: "unordered",
    flow: "content",
    items: [
      {
        content: [{ kind: "text", value: "First item" }],
      },
      {
        content: [{ kind: "text", value: "Second item" }],
      },
    ],
    ...overrides,
  }) as AppRenderContextListBlock;

describe("renderListBlock", () => {
  const mockedRenderBlockFlowClass = jest.mocked(renderBlockFlowClass);
  const mockedRenderInlineContent = jest.mocked(renderInlineContent);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderBlockFlowClass.mockReturnValue("l-content");

    mockedRenderInlineContent
      .mockReturnValueOnce("First item")
      .mockReturnValueOnce("Second item");
  });

  it("renders an unordered list block", () => {
    expect(renderListBlock(createModule())).toBe(
      `<ul class="m-contentBlock m-contentBlock--list l-content"><li>First item</li><li>Second item</li></ul>`,
    );

    expect(mockedRenderBlockFlowClass).toHaveBeenCalledWith("content");
    expect(mockedRenderInlineContent).toHaveBeenNthCalledWith(
      1,
      createModule().items[0].content,
    );
    expect(mockedRenderInlineContent).toHaveBeenNthCalledWith(
      2,
      createModule().items[1].content,
    );
  });

  it("renders an ordered list block", () => {
    mockedRenderInlineContent
      .mockReset()
      .mockReturnValueOnce("First item")
      .mockReturnValueOnce("Second item");

    expect(
      renderListBlock(
        createModule({
          style: "ordered",
        }),
      ),
    ).toBe(
      `<ol class="m-contentBlock m-contentBlock--list l-content"><li>First item</li><li>Second item</li></ol>`,
    );
  });

  it("renders an empty list block", () => {
    expect(
      renderListBlock(
        createModule({
          items: [],
        }),
      ),
    ).toBe(`<ul class="m-contentBlock m-contentBlock--list l-content"></ul>`);

    expect(mockedRenderInlineContent).not.toHaveBeenCalled();
  });
});
