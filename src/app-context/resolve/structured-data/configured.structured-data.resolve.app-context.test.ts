// src/app-context/resolve/structured-data/configured.structured-data.resolve.app-context.test.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";
import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";

import { appContextResolveConfiguredStructuredData } from "./configured.structured-data.resolve.app-context";

import { appContextResolveWebsiteStructuredData } from "@app-context/resolve/structured-data/website.structured-data.resolve.app-context";

jest.mock(
  "@app-context/resolve/structured-data/website.structured-data.resolve.app-context",
  () => ({
    appContextResolveWebsiteStructuredData: jest.fn(),
  }),
);

const resolvedWebsiteStructuredData: AppContextStructuredDataEntry = {
  id: "website",
  json: {
    "@context": "https://schema.org",
    "@type": "WebSite",
  },
};

describe("appContextResolveConfiguredStructuredData", () => {
  const mockedAppContextResolveWebsiteStructuredData = jest.mocked(
    appContextResolveWebsiteStructuredData,
  );

  const appState = {
    structuredData: {
      website: {
        id: {
          pageId: "home",
        },
      },
    },
  } as AppState;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves website structured data when the page matches the configured website page", () => {
    mockedAppContextResolveWebsiteStructuredData.mockReturnValue(
      resolvedWebsiteStructuredData,
    );

    const page = {
      id: "home",
    } as AppStatePageDefinition;

    const result = appContextResolveConfiguredStructuredData(appState, page);

    expect(result).toEqual([resolvedWebsiteStructuredData]);

    expect(mockedAppContextResolveWebsiteStructuredData).toHaveBeenCalledTimes(
      1,
    );

    expect(mockedAppContextResolveWebsiteStructuredData).toHaveBeenCalledWith(
      appState.structuredData.website,
      appState,
    );
  });

  it("does not resolve website structured data when the page does not match the configured website page", () => {
    const page = {
      id: "about",
    } as AppStatePageDefinition;

    const result = appContextResolveConfiguredStructuredData(appState, page);

    expect(result).toEqual([]);

    expect(mockedAppContextResolveWebsiteStructuredData).not.toHaveBeenCalled();
  });
});
