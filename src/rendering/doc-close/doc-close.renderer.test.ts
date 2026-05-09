// src/rendering/doc-close/doc-close.renderer.test.ts

import type { AppRenderContextDocClose } from "@app-render-context/types/doc-close.app-render-context.types";

import { renderDocClose } from "@rendering/doc-close/doc-close.renderer";

import {
  renderInlineScript,
  renderLinkScript,
  renderStructuredDataScript,
} from "@rendering/shared/script.shared.renderer";

jest.mock("@rendering/shared/script.shared.renderer", () => ({
  renderInlineScript: jest.fn(),
  renderLinkScript: jest.fn(),
  renderStructuredDataScript: jest.fn(),
}));

const createDocClose = (
  overrides: Partial<AppRenderContextDocClose> = {},
): AppRenderContextDocClose =>
  ({
    structuredData: [
      {
        "@context": "https://schema.org",
      },
    ],
    inlineScripts: [
      {
        id: "theme",
        nonce: "abc123",
        content: `console.log("theme")`,
      },
    ],
    linkScripts: [
      {
        src: "/assets/app.js",
        nonce: "xyz456",
      },
    ],
    svg: [
      {
        id: "icon-duck",
        viewBox: "0 0 24 24",
        content: "<path d='M1 1' />",
      },
    ],
    ...overrides,
  }) as AppRenderContextDocClose;

describe("renderDocClose", () => {
  const mockedRenderStructuredDataScript = jest.mocked(
    renderStructuredDataScript,
  );

  const mockedRenderInlineScript = jest.mocked(renderInlineScript);

  const mockedRenderLinkScript = jest.mocked(renderLinkScript);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderStructuredDataScript.mockReturnValue(
      `<script type="application/ld+json">{}</script>`,
    );

    mockedRenderInlineScript.mockReturnValue(
      `<script nonce="abc123">console.log("theme")</script>`,
    );

    mockedRenderLinkScript.mockReturnValue(
      `<script src="/assets/app.js"></script>`,
    );
  });

  it("renders structured data, scripts, svg sprite, and closing tags", () => {
    const docClose = createDocClose();

    expect(renderDocClose(docClose)).toBe(
      `<script type="application/ld+json">{}</script><script nonce="abc123">console.log("theme")</script><script src="/assets/app.js"></script><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" hidden class="u-hidden-svg-sprite"><symbol id="icon-duck" viewBox="0 0 24 24"><path d='M1 1' /></symbol></svg></body></html>`,
    );

    expect(mockedRenderStructuredDataScript).toHaveBeenCalledWith(
      docClose.structuredData[0],
      0,
      docClose.structuredData,
    );

    expect(mockedRenderInlineScript).toHaveBeenCalledWith(
      docClose.inlineScripts[0],
      0,
      docClose.inlineScripts,
    );

    expect(mockedRenderLinkScript).toHaveBeenCalledWith(
      docClose.linkScripts[0],
      0,
      docClose.linkScripts,
    );
  });

  it("renders without svg sprite when no svg assets exist", () => {
    const result = renderDocClose(
      createDocClose({
        svg: [],
      }),
    );

    expect(result).not.toContain(`u-hidden-svg-sprite`);
    expect(result).toContain(`</body></html>`);
  });

  it("renders without scripts or structured data", () => {
    expect(
      renderDocClose(
        createDocClose({
          structuredData: [],
          inlineScripts: [],
          linkScripts: [],
          svg: [],
        }),
      ),
    ).toBe(`</body></html>`);

    expect(mockedRenderStructuredDataScript).not.toHaveBeenCalled();
    expect(mockedRenderInlineScript).not.toHaveBeenCalled();
    expect(mockedRenderLinkScript).not.toHaveBeenCalled();
  });

  it("escapes svg asset values", () => {
    const result = renderDocClose(
      createDocClose({
        svg: [
          {
            id: "icon-home",
            viewBox: `0 0 24 "bad"`,
            content: `<path d="M1 1" />`,
          },
        ],
      }),
    );

    expect(result).toContain(`id="icon-home"`);

    expect(result).toContain(`viewBox="0 0 24 &quot;bad&quot;"`);

    expect(result).toContain(`<path d="M1 1" />`);
  });
});
