// src/rendering/body-header/breadcrumbs.body-header.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextBreadcrumbs } from "@shared-types/breadcrumbs/app-render-context.breadcrumbs.types";

import { BodyHeaderBreadcrumbsTemplate } from "@rendering/body-header/breadcrumbs.body-header.template";

const breadcrumbs = (
  overrides: Partial<AppRenderContextBreadcrumbs> = {},
): AppRenderContextBreadcrumbs =>
  ({
    items: [
      {
        kind: "internal",
        href: "/",
        text: "Home",
        openInNewTab: false,
      },
      {
        kind: "internal",
        href: "/journal",
        text: "Journal",
        openInNewTab: false,
      },
    ],
    current: "Kingfisher Notes",
    ...overrides,
  }) as AppRenderContextBreadcrumbs;

describe("BodyHeaderBreadcrumbsTemplate", () => {
  it("renders breadcrumb navigation", () => {
    expect(
      renderToStaticMarkup(
        <BodyHeaderBreadcrumbsTemplate breadcrumbs={breadcrumbs()} />,
      ),
    ).toBe(
      '<nav class="l-header__breadcrumb" aria-label="Breadcrumb"><ol class="l-header__breadcrumb-list"><li class="l-header__breadcrumb-item"><a class="l-header__breadcrumb-link" href="/">Home</a></li><li class="l-header__breadcrumb-item"><a class="l-header__breadcrumb-link" href="/journal">Journal</a></li><li class="l-header__breadcrumb-item" aria-current="page">Kingfisher Notes</li></ol></nav>',
    );
  });

  it("renders only the current item when breadcrumb items are empty", () => {
    expect(
      renderToStaticMarkup(
        <BodyHeaderBreadcrumbsTemplate
          breadcrumbs={breadcrumbs({
            items: [],
          })}
        />,
      ),
    ).toBe(
      '<nav class="l-header__breadcrumb" aria-label="Breadcrumb"><ol class="l-header__breadcrumb-list"><li class="l-header__breadcrumb-item" aria-current="page">Kingfisher Notes</li></ol></nav>',
    );
  });

  it("escapes breadcrumb current text safely", () => {
    expect(
      renderToStaticMarkup(
        <BodyHeaderBreadcrumbsTemplate
          breadcrumbs={breadcrumbs({
            current: '<script>alert("x")</script>',
          })}
        />,
      ),
    ).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
  });
});
