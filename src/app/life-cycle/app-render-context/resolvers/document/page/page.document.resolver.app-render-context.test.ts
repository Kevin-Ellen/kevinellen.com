// src/app/life-cycle/app-render-context/resolvers/document/page/page.document.resolver.app-render-context.test.ts

import { resolvePageDocumentAppRenderContext } from "./page.document.resolver.app-render-context";

import { resolveHeaderPageDocumentAppRenderContext } from "./header/header.page.document.resolver.app-render-context";
import { resolveContentBodyAppRenderContext } from "./body/body.page.document.resolver.app-render-context";
import { resolveFooterPageDocumentAppRenderContext } from "./footer/footer.page.document.resolver.app-render-context";

jest.mock("./header/header.page.document.resolver.app-render-context", () => ({
  resolveHeaderPageDocumentAppRenderContext: jest.fn(),
}));

jest.mock("./body/body.page.document.resolver.app-render-context", () => ({
  resolveContentBodyAppRenderContext: jest.fn(),
}));

jest.mock("./footer/footer.page.document.resolver.app-render-context", () => ({
  resolveFooterPageDocumentAppRenderContext: jest.fn(),
}));

const mockedHeader = jest.mocked(resolveHeaderPageDocumentAppRenderContext);
const mockedBody = jest.mocked(resolveContentBodyAppRenderContext);
const mockedFooter = jest.mocked(resolveFooterPageDocumentAppRenderContext);

type Input = Parameters<typeof resolvePageDocumentAppRenderContext>[0];

type ResolvedHeader = ReturnType<
  typeof resolveHeaderPageDocumentAppRenderContext
>;
type ResolvedBody = ReturnType<typeof resolveContentBodyAppRenderContext>;
type ResolvedFooter = ReturnType<
  typeof resolveFooterPageDocumentAppRenderContext
>;

describe("Page document AppRenderContext resolver", () => {
  const shell = {
    header: {},
    footer: {},
  } as unknown as Input["shell"];

  const content = {
    pageType: "journal",
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Journal", href: "/journal" },
    ],
    body: {
      modules: [],
      footer: [],
    },
  } as unknown as Input["content"];

  const resolvedHeader = {
    navigation: [],
  } as unknown as ResolvedHeader;

  const resolvedBody = {
    modules: [],
    footer: [],
  } as unknown as ResolvedBody;

  const resolvedFooter = {
    links: [],
  } as unknown as ResolvedFooter;

  const createInput = (overrides: Partial<Input> = {}): Input => ({
    shell,
    content,
    ...overrides,
  });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedHeader.mockReturnValue(resolvedHeader);
    mockedBody.mockReturnValue(resolvedBody);
    mockedFooter.mockReturnValue(resolvedFooter);
  });

  it("returns the expected page document structure", () => {
    const result = resolvePageDocumentAppRenderContext(createInput());

    expect(result).toEqual({
      pageType: content.pageType,
      header: resolvedHeader,
      breadcrumbs: content.breadcrumbs,
      body: resolvedBody,
      footer: resolvedFooter,
    });
  });

  it("passes the resolved shell to the header resolver", () => {
    resolvePageDocumentAppRenderContext(createInput());

    expect(mockedHeader).toHaveBeenCalledTimes(1);
    expect(mockedHeader).toHaveBeenCalledWith({
      shell,
    });
  });

  it("passes the resolved content body to the body resolver", () => {
    resolvePageDocumentAppRenderContext(createInput());

    expect(mockedBody).toHaveBeenCalledTimes(1);
    expect(mockedBody).toHaveBeenCalledWith({
      content: content.body,
    });
  });

  it("passes the same shell to the footer resolver", () => {
    resolvePageDocumentAppRenderContext(createInput());

    expect(mockedFooter).toHaveBeenCalledTimes(1);
    expect(mockedFooter).toHaveBeenCalledWith({
      shell,
    });
  });

  it("preserves the exact resolved child references", () => {
    const result = resolvePageDocumentAppRenderContext(createInput());

    expect(result.header).toBe(resolvedHeader);
    expect(result.body).toBe(resolvedBody);
    expect(result.footer).toBe(resolvedFooter);
  });

  it("preserves the original breadcrumbs reference", () => {
    const result = resolvePageDocumentAppRenderContext(createInput());

    expect(result.breadcrumbs).toBe(content.breadcrumbs);
  });

  it("preserves the page type", () => {
    const result = resolvePageDocumentAppRenderContext(createInput());

    expect(result.pageType).toBe(content.pageType);
  });

  it("resolves header, body and footer in order", () => {
    const calls: string[] = [];

    mockedHeader.mockImplementation(() => {
      calls.push("header");
      return resolvedHeader;
    });

    mockedBody.mockImplementation(() => {
      calls.push("body");
      return resolvedBody;
    });

    mockedFooter.mockImplementation(() => {
      calls.push("footer");
      return resolvedFooter;
    });

    resolvePageDocumentAppRenderContext(createInput());

    expect(calls).toEqual(["header", "body", "footer"]);
  });

  it("stops if header resolution fails", () => {
    const error = new Error("Header resolution failed");

    mockedHeader.mockImplementation(() => {
      throw error;
    });

    expect(() => resolvePageDocumentAppRenderContext(createInput())).toThrow(
      error,
    );

    expect(mockedBody).not.toHaveBeenCalled();
    expect(mockedFooter).not.toHaveBeenCalled();
  });

  it("stops if body resolution fails", () => {
    const error = new Error("Body resolution failed");

    mockedBody.mockImplementation(() => {
      throw error;
    });

    expect(() => resolvePageDocumentAppRenderContext(createInput())).toThrow(
      error,
    );

    expect(mockedHeader).toHaveBeenCalledTimes(1);
    expect(mockedFooter).not.toHaveBeenCalled();
  });

  it("propagates footer resolution errors", () => {
    const error = new Error("Page footer resolution failed");

    mockedFooter.mockImplementation(() => {
      throw error;
    });

    expect(() => resolvePageDocumentAppRenderContext(createInput())).toThrow(
      error,
    );

    expect(mockedHeader).toHaveBeenCalledTimes(1);
    expect(mockedBody).toHaveBeenCalledTimes(1);
  });

  it("does not mutate the original content or shell", () => {
    const input = createInput();

    resolvePageDocumentAppRenderContext(input);

    expect(input.content).toBe(content);
    expect(input.shell).toBe(shell);
    expect(input.content.breadcrumbs).toBe(content.breadcrumbs);
  });
});
