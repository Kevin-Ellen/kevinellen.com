// src/rendering/body-content/inline/emphasis/emphasis.inline.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextEmphasisInline } from "@shared-types/page-content/inline/emphasis/app-render-context.emphasis.inline-content.types";

import { EmphasisInlineTemplate } from "@rendering/body-content/inline/emphasis/emphasis.inline.template";

describe("EmphasisInlineTemplate", () => {
  it("renders emphasis inline content", () => {
    const item = {
      kind: "emphasis",
      content: [
        {
          kind: "text",
          value: "Gentle emphasis",
        },
      ],
    } as AppRenderContextEmphasisInline;

    expect(renderToStaticMarkup(<EmphasisInlineTemplate item={item} />)).toBe(
      "<em>Gentle emphasis</em>",
    );
  });

  it("renders empty emphasis inline content", () => {
    const item = {
      kind: "emphasis",
      content: [],
    } as AppRenderContextEmphasisInline;

    expect(renderToStaticMarkup(<EmphasisInlineTemplate item={item} />)).toBe(
      "<em></em>",
    );
  });
});
