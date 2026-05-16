// src/rendering/body-header/body-header.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextBodyHeader } from "@app-render-context/types/body-header.app-render-context.types";

import { BodyHeaderTemplate } from "@rendering/body-header/body-header.template";

describe("BodyHeaderTemplate", () => {
  it("renders body header structure", () => {
    const bodyHeader = {
      branding: {
        href: "/",
        ariaLabel: "Kevin Ellen home",
        logo: {
          id: "logo-monogram-ke",
          width: 48,
          height: 48,
        },
      },
      navigation: {
        primary: [],
        social: [],
      },
      breadcrumbs: {
        items: [],
        current: "Home",
      },
    } as AppRenderContextBodyHeader;

    const html = renderToStaticMarkup(
      <BodyHeaderTemplate bodyHeader={bodyHeader} />,
    );

    expect(html).toContain('<header class="l-header">');
    expect(html).toContain('<div class="l-page__frame">');
    expect(html).toContain('<div class="l-header__top">');
    expect(html).toContain('class="l-header__brand"');
    expect(html).toContain('class="l-header__primary"');
    expect(html).toContain('class="l-header__breadcrumb"');
    expect(html).toContain(
      '<div class="l-header-sentinel" aria-hidden="true"></div>',
    );
  });
});
