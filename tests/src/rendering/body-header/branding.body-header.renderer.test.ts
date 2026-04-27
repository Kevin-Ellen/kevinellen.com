// tests/src/rendering/body-header/branding.body-header.renderer.test.ts

import { renderBodyHeaderBranding } from "@rendering/body-header/branding.body-header.renderer";

describe("renderBodyHeaderBranding", () => {
  it("renders the header brand link with logo", () => {
    const result = renderBodyHeaderBranding({
      href: "/",
      ariaLabel: "Kevin Ellen home",
      logo: {
        id: "logo-monogram-ke",
        width: 100,
        height: 100,
      },
    });

    expect(result).toContain(
      '<a class="l-header__brand" href="/" aria-label="Kevin Ellen home">',
    );
    expect(result).toContain('<svg class="l-header__brand-logo"');
    expect(result).toContain('<use href="#logo-monogram-ke"></use>');
  });
});
