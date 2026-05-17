// src/rendering/body-footer/affiliations.body-footer.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextBodyFooterAffiliations } from "@app-render-context/types/body-footer.app-render-context.types";

import { BodyFooterAffiliationsTemplate } from "@rendering/body-footer/affiliations.body-footer.template";

const affiliations = (
  overrides: Partial<AppRenderContextBodyFooterAffiliations> = {},
): AppRenderContextBodyFooterAffiliations =>
  ({
    items: [
      {
        href: "https://www.rspb.org.uk",
        ariaLabel: "RSPB",
        logo: {
          id: "logo-rspb",
          width: 48,
          height: 24,
        },
      },
      {
        href: "https://www.nationaltrust.org.uk",
        ariaLabel: "National Trust",
        logo: {
          id: "logo-national-trust",
          width: 48,
          height: 24,
        },
      },
    ],
    ...overrides,
  }) as AppRenderContextBodyFooterAffiliations;

describe("BodyFooterAffiliationsTemplate", () => {
  it("renders affiliations", () => {
    expect(
      renderToStaticMarkup(
        <BodyFooterAffiliationsTemplate affiliations={affiliations()} />,
      ),
    ).toBe(
      '<section class="l-footer__conservation" aria-labelledby="footer-conservation-heading"><h3 id="footer-conservation-heading" class="l-footer__heading">Conservation</h3><ul class="l-footer__logos" aria-label="Supported organisations"><li><a href="https://www.rspb.org.uk" target="_blank" rel="noopener noreferrer" aria-label="RSPB"><svg class="l-footer__icon" aria-hidden="true" width="48" height="24"><use href="#logo-rspb"></use></svg></a></li><li><a href="https://www.nationaltrust.org.uk" target="_blank" rel="noopener noreferrer" aria-label="National Trust"><svg class="l-footer__icon" aria-hidden="true" width="48" height="24"><use href="#logo-national-trust"></use></svg></a></li></ul></section>',
    );
  });

  it("renders an empty affiliations list", () => {
    expect(
      renderToStaticMarkup(
        <BodyFooterAffiliationsTemplate
          affiliations={affiliations({
            items: [],
          })}
        />,
      ),
    ).toBe(
      '<section class="l-footer__conservation" aria-labelledby="footer-conservation-heading"><h3 id="footer-conservation-heading" class="l-footer__heading">Conservation</h3><ul class="l-footer__logos" aria-label="Supported organisations"></ul></section>',
    );
  });
});
