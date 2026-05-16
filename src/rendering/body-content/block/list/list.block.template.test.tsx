// src/rendering/body-content/block/list/list.block.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextListBlock } from "@shared-types/page-content/block/list/app-render-context.list.block.types";

import { ListBlockTemplate } from "@rendering/body-content/block/list/list.block.template";

const block = (
  overrides: Partial<AppRenderContextListBlock> = {},
): AppRenderContextListBlock =>
  ({
    kind: "list",
    flow: "content",
    style: "unordered",
    items: [
      {
        content: [{ kind: "text", value: "First item" }],
      },
      {
        content: [
          { kind: "text", value: "Second " },
          { kind: "strong", content: [{ kind: "text", value: "item" }] },
        ],
      },
    ],
    ...overrides,
  }) as AppRenderContextListBlock;

describe("ListBlockTemplate", () => {
  it("renders an unordered list", () => {
    expect(renderToStaticMarkup(<ListBlockTemplate block={block()} />)).toBe(
      '<ul class="m-contentBlock m-contentBlock--list l-content"><li>First item</li><li>Second <strong>item</strong></li></ul>',
    );
  });

  it("renders an ordered list", () => {
    expect(
      renderToStaticMarkup(
        <ListBlockTemplate block={block({ style: "ordered" })} />,
      ),
    ).toBe(
      '<ol class="m-contentBlock m-contentBlock--list l-content"><li>First item</li><li>Second <strong>item</strong></li></ol>',
    );
  });

  it("renders breakout flow", () => {
    const html = renderToStaticMarkup(
      <ListBlockTemplate block={block({ flow: "breakout" })} />,
    );

    expect(html).toContain("m-contentBlock--breakout");
  });
});
