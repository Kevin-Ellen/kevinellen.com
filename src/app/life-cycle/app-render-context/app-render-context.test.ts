// src/app/life-cycle/app-render-context/app-render-context.test.ts

import { createAppRenderContext } from "./app-render-context";
import { AppRenderContext } from "./class.app-render-context";

import { resolveMetadataAppRenderContext } from "./resolvers/metadata/metadata.resolver.app-render-context";
import { resolveDocumentAppRenderContext } from "./resolvers/document/document.resolver.app-render-context";

jest.mock("./resolvers/metadata/metadata.resolver.app-render-context", () => ({
  resolveMetadataAppRenderContext: jest.fn(),
}));

jest.mock("./resolvers/document/document.resolver.app-render-context", () => ({
  resolveDocumentAppRenderContext: jest.fn(),
}));

const mockedMetadata = jest.mocked(resolveMetadataAppRenderContext);
const mockedDocument = jest.mocked(resolveDocumentAppRenderContext);

type Input = Parameters<typeof createAppRenderContext>[0];
type AppResolveInput = Input["appResolve"];

type Metadata = ReturnType<typeof resolveMetadataAppRenderContext>;
type Document = ReturnType<typeof resolveDocumentAppRenderContext>;

describe("AppRenderContext factory", () => {
  const site = {
    language: "en",
  } as unknown as AppResolveInput["site"];

  const content = {
    id: "forest-journal",
    status: 200,
  } as unknown as AppResolveInput["content"];

  const scripts = {
    global: [],
    registry: {},
  } as unknown as AppResolveInput["scripts"];

  const svgs = {} as AppResolveInput["svgs"];

  const structuredData = [] as unknown as AppResolveInput["structuredData"];

  const shell = {
    header: {},
    footer: {},
  } as unknown as AppResolveInput["shell"];

  const metadata = {
    status: 200,
    nonce: "test-nonce",
  } as Metadata;

  const document = {
    language: "en",
    head: {},
    page: {},
    end: {},
  } as unknown as Document;

  const createAppResolve = (
    overrides: Record<string, unknown> = {},
  ): AppResolveInput =>
    ({
      status: 200,
      site,
      content,
      scripts,
      svgs,
      structuredData,
      shell,
      ...overrides,
    }) as unknown as AppResolveInput;

  beforeEach(() => {
    jest.resetAllMocks();

    mockedMetadata.mockReturnValue(metadata);
    mockedDocument.mockReturnValue(document);
  });

  it("returns an AppRenderContext instance", () => {
    const result = createAppRenderContext({
      appResolve: createAppResolve(),
    });

    expect(result).toBeInstanceOf(AppRenderContext);
  });

  it("derives response metadata from AppResolve status", () => {
    createAppRenderContext({
      appResolve: createAppResolve(),
    });

    expect(mockedMetadata).toHaveBeenCalledTimes(1);
    expect(mockedMetadata).toHaveBeenCalledWith({
      status: 200,
    });
  });

  it("forwards non-successful response status", () => {
    createAppRenderContext({
      appResolve: createAppResolve({ status: 404 }),
    });

    expect(mockedMetadata).toHaveBeenCalledWith({
      status: 404,
    });
  });

  it("forwards the resolved dependencies to document composition", () => {
    createAppRenderContext({
      appResolve: createAppResolve(),
    });

    expect(mockedDocument).toHaveBeenCalledTimes(1);
    expect(mockedDocument).toHaveBeenCalledWith({
      site,
      content,
      scripts,
      svgs,
      structuredData,
      shell,
    });
  });

  it("preserves the exact metadata and document references", () => {
    const result = createAppRenderContext({
      appResolve: createAppResolve(),
    });

    expect(result.metadata).toBe(metadata);
    expect(result.document).toBe(document);
  });

  it("exposes the complete context through the inspection snapshot", () => {
    const result = createAppRenderContext({
      appResolve: createAppResolve(),
    });

    expect(result.toInspectionSnapshot).toEqual({
      metadata,
      document,
    });

    expect(result.toInspectionSnapshot.metadata).toBe(metadata);
    expect(result.toInspectionSnapshot.document).toBe(document);
  });

  it("resolves metadata before the document", () => {
    const calls: string[] = [];

    mockedMetadata.mockImplementation(() => {
      calls.push("metadata");
      return metadata;
    });

    mockedDocument.mockImplementation(() => {
      calls.push("document");
      return document;
    });

    createAppRenderContext({
      appResolve: createAppResolve(),
    });

    expect(calls).toEqual(["metadata", "document"]);
  });

  it("does not resolve the document if metadata resolution fails", () => {
    const error = new Error("Metadata resolution failed");

    mockedMetadata.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      createAppRenderContext({
        appResolve: createAppResolve(),
      }),
    ).toThrow(error);

    expect(mockedDocument).not.toHaveBeenCalled();
  });

  it("propagates document resolution failures", () => {
    const error = new Error("Document resolution failed");

    mockedDocument.mockImplementation(() => {
      throw error;
    });

    expect(() =>
      createAppRenderContext({
        appResolve: createAppResolve(),
      }),
    ).toThrow(error);

    expect(mockedMetadata).toHaveBeenCalledTimes(1);
  });

  it("creates a new context for each invocation", () => {
    const appResolve = createAppResolve();

    const first = createAppRenderContext({ appResolve });
    const second = createAppRenderContext({ appResolve });

    expect(first).not.toBe(second);
    expect(first.toInspectionSnapshot).not.toBe(second.toInspectionSnapshot);
  });

  it("does not modify AppResolve values", () => {
    const appResolve = createAppResolve();

    createAppRenderContext({ appResolve });

    expect(appResolve.site).toBe(site);
    expect(appResolve.content).toBe(content);
    expect(appResolve.scripts).toBe(scripts);
    expect(appResolve.svgs).toBe(svgs);
    expect(appResolve.structuredData).toBe(structuredData);
    expect(appResolve.shell).toBe(shell);
  });
});
