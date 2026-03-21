// tests/src/app/rendering/renderer/parts/pageHead/render.breadcrumbs.pageHead.test.ts

import { renderBreadcrumbs } from "@app/rendering/renderer/parts/pageHead/render.breadcrumbs.pageHead";
import { createDocumentRenderContext } from "@tests/src/app/rendering/renderer/render.test.fixtures";

describe("renderBreadcrumbs", () => {
  it("renders breadcrumbs in order", () => {
    const ctx = createDocumentRenderContext({
      pageHead: {
        navigation: {
          primary: [],
          social: [],
        },
        breadcrumbs: [
          {
            id: "home",
            label: "Home",
            href: "/",
          },
          {
            id: "journal",
            label: "Journal",
            href: "/journal",
          },
        ],
      },
    });

    const html = renderBreadcrumbs(ctx);

    expect(html).toContain('href="/"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain("Journal");
    expect(html).not.toContain('href="/journal"');
  });

  it("returns empty string when breadcrumb trail is empty", () => {
    const ctx = createDocumentRenderContext({
      pageHead: {
        navigation: {
          primary: [],
          social: [],
        },
        breadcrumbs: [],
      },
    });

    const html = renderBreadcrumbs(ctx);

    expect(html).toBe("");
  });
});
