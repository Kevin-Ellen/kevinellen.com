// src/app/life-cycle/app-resolve/resolvers/structured-data/derived/derived.structured-data.resolver.app-resolve.test.ts

import { resolveDerivedStructuredDataAppResolve } from "./derived.structured-data.resolver.app-resolve";

import { resolveBreadcrumbsDerivedStructuredDataAppResolve } from "./breadcrumbs/breadcrumbs.derived.structured-data.resolver.app-resolve";
import { resolveJournalDerivedStructuredDataAppResolve } from "./journal-entry/journal-entry.derived.structured-data.resolver.app-resolve";

jest.mock(
  "./breadcrumbs/breadcrumbs.derived.structured-data.resolver.app-resolve",
  () => ({
    resolveBreadcrumbsDerivedStructuredDataAppResolve: jest.fn(),
  }),
);

jest.mock(
  "./journal-entry/journal-entry.derived.structured-data.resolver.app-resolve",
  () => ({
    resolveJournalDerivedStructuredDataAppResolve: jest.fn(),
  }),
);

const mockedBreadcrumbs = jest.mocked(
  resolveBreadcrumbsDerivedStructuredDataAppResolve,
);

const mockedJournal = jest.mocked(
  resolveJournalDerivedStructuredDataAppResolve,
);

type Input = Parameters<typeof resolveDerivedStructuredDataAppResolve>[0];

type Content = Input["content"];

describe("Derived structured data AppResolve resolver", () => {
  const site = {
    canonicalDomain: "https://kevinellen.com",
  } as Input["site"];

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Journals", href: "/journals" },
  ] as unknown as Content["breadcrumbs"];

  const createContent = (overrides: Partial<Content> = {}): Content =>
    ({
      pageType: "standard",
      breadcrumbs: [],
      ...overrides,
    }) as Content;

  const breadcrumbEntity = {
    "@type": "BreadcrumbList",
  } as ReturnType<typeof resolveBreadcrumbsDerivedStructuredDataAppResolve>;

  const articleEntity = {
    "@type": "Article" as const,
    headline: "A Journal Entry",
  };

  const resolve = (content: Content = createContent()) =>
    resolveDerivedStructuredDataAppResolve({
      content,
      site,
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedBreadcrumbs.mockReturnValue(breadcrumbEntity);
    mockedJournal.mockReturnValue([articleEntity]);
  });

  it("returns an empty graph for an ordinary page without breadcrumbs", () => {
    expect(resolve()).toEqual([]);

    expect(mockedBreadcrumbs).not.toHaveBeenCalled();
    expect(mockedJournal).not.toHaveBeenCalled();
  });

  it("omits breadcrumb structured data for a single breadcrumb", () => {
    const content = createContent({
      breadcrumbs: [breadcrumbs[0]],
    });

    expect(resolve(content)).toEqual([]);

    expect(mockedBreadcrumbs).not.toHaveBeenCalled();
  });

  it("resolves breadcrumbs when more than one exists", () => {
    const content = createContent({ breadcrumbs });

    expect(resolve(content)).toEqual([breadcrumbEntity]);

    expect(mockedBreadcrumbs).toHaveBeenCalledWith({
      breadcrumbs,
      canonicalDomain: site.canonicalDomain,
    });

    expect(mockedBreadcrumbs).toHaveBeenCalledTimes(1);
    expect(mockedJournal).not.toHaveBeenCalled();
  });

  it("resolves journal structured data for journal entries", () => {
    const content = createContent({
      pageType: "journalEntry",
    });

    expect(resolve(content)).toEqual([articleEntity]);

    expect(mockedJournal).toHaveBeenCalledWith({
      content,
      site,
    });

    expect(mockedJournal).toHaveBeenCalledTimes(1);
  });

  it("combines breadcrumbs before journal entities", () => {
    const content = createContent({
      pageType: "journalEntry",
      breadcrumbs,
    });

    const result = resolve(content);

    expect(result).toEqual([breadcrumbEntity, articleEntity]);

    expect(result[0]).toBe(breadcrumbEntity);
    expect(result[1]).toBe(articleEntity);
  });

  it("preserves multiple journal entities in order", () => {
    const images = [
      { "@type": "ImageObject" as const, name: "Fox" },
      { "@type": "ImageObject" as const, name: "Deer" },
    ];

    mockedJournal.mockReturnValue([articleEntity, ...images]);

    const content = createContent({
      pageType: "journalEntry",
      breadcrumbs,
    });

    expect(resolve(content)).toEqual([
      breadcrumbEntity,
      articleEntity,
      ...images,
    ]);
  });

  it("supports a journal resolver returning an empty graph", () => {
    mockedJournal.mockReturnValue([]);

    const content = createContent({
      pageType: "journalEntry",
    });

    expect(resolve(content)).toEqual([]);
  });

  it("preserves breadcrumbs when journal resolution returns no entities", () => {
    mockedJournal.mockReturnValue([]);

    const content = createContent({
      pageType: "journalEntry",
      breadcrumbs,
    });

    expect(resolve(content)).toEqual([breadcrumbEntity]);
  });

  it("propagates breadcrumb resolution failures", () => {
    const error = new Error("Breadcrumb resolution failed");

    mockedBreadcrumbs.mockImplementation(() => {
      throw error;
    });

    const content = createContent({
      pageType: "journalEntry",
      breadcrumbs,
    });

    expect(() => resolve(content)).toThrow(error);

    expect(mockedJournal).not.toHaveBeenCalled();
  });

  it("propagates journal resolution failures", () => {
    const error = new Error("Journal resolution failed");

    mockedJournal.mockImplementation(() => {
      throw error;
    });

    const content = createContent({
      pageType: "journalEntry",
    });

    expect(() => resolve(content)).toThrow(error);
  });

  it("does not modify the supplied breadcrumbs", () => {
    const content = createContent({
      breadcrumbs,
    });

    resolve(content);

    expect(content.breadcrumbs).toBe(breadcrumbs);
  });
});
