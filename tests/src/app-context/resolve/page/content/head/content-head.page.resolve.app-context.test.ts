// tests/src/app-context/resolve/page/content/head/content-head.page.resolve.app-context.test.ts

import { appContextResolvePageContentHead } from "@app-context/resolve/page/content/head/content-head.page.resolve.app-context";

describe("appContextResolvePageContentHead", () => {
  it("returns the head unchanged", () => {
    const head = {
      title: "About",
      eyebrow: null,
      intro: null,
    } as const;

    const result = appContextResolvePageContentHead(head, {} as never);

    expect(result).toBe(head);
  });

  it("returns a stable reference (no cloning)", () => {
    const head = {
      title: "Home",
      eyebrow: "Field notes",
      intro: "Welcome to the site",
    } as const;

    const result = appContextResolvePageContentHead(head, {} as never);

    expect(result).toBe(head);
  });
});
