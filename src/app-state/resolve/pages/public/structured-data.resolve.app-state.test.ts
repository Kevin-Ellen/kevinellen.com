// src/app-state/resolve/pages/public/structured-data.resolve.app-state.test.ts

import { appStateResolvePageStructuredData } from "@app-state/resolve/pages/public/structured-data.resolve.app-state";

describe("appStateResolvePageStructuredData", () => {
  it("defaults missing structured data to an empty array", () => {
    expect(appStateResolvePageStructuredData(undefined)).toEqual([]);
  });

  it("preserves authored structured data", () => {
    const structuredData = [
      {
        kind: "website",
      },
    ] as never;

    expect(appStateResolvePageStructuredData(structuredData)).toBe(
      structuredData,
    );
  });
});
