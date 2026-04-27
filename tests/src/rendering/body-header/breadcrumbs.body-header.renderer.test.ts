// tests/src/rendering/body-header/breadcrumbs.body-header.renderer.test.ts

import { renderBodyHeaderBreadcrumbs } from "@rendering/body-header/breadcrumbs.body-header.renderer";

describe("renderBodyHeaderBreadcrumbs", () => {
  it("renders breadcrumb items and current page", () => {
    const result = renderBodyHeaderBreadcrumbs({
      items: [
        {
          kind: "internal",
          href: "/",
          text: "Home",
          openInNewTab: false,
          svg: null,
        },
      ],
      current: "About <me>",
    });

    expect(result).toContain(
      '<nav class="l-header__breadcrumb" aria-label="Breadcrumb">',
    );
    expect(result).toContain(
      '<a class="l-header__breadcrumb-link" href="/">Home</a>',
    );
    expect(result).toContain("About &lt;me&gt;");
    expect(result).toContain('aria-current="page"');
  });
});
