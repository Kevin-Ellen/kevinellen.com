// src/app-state/resolve/pages/public/robots.resolve.app-state.test.ts

import { appStateResolvePageRobots } from "@app-state/resolve/pages/public/robots.resolve.app-state";

describe("appStateResolvePageRobots", () => {
  it("applies default robots directives", () => {
    expect(appStateResolvePageRobots()).toEqual({
      allowIndex: true,
      allowFollow: true,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
    });
  });

  it("preserves authored robots directives", () => {
    expect(
      appStateResolvePageRobots({
        allowIndex: false,
        allowFollow: false,
        noarchive: true,
        nosnippet: true,
        noimageindex: true,
      }),
    ).toEqual({
      allowIndex: false,
      allowFollow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    });
  });
});
