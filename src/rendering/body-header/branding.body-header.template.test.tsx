// src/rendering/body-header/branding.body-header.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextBodyHeaderBranding } from "@app-render-context/types/body-header.app-render-context.types";

import { BodyHeaderBrandingTemplate } from "@rendering/body-header/branding.body-header.template";

describe("BodyHeaderBrandingTemplate", () => {
  it("renders the site branding", () => {
    const branding = {
      href: "/",
      ariaLabel: "Kevin Ellen home",
      logo: {
        id: "logo-monogram-ke",
        width: 48,
        height: 48,
      },
    } as AppRenderContextBodyHeaderBranding;

    expect(
      renderToStaticMarkup(<BodyHeaderBrandingTemplate branding={branding} />),
    ).toBe(
      '<a class="l-header__brand" href="/" aria-label="Kevin Ellen home"><svg class="l-header__brand-logo" aria-hidden="true" width="48" height="48"><use href="#logo-monogram-ke"></use></svg></a>',
    );
  });
});
