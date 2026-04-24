// tests/src/app-context/resolve/structured-data/global.structured-data.global.resolve.app-context.test.ts

import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";

import { resolveGlobalStructuredDataAppContext } from "@app-context/resolve/structured-data/global.structured-data.global.resolve.app-context";
import { resolveWebsiteStructuredDataGlobalAppContext } from "@app-context/resolve/structured-data/website.structured-data.global.resolve.app-context";
import { appStateCreate } from "@app-state/create.app-state";

jest.mock(
  "@app-context/resolve/structured-data/website.structured-data.global.resolve.app-context",
  () => ({
    resolveWebsiteStructuredDataGlobalAppContext: jest.fn(),
  }),
);

const makeEnv = (): Env =>
  ({
    APP_ENV: "dev",
    APP_HOST: "dev.kevinellen.com",
  }) as Env;

describe("resolveGlobalStructuredDataAppContext", () => {
  it("resolves global structured data entries from AppState", () => {
    const appState = appStateCreate(makeEnv());

    const websiteEntry: AppContextStructuredDataEntry = {
      id: "website",
      json: {
        "@context": "https://schema.org",
        "@type": "WebSite",
      },
    };

    jest
      .mocked(resolveWebsiteStructuredDataGlobalAppContext)
      .mockReturnValue(websiteEntry);

    const result = resolveGlobalStructuredDataAppContext(appState);

    expect(resolveWebsiteStructuredDataGlobalAppContext).toHaveBeenCalledWith(
      appState.structuredData.website,
      appState,
    );

    expect(result).toEqual([websiteEntry]);
  });
});
