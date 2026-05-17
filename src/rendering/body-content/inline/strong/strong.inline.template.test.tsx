// src/rendering/body-content/inline/strong/strong.inline.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextStrongInline } from "@shared-types/page-content/inline/strong/app-render-context.strong.inline-content.types";

import { StrongInlineTemplate } from "@rendering/body-content/inline/strong/strong.inline.template";

describe("StrongInlineTemplate", () => {
  it("renders strong inline content", () => {
    const item = {
      kind: "strong",
      content: [
        {
          kind: "text",
          value: "Important content",
        },
      ],
    } as AppRenderContextStrongInline;

    expect(renderToStaticMarkup(<StrongInlineTemplate item={item} />)).toBe(
      `<strong>Important content</strong>`,
    );
  });

  it("renders empty strong inline content", () => {
    const item = {
      kind: "strong",
      content: [],
    } as unknown as AppRenderContextStrongInline;

    expect(renderToStaticMarkup(<StrongInlineTemplate item={item} />)).toBe(
      `<strong></strong>`,
    );
  });
});
