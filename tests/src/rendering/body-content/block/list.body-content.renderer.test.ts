// tests/src/rendering/body-content/block/list.body-content.renderer.test.ts

import { renderListBlockContentModule } from "@rendering/body-content/block/list.body-content.renderer";
import { renderInlineContent } from "@rendering/body-content/inline/inline-content.body-content.renderer";

jest.mock(
  "@rendering/body-content/inline/inline-content.body-content.renderer",
  () => ({
    renderInlineContent: jest.fn(),
  }),
);

describe("renderListBlockContentModule", () => {
  const mockedRenderInlineContent = jest.mocked(renderInlineContent);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders unordered lists by default", () => {
    mockedRenderInlineContent.mockReturnValue("Rendered item");

    const html = renderListBlockContentModule({
      kind: "list",
      style: "unordered",
      flow: "content",
      items: [
        {
          content: [{ kind: "text", value: "Item" }],
        },
      ],
    } as never);

    expect(html).toContain(
      `<ul class="m-contentBlock m-contentBlock--list l-content">`,
    );
    expect(html).toContain(`<li>Rendered item</li>`);
    expect(html).toContain(`</ul>`);
  });

  it("renders ordered lists", () => {
    mockedRenderInlineContent.mockReturnValue("Rendered item");

    const html = renderListBlockContentModule({
      kind: "list",
      style: "ordered",
      flow: "breakout",
      items: [
        {
          content: [{ kind: "text", value: "Item" }],
        },
      ],
    } as never);

    expect(html).toContain(
      `<ol class="m-contentBlock m-contentBlock--list m-contentBlock--breakout">`,
    );
    expect(html).toContain(`</ol>`);
  });

  it("passes item inline content to the inline renderer", () => {
    const content = [{ kind: "text", value: "Item" }];

    mockedRenderInlineContent.mockReturnValue("Rendered item");

    renderListBlockContentModule({
      kind: "list",
      style: "unordered",
      flow: "content",
      items: [{ content }],
    } as never);

    expect(mockedRenderInlineContent).toHaveBeenCalledWith(content);
  });
});
