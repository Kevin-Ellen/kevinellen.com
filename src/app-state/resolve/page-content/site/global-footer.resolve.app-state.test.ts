// src/app-state/resolve/page-content/global-footer.resolve.app-state.test.ts

import { appStateResolveGlobalFooter } from "@app-state/resolve/page-content/site/global-footer.resolve.app-state";

import { appStateGlobalFooterAuthored } from "@app-state/config/global-footer/authored.global-footer.app-state";

jest.mock(
  "@app-state/config/global-footer/authored.global-footer.app-state",
  () => ({
    appStateGlobalFooterAuthored: {
      sections: [
        {
          title: "Footer section",
        },
      ],
    },
  }),
);

describe("appStateResolveGlobalFooter", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-05-06T12:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("resolves the global footer colophon from site config", () => {
    expect(
      appStateResolveGlobalFooter({
        siteName: "Kevin Ellen",
      } as never),
    ).toEqual({
      ...appStateGlobalFooterAuthored,
      colophon: {
        kind: "colophon",
        copyrightName: "Kevin Ellen",
        copyrightYear: 2026,
        allRightsReserved: true,
      },
    });
  });
});
