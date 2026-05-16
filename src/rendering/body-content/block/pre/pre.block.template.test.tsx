// src/rendering/body-content/block/pre/pre.block.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextBlock } from "@shared-types/page-content/block/app-render-context.block.types";

import { PreBlockTemplate } from "@rendering/body-content/block/pre/pre.block.template";

type PreBlock = Extract<AppRenderContextBlock, { kind: "pre" }>;

const block = (overrides: Partial<PreBlock> = {}): PreBlock =>
  ({
    kind: "pre",
    flow: "content",
    value: 'const message = "Hello world";',
    ...overrides,
  }) as PreBlock;

describe("PreBlockTemplate", () => {
  it("renders a preformatted code block", () => {
    expect(renderToStaticMarkup(<PreBlockTemplate block={block()} />)).toBe(
      '<pre class="m-contentBlock m-pre l-content"><code>const message = &quot;Hello world&quot;;</code></pre>',
    );
  });

  it("renders breakout flow", () => {
    const html = renderToStaticMarkup(
      <PreBlockTemplate block={block({ flow: "breakout" })} />,
    );

    expect(html).toContain("m-contentBlock--breakout");
  });

  it("escapes unsafe HTML content", () => {
    const html = renderToStaticMarkup(
      <PreBlockTemplate
        block={block({
          value: '<script>alert("x")</script>',
        })}
      />,
    );

    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
  });
});
