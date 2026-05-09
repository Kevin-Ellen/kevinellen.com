// src/app-context/resolve/structured-data/structured-data.resolve.app-context.test.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";
import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";

import { appContextResolveStructuredData } from "@app-context/resolve/structured-data/structured-data.resolve.app-context";

import { appContextResolveGlobalStructuredData } from "@app-context/resolve/structured-data/global.structured-data.global.resolve.app-context";

jest.mock(
  "@app-context/resolve/structured-data/global.structured-data.global.resolve.app-context",
  () => ({
    appContextResolveGlobalStructuredData: jest.fn(),
  }),
);

describe("appContextResolveStructuredData", () => {
  const mockedAppContextResolveGlobalStructuredData = jest.mocked(
    appContextResolveGlobalStructuredData,
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

    expect(mockedAppContextResolveGlobalStructuredData).not.toHaveBeenCalled();
  });

  it("combines global and page structured data for public pages", () => {
    const appState = {} as AppState;

    const globalStructuredData: AppContextStructuredDataEntry = {
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

    const pageStructuredData = {
      id: "page",
      json: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://example.com/#page",
        url: "https://example.com/",
        name: "Home",
        description: "Homepage.",
        inLanguage: "en-GB",
      },
    };

    mockedAppContextResolveGlobalStructuredData.mockReturnValue([
      globalStructuredData,
    ]);

    const page = {
      status: null,
      structuredData: [pageStructuredData],
    } as unknown as AppStatePageDefinition;

    expect(appContextResolveStructuredData(appState, page)).toEqual([
      globalStructuredData,
      pageStructuredData,
    ]);

    expect(mockedAppContextResolveGlobalStructuredData).toHaveBeenCalledWith(
      appState,
    );
  });
});
