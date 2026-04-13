// tests/src/app-state/resolve/pages/public/structured-data.resolve.app-state.test.ts

import { appStateResolvePageStructuredData } from "@app-state/resolve/pages/public/structured-data.resolve.app-state";

describe("appStateResolvePageStructuredData", () => {
  it("defaults structured data to an empty array when omitted", () => {
    expect(appStateResolvePageStructuredData(undefined)).toEqual([]);
  });

  it("preserves provided structured data", () => {
    const structuredData = [{ "@type": "AboutPage" }] as never[];

    const result = appStateResolvePageStructuredData(structuredData);

    expect(result).toBe(structuredData);
  });
});
