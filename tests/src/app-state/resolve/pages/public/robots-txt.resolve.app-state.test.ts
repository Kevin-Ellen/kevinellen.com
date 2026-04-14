// tests/src/app-state/resolve/pages/public/robots-txt.resolve.app-state.test.ts

import { appStateResolvePageRobotsTxT } from "@app-state/resolve/pages/public/robots-txt.resolve.app-state";

describe("appStateResolvePageRobotsTxT", () => {
  it("returns default disallow=false when no input is provided", () => {
    const result = appStateResolvePageRobotsTxT(undefined);

    expect(result).toEqual({
      disallow: false,
    });
  });

  it("returns disallow=true when authored value is true", () => {
    const result = appStateResolvePageRobotsTxT({
      disallow: true,
    });

    expect(result).toEqual({
      disallow: true,
    });
  });

  it("returns disallow=false when authored value is false", () => {
    const result = appStateResolvePageRobotsTxT({
      disallow: false,
    });

    expect(result).toEqual({
      disallow: false,
    });
  });
});
