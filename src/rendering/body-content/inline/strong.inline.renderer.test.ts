// src/rendering/body-content/inline/strong.inline.renderer.test.ts

import type { AppRenderContextStrongInline } from "@shared-types/page-content/inline/strong/app-render-context.strong.inline-content.types";

import { renderStrongInlineContent } from "@rendering/body-content/inline/strong.inline.renderer";
import { renderInlineContent } from "@rendering/body-content/inline/inline.renderer";

jest.mock("@rendering/body-content/inline/inline.renderer", () => ({
  renderInlineContent: jest.fn(),
}));

describe("renderStrongInlineContent", () => {
  const mockedRenderInlineContent = jest.mocked(renderInlineContent);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders strong inline content", () => {
    mockedRenderInlineContent.mockReturnValue(`Important content`);

    const item = {
      kind: "strong",
      content: [
        {
          kind: "text",
          value: "Important content",
        },
      ],
    } as unknown as AppRenderContextStrongInline;

    expect(renderStrongInlineContent(item)).toBe(
      `<strong>Important content</strong>`,
    );

    expect(mockedRenderInlineContent).toHaveBeenCalledWith(item.content);
  });

  it("renders empty strong inline content", () => {
    mockedRenderInlineContent.mockReturnValue("");

    const item = {
      kind: "strong",
      content: [],
    } as unknown as AppRenderContextStrongInline;

    expect(renderStrongInlineContent(item)).toBe(`<strong></strong>`);

    expect(mockedRenderInlineContent).toHaveBeenCalledWith(item.content);
  });
});
