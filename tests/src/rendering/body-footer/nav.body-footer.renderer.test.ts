// tests/src/rendering/body-footer/nav.body-footer.renderer.test.ts

import { renderBodyFooterNav } from "@rendering/body-footer/nav.body-footer.renderer";

describe("renderBodyFooterNav", () => {
  it("renders footer navigation sections and links", () => {
    const result = renderBodyFooterNav({
      sections: [
        {
          id: "site",
          label: "Site",
          items: [
            {
              kind: "internal",
              href: "/about",
              text: "About",
              openInNewTab: false,
              svg: null,
            },
          ],
        },
      ],
    });

    expect(result).toContain('<div class="l-footer__grid">');
    expect(result).toContain(
      '<section class="l-footer__group l-footer__group--site">',
    );
    expect(result).toContain('<h3 class="l-footer__heading">Site</h3>');
    expect(result).toContain('<a href="/about">About</a>');
  });
});
