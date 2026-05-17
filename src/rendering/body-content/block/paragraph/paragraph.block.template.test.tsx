// src/rendering/body-content/block/paragraph/paragraph.block.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextBlock } from "@shared-types/page-content/block/app-render-context.block.types";

import { ParagraphBlockTemplate } from "@rendering/body-content/block/paragraph/paragraph.block.template";

type ParagraphBlock = Extract<AppRenderContextBlock, { kind: "paragraph" }>;

const block = (overrides: Partial<ParagraphBlock> = {}): ParagraphBlock =>
  ({
    kind: "paragraph",
    flow: "content",
    content: [
      { kind: "text", value: "A paragraph with " },
      { kind: "strong", content: [{ kind: "text", value: "strong text" }] },
      { kind: "text", value: "." },
    ],
    ...overrides,
  }) as ParagraphBlock;

describe("ParagraphBlockTemplate", () => {
  it("renders a paragraph block", () => {
    expect(
      renderToStaticMarkup(<ParagraphBlockTemplate block={block()} />),
    ).toBe(
      '<p class="m-contentBlock m-contentBlock--paragraph l-content">A paragraph with <strong>strong text</strong>.</p>',
    );
  });

  it("renders breakout flow", () => {
    const html = renderToStaticMarkup(
      <ParagraphBlockTemplate block={block({ flow: "breakout" })} />,
    );

    expect(html).toContain("m-contentBlock--breakout");
  });
});
