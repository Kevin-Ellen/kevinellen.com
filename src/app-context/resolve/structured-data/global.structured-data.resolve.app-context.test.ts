// src/app-context/resolve/structured-data/global.structured-data.global.resolve.app-context.test.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";

import { appContextResolveGlobalStructuredData } from "@app-context/resolve/structured-data/global.structured-data.global.resolve.app-context";

import { appContextResolveWebsiteStructuredData } from "@app-context/resolve/structured-data/website.structured-data.global.resolve.app-context";

const appState = {
  structuredData: {
    website: {
      name: "Photography Duck",
    },
  },
} as AppState;

const resolvedWebsiteStructuredData: AppContextStructuredDataEntry = {
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

jest.mock(
  "@app-context/resolve/structured-data/website.structured-data.global.resolve.app-context",
  () => ({
    appContextResolveWebsiteStructuredData: jest.fn(),
  }),
);

describe("appContextResolveGlobalStructuredData", () => {
  const mockedAppContextResolveWebsiteStructuredData = jest.mocked(
    appContextResolveWebsiteStructuredData,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves website structured data", () => {
    mockedAppContextResolveWebsiteStructuredData.mockReturnValue(
      resolvedWebsiteStructuredData,
    );

    const result = appContextResolveGlobalStructuredData(appState);

    expect(result).toEqual([resolvedWebsiteStructuredData]);

    expect(mockedAppContextResolveWebsiteStructuredData).toHaveBeenCalledTimes(
      1,
    );

    expect(mockedAppContextResolveWebsiteStructuredData).toHaveBeenCalledWith(
      appState.structuredData.website,
      appState,
    );
  });
});
