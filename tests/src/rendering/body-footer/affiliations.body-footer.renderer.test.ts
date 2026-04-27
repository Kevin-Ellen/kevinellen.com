// tests/src/rendering/body-footer/affiliations.body-footer.renderer.test.ts

import { renderBodyFooterAffiliations } from "@rendering/body-footer/affiliations.body-footer.renderer";

describe("renderBodyFooterAffiliations", () => {
  it("renders affiliation logos with external links", () => {
    const result = renderBodyFooterAffiliations({
      items: [
        {
          href: "https://www.rspb.org.uk/",
          ariaLabel: "RSPB",
          logo: {
            id: "logo-rspb",
            width: 100,
            height: 100,
          },
        },
      ],
    });

    expect(result).toContain('<section class="l-footer__conservation"');
    expect(result).toContain('href="https://www.rspb.org.uk/"');
    expect(result).toContain('target="_blank"');
    expect(result).toContain('aria-label="RSPB"');
    expect(result).toContain('<use href="#logo-rspb"></use>');
  });
});
