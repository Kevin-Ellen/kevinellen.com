// src/rendering/renderer.test.ts

import type { AppRenderContext } from "@app-render-context/class.app-render-context";

import { render } from "@rendering/renderer";
import { renderBodyContent } from "@rendering/body-content/body-content.renderer";
import { renderBodyFooter } from "@rendering/body-footer/body-footer.renderer";
import { renderBodyHeader } from "@rendering/body-header/body-header.renderer";
import { renderDocClose } from "@rendering/doc-close/doc-close.renderer";
import { renderDocOpen } from "@rendering/doc-open/doc-open.renderer";

jest.mock("@rendering/doc-open/doc-open.renderer", () => ({
  renderDocOpen: jest.fn(),
}));

jest.mock("@rendering/body-header/body-header.renderer", () => ({
  renderBodyHeader: jest.fn(),
}));

jest.mock("@rendering/body-content/body-content.renderer", () => ({
  renderBodyContent: jest.fn(),
}));

jest.mock("@rendering/body-footer/body-footer.renderer", () => ({
  renderBodyFooter: jest.fn(),
}));

jest.mock("@rendering/doc-close/doc-close.renderer", () => ({
  renderDocClose: jest.fn(),
}));

describe("render", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(renderDocOpen).mockReturnValue("<!doctype html>");
    jest.mocked(renderBodyHeader).mockReturnValue("<header>Header</header>");
    jest.mocked(renderBodyContent).mockReturnValue("<main>Main</main>");
    jest.mocked(renderBodyFooter).mockReturnValue("<footer>Footer</footer>");
    jest.mocked(renderDocClose).mockReturnValue("</body></html>");
  });

  it("renders the full document in order", () => {
    const appRenderContext = {
      docOpen: { id: "doc-open" },
      bodyHeader: { id: "body-header" },
      bodyContent: { id: "body-content" },
      bodyFooter: { id: "body-footer" },
      docClose: { id: "doc-close" },
    } as unknown as AppRenderContext;

    expect(render(appRenderContext)).toBe(
      `<!doctype html><header>Header</header><main>Main</main><footer>Footer</footer></body></html>`,
    );

    expect(renderDocOpen).toHaveBeenCalledWith(appRenderContext.docOpen);
    expect(renderBodyHeader).toHaveBeenCalledWith(appRenderContext.bodyHeader);
    expect(renderBodyContent).toHaveBeenCalledWith(
      appRenderContext.bodyContent,
    );
    expect(renderBodyFooter).toHaveBeenCalledWith(appRenderContext.bodyFooter);
    expect(renderDocClose).toHaveBeenCalledWith(appRenderContext.docClose);
  });
});
