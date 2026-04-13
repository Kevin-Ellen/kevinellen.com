// tests/src/app-state/resolve/page-content/content-head.resolve.app-state.test.ts

import { appStateResolvePageContentHead } from "@app-state/resolve/page-content/site/content-head.resolve.app-state";

import type { AuthoredPageContentHead } from "@shared-types/page-content/site/content-head/authored.content-head.page-content.types";
import type { AppStatePageContentHead } from "@shared-types/page-content/site/content-head/app-state.content-head.page-content.types";

describe("appStateResolvePageContentHead", () => {
  it("defaults optional fields to null when omitted", () => {
    const authoredHead: AuthoredPageContentHead = {
      title: "About Kevin Ellen",
    };

    const result = appStateResolvePageContentHead(authoredHead);

    expect(result).toEqual({
      title: "About Kevin Ellen",
      eyebrow: null,
      intro: null,
    });
  });

  it("preserves eyebrow when provided", () => {
    const authoredHead: AuthoredPageContentHead = {
      eyebrow: "Field Notes",
      title: "About Kevin Ellen",
    };

    const result = appStateResolvePageContentHead(authoredHead);

    expect(result.eyebrow).toBe("Field Notes");
  });

  it("preserves intro when provided", () => {
    const authoredHead: AuthoredPageContentHead = {
      title: "About Kevin Ellen",
      intro: "Wildlife photography and technical architecture.",
    };

    const result = appStateResolvePageContentHead(authoredHead);

    expect(result.intro).toBe(
      "Wildlife photography and technical architecture.",
    );
  });

  it("returns the expected AppState shape", () => {
    const authoredHead: AuthoredPageContentHead = {
      eyebrow: "Field Notes",
      title: "Photography Duck",
      intro: "Wildlife photography and technical architecture.",
    };

    const result = appStateResolvePageContentHead(authoredHead);

    const expected: AppStatePageContentHead = {
      eyebrow: "Field Notes",
      title: "Photography Duck",
      intro: "Wildlife photography and technical architecture.",
    };

    expect(result).toEqual(expected);
  });
});
