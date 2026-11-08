// src/app/life-cycle/app-render/document/document.app-render.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import { Document } from "./document.app-render";
import { DocumentHead } from "./head/head.document.app-render";
import { Page } from "./page/page.document.app-render";
import { DocumentEnd } from "./end/end.document.app-render";

jest.mock("./head/head.document.app-render", () => ({
  DocumentHead: jest.fn(() => <head />),
}));

jest.mock("./page/page.document.app-render", () => ({
  Page: jest.fn(() => <main />),
}));

jest.mock("./end/end.document.app-render", () => ({
  DocumentEnd: jest.fn(() => <div data-testid="document-end" />),
}));

const mockedHead = jest.mocked(DocumentHead);
const mockedPage = jest.mocked(Page);
const mockedEnd = jest.mocked(DocumentEnd);

type Props = Parameters<typeof Document>[0];
type DocumentContext = Props["document"];
type Metadata = Props["metadata"];

describe("Document AppRender", () => {
  const createMetadata = (): Metadata =>
    ({
      nonce: "request-nonce",
    }) as Metadata;

  const createDocument = (
    overrides: Partial<DocumentContext> = {},
  ): DocumentContext =>
    ({
      language: "en-GB",
      head: {},
      page: {},
      end: {},
      ...overrides,
    }) as unknown as DocumentContext;

  const renderDocument = (
    document = createDocument(),
    metadata = createMetadata(),
  ): string =>
    renderToStaticMarkup(<Document document={document} metadata={metadata} />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the HTML document language", () => {
    const html = renderDocument();

    expect(html).toContain('<html lang="en-GB">');
    expect(html).toContain("</html>");
  });

  it("supports a different document language", () => {
    const html = renderDocument(createDocument({ language: "nl-NL" }));

    expect(html).toContain('<html lang="nl-NL">');
  });

  it("renders the head and body", () => {
    const html = renderDocument();

    expect(html).toContain("<head>");
    expect(html).toContain("<body>");
    expect(html).toContain("</body>");
  });

  it("renders head, page and end in order", () => {
    const html = renderDocument();

    const headPosition = html.indexOf("<head>");
    const pagePosition = html.indexOf("<main>");
    const endPosition = html.indexOf('data-testid="document-end"');

    expect(headPosition).toBeGreaterThan(-1);
    expect(pagePosition).toBeGreaterThan(headPosition);
    expect(endPosition).toBeGreaterThan(pagePosition);
  });

  it("passes the original head context", () => {
    const document = createDocument();

    renderDocument(document);

    expect(mockedHead).toHaveBeenCalledTimes(1);
    expect(mockedHead.mock.calls[0]?.[0].head).toBe(document.head);
  });

  it("passes the original page context", () => {
    const document = createDocument();

    renderDocument(document);

    expect(mockedPage).toHaveBeenCalledTimes(1);
    expect(mockedPage.mock.calls[0]?.[0].page).toBe(document.page);
  });

  it("passes the original end context", () => {
    const document = createDocument();

    renderDocument(document);

    expect(mockedEnd).toHaveBeenCalledTimes(1);
    expect(mockedEnd.mock.calls[0]?.[0].end).toBe(document.end);
  });

  it("shares the same metadata reference between head and end", () => {
    const document = createDocument();
    const metadata = createMetadata();

    renderDocument(document, metadata);

    expect(mockedHead.mock.calls[0]?.[0].metadata).toBe(metadata);
    expect(mockedEnd.mock.calls[0]?.[0].metadata).toBe(metadata);
  });

  it("renders each child exactly once", () => {
    renderDocument();

    expect(mockedHead).toHaveBeenCalledTimes(1);
    expect(mockedPage).toHaveBeenCalledTimes(1);
    expect(mockedEnd).toHaveBeenCalledTimes(1);
  });

  it("does not introduce extra document wrappers", () => {
    const html = renderDocument();

    expect(html.match(/<html\b/g) ?? []).toHaveLength(1);
    expect(html.match(/<head\b/g) ?? []).toHaveLength(1);
    expect(html.match(/<body\b/g) ?? []).toHaveLength(1);
  });
});
