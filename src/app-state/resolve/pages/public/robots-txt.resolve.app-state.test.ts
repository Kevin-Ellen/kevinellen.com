// src/app-state/resolve/pages/public/robots-txt.resolve.app-state.test.ts

import { appStateResolvePageRobotsTxT } from "@app-state/resolve/pages/public/robots-txt.resolve.app-state";

describe("appStateResolvePageRobotsTxT", () => {
  it("defaults disallow to false", () => {
    expect(appStateResolvePageRobotsTxT()).toEqual({
      disallow: false,
    });
  });

  it("preserves authored disallow value", () => {
    expect(
      appStateResolvePageRobotsTxT({
        disallow: true,
      }),
    ).toEqual({
      disallow: true,
    });
  });
});
