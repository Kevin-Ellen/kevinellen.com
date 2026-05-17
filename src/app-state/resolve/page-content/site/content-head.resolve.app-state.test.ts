// src/app-state/resolve/page-content/site/content-head.resolve.app-state.test.ts

import { appStateResolvePageContentHead } from "@app-state/resolve/page-content/site/content-head.resolve.app-state";

describe("appStateResolvePageContentHead", () => {
  it("applies deterministic defaults", () => {
    expect(
      appStateResolvePageContentHead({
        title: "Field notes",
      } as never),
    ).toEqual({
      title: "Field notes",
      eyebrow: null,
      intro: null,
      showInBody: true,
    });
  });

  it("preserves authored values", () => {
    expect(
      appStateResolvePageContentHead({
        title: "Field notes",
        eyebrow: "Journal",
        intro: "A short intro.",
        showInBody: false,
      } as never),
    ).toEqual({
      title: "Field notes",
      eyebrow: "Journal",
      intro: "A short intro.",
      showInBody: false,
    });
  });
});
