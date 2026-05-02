// tests/src/rendering/renderer.test.ts

import { render } from "@rendering/renderer";

import { renderDocOpen } from "@rendering/doc-open/doc-open.renderer";
import { renderBodyHeader } from "@rendering/body-header/body-header.renderer";
import { renderBodyContent } from "@rendering/body-content/body-content.renderer";
import { renderBodyFooter } from "@rendering/body-footer/body-footer.renderer";
import { renderDocClose } from "@rendering/doc-close/doc-close.renderer";

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
  });

  it("renders the full document in order from the app render context", () => {
    const appRenderContext = {
      docOpen: { id: "doc-open" },
      bodyHeader: { id: "body-header" },
      bodyContent: { id: "body-content" },
      bodyFooter: { id: "body-footer" },
      docClose: { id: "doc-close" },
    };

    jest.mocked(renderDocOpen).mockReturnValue("<doc-open>");
    jest.mocked(renderBodyHeader).mockReturnValue("<body-header>");
    jest.mocked(renderBodyContent).mockReturnValue("<body-content>");
    jest.mocked(renderBodyFooter).mockReturnValue("<body-footer>");
    jest.mocked(renderDocClose).mockReturnValue("<doc-close>");

    const result = render(appRenderContext as never);

    expect(result).toBe(
      "<doc-open><body-header><body-content><body-footer><doc-close>",
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
