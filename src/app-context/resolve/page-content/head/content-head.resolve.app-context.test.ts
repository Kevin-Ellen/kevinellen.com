// src/app-context/resolve/page-content/head/content-head.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStatePageContentHead } from "@shared-types/page-content/site/content-head/app-state.content-head.types";

import { appContextResolvePageContentHead } from "@app-context/resolve/page-content/head/content-head.resolve.app-context";

describe("appContextResolvePageContentHead", () => {
  it("returns the content head unchanged", () => {
    const context = {} as AppContextPageContentResolverContext;

    const head: AppStatePageContentHead = {
      title: "Birds of Epping Forest",
      eyebrow: "Field Notes",
      intro: "Observations from a spring walk through the forest.",
      showInBody: true,
    };

    const result = appContextResolvePageContentHead(head, context);

    expect(result).toEqual(head);
    expect(result).toBe(head);
  });
});
