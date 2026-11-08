// src/app/life-cycle/app-render-context/resolvers/document/document.resolver.app-render-context.test.ts

import { resolveDocumentAppRenderContext } from "./document.resolver.app-render-context";

import { resolveHeadDocumentAppRenderContext } from "./head/head.document.resolver.app-render-context";
import { resolvePageDocumentAppRenderContext } from "./page/page.document.resolver.app-render-context";
import { resolveDocumentEndAppRenderContext } from "./end/end.document.resolver.app-render-context";

jest.mock("./head/head.document.resolver.app-render-context", () => ({
  resolveHeadDocumentAppRenderContext: jest.fn(),
}));

jest.mock("./page/page.document.resolver.app-render-context", () => ({
  resolvePageDocumentAppRenderContext: jest.fn(),
}));

jest.mock("./end/end.document.resolver.app-render-context", () => ({
  resolveDocumentEndAppRenderContext: jest.fn(),
}));

const mockedHead = jest.mocked(resolveHeadDocumentAppRenderContext);
const mockedPage = jest.mocked(resolvePageDocumentAppRenderContext);
const mockedEnd = jest.mocked(resolveDocumentEndAppRenderContext);

type Input = Parameters<typeof resolveDocumentAppRenderContext>[0];

type ResolvedHead = ReturnType<typeof resolveHeadDocumentAppRenderContext>;

type ResolvedPage = ReturnType<typeof resolvePageDocumentAppRenderContext>;

type ResolvedEnd = ReturnType<typeof resolveDocumentEndAppRenderContext>;

describe("Document AppRenderContext resolver", () => {
  const site = {
    language: "en",
  } as unknown as Input["site"];

  const content = {
    id: "forest-journal",
    status: 200,
  } as unknown as Input["content"];

  const scripts = {
    global: [],
    registry: {},
  } as unknown as Input["scripts"];

  const svgs = {} as Input["svgs"];

  const structuredData = [] as unknown as Input["structuredData"];

  const shell = {
    header: {},
    footer: {},
  } as unknown as Input["shell"];

  const resolvedHead = {
    title: "Forest Journal",
  } as unknown as ResolvedHead;

  const resolvedPage = {
    pageType: "journal",
  } as unknown as ResolvedPage;

  const resolvedEnd = {
    scripts: [],
    svg: [],
  } as unknown as ResolvedEnd;

  const createInput = (overrides: Partial<Input> = {}): Input => ({
    site,
    content,
    scripts,
    svgs,
    structuredData,
    shell,
    ...overrides,
  });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedHead.mockReturnValue(resolvedHead);
    mockedPage.mockReturnValue(resolvedPage);
    mockedEnd.mockReturnValue(resolvedEnd);
  });

  it("constructs the complete document", () => {
    const result = resolveDocumentAppRenderContext(createInput());

    expect(result).toEqual({
      language: "en",
      head: resolvedHead,
      page: resolvedPage,
      end: resolvedEnd,
    });
  });

  it("passes the correct dependencies to the head resolver", () => {
    resolveDocumentAppRenderContext(createInput());

    expect(mockedHead).toHaveBeenCalledTimes(1);
    expect(mockedHead).toHaveBeenCalledWith({
      site,
      content,
      scripts,
      structuredData,
    });
  });

  it("passes the shell and content to the page resolver", () => {
    resolveDocumentAppRenderContext(createInput());

    expect(mockedPage).toHaveBeenCalledTimes(1);
    expect(mockedPage).toHaveBeenCalledWith({
      shell,
      content,
    });
  });

  it("passes scripts, SVGs and content to the end resolver", () => {
    resolveDocumentAppRenderContext(createInput());

    expect(mockedEnd).toHaveBeenCalledTimes(1);
    expect(mockedEnd).toHaveBeenCalledWith({
      scripts,
      svgs,
      content,
    });
  });

  it("preserves the exact resolved child references", () => {
    const result = resolveDocumentAppRenderContext(createInput());

    expect(result.head).toBe(resolvedHead);
    expect(result.page).toBe(resolvedPage);
    expect(result.end).toBe(resolvedEnd);
  });

  it("derives the document language from site configuration", () => {
    const customSite = {
      ...site,
      language: "nl",
    } as Input["site"];

    const result = resolveDocumentAppRenderContext(
      createInput({ site: customSite }),
    );

    expect(result.language).toBe("nl");
  });

  it("resolves head, page and end in that order", () => {
    const calls: string[] = [];

    mockedHead.mockImplementation(() => {
      calls.push("head");
      return resolvedHead;
    });

    mockedPage.mockImplementation(() => {
      calls.push("page");
      return resolvedPage;
    });

    mockedEnd.mockImplementation(() => {
      calls.push("end");
      return resolvedEnd;
    });

    resolveDocumentAppRenderContext(createInput());

    expect(calls).toEqual(["head", "page", "end"]);
  });

  it("stops if head resolution fails", () => {
    const error = new Error("Head resolution failed");

    mockedHead.mockImplementation(() => {
      throw error;
    });

    expect(() => resolveDocumentAppRenderContext(createInput())).toThrow(error);

    expect(mockedPage).not.toHaveBeenCalled();
    expect(mockedEnd).not.toHaveBeenCalled();
  });

  it("stops if page resolution fails", () => {
    const error = new Error("Page resolution failed");

    mockedPage.mockImplementation(() => {
      throw error;
    });

    expect(() => resolveDocumentAppRenderContext(createInput())).toThrow(error);

    expect(mockedHead).toHaveBeenCalledTimes(1);
    expect(mockedEnd).not.toHaveBeenCalled();
  });

  it("propagates end resolution failures", () => {
    const error = new Error("Document end resolution failed");

    mockedEnd.mockImplementation(() => {
      throw error;
    });

    expect(() => resolveDocumentAppRenderContext(createInput())).toThrow(error);

    expect(mockedHead).toHaveBeenCalledTimes(1);
    expect(mockedPage).toHaveBeenCalledTimes(1);
  });

  it("does not mutate the supplied dependencies", () => {
    const input = createInput();

    resolveDocumentAppRenderContext(input);

    expect(input.site).toBe(site);
    expect(input.content).toBe(content);
    expect(input.scripts).toBe(scripts);
    expect(input.svgs).toBe(svgs);
    expect(input.shell).toBe(shell);
  });
});
