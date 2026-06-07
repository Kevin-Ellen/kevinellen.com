// src/app-context/resolve/structured-data/configured.structured-data.resolve.app-context.test.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";
import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";

import { appContextResolveConfiguredStructuredData } from "./configured.structured-data.resolve.app-context";

import { appContextResolvePersonStructuredData } from "@app-context/resolve/structured-data/person.structured-data.resolve.app-context";
import { appContextResolveWebsiteStructuredData } from "@app-context/resolve/structured-data/website.structured-data.resolve.app-context";

jest.mock(
  "@app-context/resolve/structured-data/person.structured-data.resolve.app-context",
  () => ({
    appContextResolvePersonStructuredData: jest.fn(),
  }),
);

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

const resolvedPersonStructuredData: AppContextStructuredDataEntry = {
  id: "person",
  json: {
    "@context": "https://schema.org",
    "@type": "Person",
  },
};

describe("appContextResolveConfiguredStructuredData", () => {
  const mockedAppContextResolveWebsiteStructuredData = jest.mocked(
    appContextResolveWebsiteStructuredData,
  );

  const mockedAppContextResolvePersonStructuredData = jest.mocked(
    appContextResolvePersonStructuredData,
  );

  const appState = {
    structuredData: {
      website: {
        id: {
          pageId: "home",
        },
      },
      person: {
        id: {
          pageId: "about",
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

    expect(mockedAppContextResolvePersonStructuredData).not.toHaveBeenCalled();
  });

  it("resolves person structured data when the page matches the configured person page", () => {
    mockedAppContextResolvePersonStructuredData.mockReturnValue(
      resolvedPersonStructuredData,
    );

    const page = {
      id: "about",
    } as AppStatePageDefinition;

    const result = appContextResolveConfiguredStructuredData(appState, page);

    expect(result).toEqual([resolvedPersonStructuredData]);

    expect(mockedAppContextResolvePersonStructuredData).toHaveBeenCalledTimes(
      1,
    );

    expect(mockedAppContextResolvePersonStructuredData).toHaveBeenCalledWith(
      appState.structuredData.person,
      appState,
    );

    expect(mockedAppContextResolveWebsiteStructuredData).not.toHaveBeenCalled();
  });

  it("does not resolve configured structured data when the page does not match a configured structured data page", () => {
    const page = {
      id: "journal",
    } as AppStatePageDefinition;

    const result = appContextResolveConfiguredStructuredData(appState, page);

    expect(result).toEqual([]);

    expect(mockedAppContextResolveWebsiteStructuredData).not.toHaveBeenCalled();
    expect(mockedAppContextResolvePersonStructuredData).not.toHaveBeenCalled();
  });
});
