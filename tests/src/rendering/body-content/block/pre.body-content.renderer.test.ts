// tests/src/rendering/body-content/block/pre.body-content.renderer.test.ts

import { renderPreBlockContentModule } from "@rendering/body-content/block/pre.body-content.renderer";

describe("renderPreBlockContentModule", () => {
  it("renders escaped preformatted code", () => {
    const html = renderPreBlockContentModule({
      kind: "pre",
      flow: "content",
      value: `const bird = "<coot>";`,
    } as never);

    expect(html).toContain(`<pre class="m-contentBlock m-pre l-content">`);
    expect(html).toContain(
      `<code>const bird = &quot;&lt;coot&gt;&quot;;</code>`,
    );
  });

  it("uses the block flow class", () => {
    const html = renderPreBlockContentModule({
      kind: "pre",
      flow: "breakout",
      value: "console.log('duck');",
    } as never);

    expect(html).toContain(`m-contentBlock--breakout`);
  });
});
