// src/rendering/body-content/block/pre.block.renderer.test.ts

import type { AppRenderContextBlock } from "@shared-types/page-content/block/app-render-context.block.types";

import { renderPreBlock } from "@rendering/body-content/block/pre.block.renderer";
import { renderBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.helper";

jest.mock("@rendering/body-content/block/helpers/flow.block.helper", () => ({
  renderBlockFlowClass: jest.fn(),
}));

type PreBlock = Extract<AppRenderContextBlock, { kind: "pre" }>;

const createModule = (overrides: Partial<PreBlock> = {}): PreBlock =>
  ({
    kind: "pre",
    flow: "content",
    value: "const answer = 42;",
    ...overrides,
  }) as PreBlock;

describe("renderPreBlock", () => {
  const mockedRenderBlockFlowClass = jest.mocked(renderBlockFlowClass);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderBlockFlowClass.mockReturnValue("l-content");
  });

  it("renders preformatted block", () => {
    expect(renderPreBlock(createModule())).toBe(
      `<pre class="m-contentBlock m-pre l-content"><code>const answer = 42;</code></pre>`,
    );

    expect(mockedRenderBlockFlowClass).toHaveBeenCalledWith("content");
  });

  it("escapes code content", () => {
    expect(
      renderPreBlock(
        createModule({
          value: `<script>alert("xss")</script>`,
        }),
      ),
    ).toBe(
      `<pre class="m-contentBlock m-pre l-content"><code>&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</code></pre>`,
    );
  });

  it("renders empty preformatted content", () => {
    expect(
      renderPreBlock(
        createModule({
          value: "",
        }),
      ),
    ).toBe(`<pre class="m-contentBlock m-pre l-content"><code></code></pre>`);
  });
});
