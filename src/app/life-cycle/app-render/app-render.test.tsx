// src/app/life-cycle/app-render/app-render.test.tsx

import { appRender } from "./app-render";
import { Document } from "./document/document.app-render";

import type { AppRenderContext } from "../app-render-context/class.app-render-context";

jest.mock("./document/document.app-render", () => ({
  Document: jest.fn(() => (
    <html lang="en">
      <head>
        <title>Test page</title>
      </head>
      <body>
        <main>Rendered content</main>
      </body>
    </html>
  )),
}));

const mockedDocument = jest.mocked(Document);

type Metadata = AppRenderContext["metadata"];

describe("appRender", () => {
  /*
   * AppRenderContext is constructed upstream.
   *
   * This entry point only consumes context.document and
   * context.metadata, so the fixture provides those fields.
   */
  const createContext = (
    status: Metadata["status"] = 200,
    nonce = "test-nonce",
  ): AppRenderContext =>
    ({
      metadata: {
        status,
        nonce,
      },
      document: {},
    }) as unknown as AppRenderContext;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns an HTML response", () => {
    const result = appRender(createContext());

    expect(result.kind).toBe("html");
  });

  it("preserves the HTTP response status", () => {
    const context = createContext(200);

    const result = appRender(context);

    expect(result.status).toBe(200);
  });

  it("preserves a non-success HTTP response status", () => {
    const context = createContext(404);

    const result = appRender(context);

    expect(result.status).toBe(404);
  });

  it("forwards the request nonce into the response", () => {
    const context = createContext(200, "request-specific-nonce");

    const result = appRender(context);

    expect(result.nonce).toBe("request-specific-nonce");
  });

  it("prefixes the rendered document with the HTML5 doctype", () => {
    const result = appRender(createContext());

    expect(result.body.startsWith("<!DOCTYPE html>")).toBe(true);
  });

  it("renders the complete document to a string", () => {
    const result = appRender(createContext());

    expect(typeof result.body).toBe("string");

    expect(result.body).toContain('<html lang="en">');
    expect(result.body).toContain("<title>Test page</title>");
    expect(result.body).toContain("<main>Rendered content</main>");
    expect(result.body).toContain("</html>");
  });

  it("renders the document exactly once", () => {
    appRender(createContext());

    expect(mockedDocument).toHaveBeenCalledTimes(1);
  });

  it("forwards the original document context", () => {
    const context = createContext();

    appRender(context);

    expect(mockedDocument.mock.calls[0]?.[0].document).toBe(context.document);
  });

  it("forwards the original metadata context", () => {
    const context = createContext();

    appRender(context);

    expect(mockedDocument.mock.calls[0]?.[0].metadata).toBe(context.metadata);
  });

  it("does not introduce an additional document wrapper", () => {
    const result = appRender(createContext());

    expect(result.body.match(/<!DOCTYPE html>/g)).toHaveLength(1);

    expect(result.body.match(/<html\b/g)).toHaveLength(1);
  });

  it("preserves the response contract", () => {
    const context = createContext(200, "response-nonce");

    const result = appRender(context);

    expect(result).toEqual({
      kind: "html",
      status: 200,
      nonce: "response-nonce",
      body: expect.stringContaining("<!DOCTYPE html>"),
    });
  });
});
