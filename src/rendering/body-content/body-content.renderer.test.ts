// src/rendering/body-content/body-content.renderer.test.ts

import type { AppRenderContextBodyContent } from "@app-render-context/types/body-content.app-render-context.types";

import { renderBodyContent } from "@rendering/body-content/body-content.renderer";
import { renderBodyContentFooter } from "@rendering/body-content/footer/footer.renderer";
import { renderBodyContentHeader } from "@rendering/body-content/header.body-content.renderer";
import { renderBlock } from "@rendering/body-content/block/block.renderer";

jest.mock("@rendering/body-content/footer/footer.renderer", () => ({
  renderBodyContentFooter: jest.fn(),
}));

jest.mock("@rendering/body-content/header.body-content.renderer", () => ({
  renderBodyContentHeader: jest.fn(),
}));

jest.mock("@rendering/body-content/block/block.renderer", () => ({
  renderBlock: jest.fn(),
}));

const createBodyContent = (
  overrides: Partial<AppRenderContextBodyContent> = {},
): AppRenderContextBodyContent =>
  ({
    header: {
      title: "Journal",
      eyebrow: null,
      intro: null,
      showInBody: true,
    },
    content: [{ kind: "paragraph" }, { kind: "quote" }],
    footer: [],
    ...overrides,
  }) as AppRenderContextBodyContent;

describe("renderBodyContent", () => {
  const mockedRenderBodyContentHeader = jest.mocked(renderBodyContentHeader);
  const mockedRenderBlock = jest.mocked(renderBlock);
  const mockedRenderBodyContentFooter = jest.mocked(renderBodyContentFooter);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderBodyContentHeader.mockReturnValue("<header>Header</header>");

    mockedRenderBlock
      .mockReturnValueOnce("<p>First module</p>")
      .mockReturnValueOnce("<blockquote>Second module</blockquote>");

    mockedRenderBodyContentFooter.mockReturnValue("<footer>Footer</footer>");
  });

  it("renders body content shell, header, content modules, and footer", () => {
    const bodyContent = createBodyContent();

    expect(renderBodyContent(bodyContent)).toBe(
      `<main class="l-main"><div class="l-page__frame"><header>Header</header><p>First module</p><blockquote>Second module</blockquote><footer>Footer</footer></div></main>`,
    );

    expect(mockedRenderBodyContentHeader).toHaveBeenCalledWith(
      bodyContent.header,
    );

    expect(mockedRenderBlock).toHaveBeenNthCalledWith(
      1,
      bodyContent.content[0],
      0,
      bodyContent.content,
    );

    expect(mockedRenderBlock).toHaveBeenNthCalledWith(
      2,
      bodyContent.content[1],
      1,
      bodyContent.content,
    );

    expect(mockedRenderBodyContentFooter).toHaveBeenCalledWith(
      bodyContent.footer,
    );
  });

  it("renders body content without content modules", () => {
    const bodyContent = createBodyContent({
      content: [],
    });

    expect(renderBodyContent(bodyContent)).toBe(
      `<main class="l-main"><div class="l-page__frame"><header>Header</header><footer>Footer</footer></div></main>`,
    );

    expect(mockedRenderBlock).not.toHaveBeenCalled();
  });
});
