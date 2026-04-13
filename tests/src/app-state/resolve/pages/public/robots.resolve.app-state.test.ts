// tests/src/app-state/resolve/pages/public/robots.resolve.app-state.test.ts

import { appStateResolvePageRobots } from "@app-state/resolve/pages/public/robots.resolve.app-state";

import type { AppStatePageRobotsDirectives } from "@shared-types/pages/shared/app-state.robots.shared.page.types";

describe("appStateResolvePageRobots", () => {
  it("defaults all robots directives when omitted", () => {
    const expected: AppStatePageRobotsDirectives = {
      allowIndex: true,
      allowFollow: true,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
    };

    expect(appStateResolvePageRobots()).toEqual(expected);
  });

  it("preserves provided robots directives", () => {
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

  it("merges partial robots directives with defaults", () => {
    expect(
      appStateResolvePageRobots({
        allowIndex: false,
        noarchive: true,
      }),
    ).toEqual({
      allowIndex: false,
      allowFollow: true,
      noarchive: true,
      nosnippet: false,
      noimageindex: false,
    });
  });
});
