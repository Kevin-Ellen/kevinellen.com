// src/rendering/body-content/inline/emphasis.inline.renderer.test.ts

import type { AppRenderContextEmphasisInline } from "@shared-types/page-content/inline/emphasis/app-render-context.emphasis.inline-content.types";

import { renderEmphasisInline } from "@rendering/body-content/inline/emphasis.inline.renderer";
import { renderInlineContent } from "@rendering/body-content/inline/inline.renderer";

jest.mock("@rendering/body-content/inline/inline.renderer", () => ({
  renderInlineContent: jest.fn(),
}));

describe("renderEmphasisInline", () => {
  const mockedRenderInlineContent = jest.mocked(renderInlineContent);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders emphasis inline content", () => {
    mockedRenderInlineContent.mockReturnValue(`Highlighted content`);

    const item = {
      kind: "emphasis",
      content: [
        {
          kind: "text",
          value: "Highlighted content",
        },
      ],
    } as unknown as AppRenderContextEmphasisInline;

    expect(renderEmphasisInline(item)).toBe(`<em>Highlighted content</em>`);

    expect(mockedRenderInlineContent).toHaveBeenCalledWith(item.content);
  });

  it("renders empty emphasis inline content", () => {
    mockedRenderInlineContent.mockReturnValue("");

    const item = {
      kind: "emphasis",
      content: [],
    } as unknown as AppRenderContextEmphasisInline;

    expect(renderEmphasisInline(item)).toBe(`<em></em>`);

    expect(mockedRenderInlineContent).toHaveBeenCalledWith(item.content);
  });
});
