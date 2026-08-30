// src/app-context/resolve/structured-data/structured-data.resolve.app-context.test.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";
import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";

import { appContextResolveStructuredData } from "@app-context/resolve/structured-data/structured-data.resolve.app-context";

import { appContextResolveConfiguredStructuredData } from "@app-context/resolve/structured-data/configured.structured-data.resolve.app-context";

jest.mock(
  "@app-context/resolve/structured-data/configured.structured-data.resolve.app-context",
  () => ({
    appContextResolveConfiguredStructuredData: jest.fn(),
  }),
);

describe("appContextResolveStructuredData", () => {
  const mockedAppContextResolveConfiguredStructuredData = jest.mocked(
    appContextResolveConfiguredStructuredData,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns empty structured data for status pages", () => {
    const appState = {} as AppState;

    const page = {
      status: 404,
      structuredData: [],
    } as unknown as AppStatePageDefinition;

    expect(appContextResolveStructuredData(appState, page)).toEqual([]);

    expect(
      mockedAppContextResolveConfiguredStructuredData,
    ).not.toHaveBeenCalled();
  });

  it("combines configured and page structured data for public pages", () => {
    const appState = {} as AppState;

    const configuredStructuredData: AppContextStructuredDataEntry = {
      id: "website",
      json: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://example.com/#website",
        url: "https://example.com/",
        name: "Photography Duck",
        description: "Wildlife and field notes.",
        inLanguage: "en-GB",
        publisher: {
          "@id": "https://example.com/#publisher",
        },
      },
    };

    const pageStructuredData: AppContextStructuredDataEntry = {
      id: "breadcrumb",
      json: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
      },
    };

    mockedAppContextResolveConfiguredStructuredData.mockReturnValue([
      configuredStructuredData,
    ]);

    const page = {
      status: null,
      structuredData: [pageStructuredData],
    } as unknown as AppStatePageDefinition;

    expect(appContextResolveStructuredData(appState, page)).toEqual([
      configuredStructuredData,
      pageStructuredData,
    ]);

    expect(
      mockedAppContextResolveConfiguredStructuredData,
    ).toHaveBeenCalledWith(appState, page);
  });
});
