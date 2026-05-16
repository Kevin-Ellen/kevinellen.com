// src/rendering/renderer.test.tsx

import { render } from "@rendering/renderer";

import type { AppRenderContext } from "@app-render-context/class.app-render-context";

jest.mock("react-dom/server", () => ({
  renderToStaticMarkup: jest.fn(() => "<html>Rendered document</html>"),
}));

jest.mock("@rendering/document.template", () => ({
  DocumentTemplate: "DocumentTemplate",
}));

describe("render", () => {
  it("renders the full document with doctype", () => {
    const appRenderContext = {} as AppRenderContext;

    expect(render(appRenderContext)).toBe(
      "<!doctype html><html>Rendered document</html>",
    );
  });
});
