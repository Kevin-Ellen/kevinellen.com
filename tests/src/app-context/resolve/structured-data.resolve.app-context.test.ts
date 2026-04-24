// tests/src/app-context/resolve/structured-data.resolve.app-context.test.ts

import { resolveStructuredDataAppContext } from "@app-context/resolve/structured-data.resolve.app-context";
import { resolveGlobalStructuredDataAppContext } from "@app-context/resolve/structured-data/global.structured-data.global.resolve.app-context";

import type { AppState } from "@app-state/class.app-state";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";
import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";

jest.mock(
  "@app-context/resolve/structured-data/global.structured-data.global.resolve.app-context",
  () => ({
    resolveGlobalStructuredDataAppContext: jest.fn(),
  }),
);

describe("resolveStructuredDataAppContext", () => {
  const appState = {} as AppState;

  const globalStructuredData = [
    {
      id: "website",
      json: {
        "@context": "https://schema.org",
        "@type": "WebSite",
      },
    },
  ] as const satisfies readonly AppContextStructuredDataEntry[];

  const pageStructuredData = [
    {
      id: "about-person",
      json: {
        "@context": "https://schema.org",
        "@type": "Person",
      },
    },
  ] as const satisfies readonly AppContextStructuredDataEntry[];

  const makePage = (
    overrides: Partial<AppStatePageDefinition> = {},
  ): AppStatePageDefinition =>
    ({
      id: "about",
      kind: "static",
      slug: "/about",
      label: "About",
      status: null,
      structuredData: pageStructuredData,
      ...overrides,
    }) as AppStatePageDefinition;

  beforeEach(() => {
    jest
      .mocked(resolveGlobalStructuredDataAppContext)
      .mockReturnValue(globalStructuredData);
  });

  it("returns an empty array for status pages", () => {
    const page = makePage({
      status: 404,
    });

    const result = resolveStructuredDataAppContext(appState, page);

    expect(result).toEqual([]);
    expect(resolveGlobalStructuredDataAppContext).not.toHaveBeenCalled();
  });

  it("combines global structured data with page structured data", () => {
    const page = makePage();

    const result = resolveStructuredDataAppContext(appState, page);

    expect(resolveGlobalStructuredDataAppContext).toHaveBeenCalledWith(
      appState,
    );
    expect(result).toEqual([...globalStructuredData, ...pageStructuredData]);
  });

  it("returns only global structured data when the page has no structured data", () => {
    const page = makePage({
      structuredData: [],
    });

    const result = resolveStructuredDataAppContext(appState, page);

    expect(result).toEqual(globalStructuredData);
  });
});
