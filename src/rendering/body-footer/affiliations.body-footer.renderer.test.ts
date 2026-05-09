// src/rendering/body-footer/affiliations.body-footer.renderer.test.ts

import type { AppRenderContextBodyFooterAffiliations } from "@app-render-context/types/body-footer.app-render-context.types";

import { renderBodyFooterAffiliations } from "@rendering/body-footer/affiliations.body-footer.renderer";
import { renderLinkAttributes } from "@rendering/shared/link.shared.renderer";
import { renderSvgReference } from "@rendering/shared/svg-reference.shared.renderer";

jest.mock("@rendering/shared/link.shared.renderer", () => ({
  renderLinkAttributes: jest.fn(),
}));

jest.mock("@rendering/shared/svg-reference.shared.renderer", () => ({
  renderSvgReference: jest.fn(),
}));

const createAffiliations = (
  overrides: Partial<AppRenderContextBodyFooterAffiliations> = {},
): AppRenderContextBodyFooterAffiliations =>
  ({
    items: [
      {
        href: "https://www.rspb.org.uk",
        ariaLabel: "RSPB",
        logo: {
          id: "logo-rspb",
          width: 32,
          height: 32,
        },
      },
      {
        href: "https://www.essexwt.org.uk",
        ariaLabel: "Essex Wildlife Trust",
        logo: {
          id: "logo-essex-wt",
          width: 40,
          height: 40,
        },
      },
    ],
    ...overrides,
  }) as AppRenderContextBodyFooterAffiliations;

describe("renderBodyFooterAffiliations", () => {
  const mockedRenderLinkAttributes = jest.mocked(renderLinkAttributes);

  const mockedRenderSvgReference = jest.mocked(renderSvgReference);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderLinkAttributes
      .mockReturnValueOnce(
        `class="l-footer__link" href="https://www.rspb.org.uk"`,
      )
      .mockReturnValueOnce(
        `class="l-footer__link" href="https://www.essexwt.org.uk"`,
      );

    mockedRenderSvgReference
      .mockReturnValueOnce(`<svg>RSPB</svg>`)
      .mockReturnValueOnce(`<svg>Essex WT</svg>`);
  });

  it("renders footer affiliations", () => {
    const affiliations = createAffiliations();

    expect(renderBodyFooterAffiliations(affiliations)).toBe(
      `<section class="l-footer__conservation" aria-labelledby="footer-conservation-heading"><h3 id="footer-conservation-heading" class="l-footer__heading">Conservation</h3><ul class="l-footer__logos" aria-label="Supported organisations"><li><a class="l-footer__link" href="https://www.rspb.org.uk"><svg>RSPB</svg></a></li><li><a class="l-footer__link" href="https://www.essexwt.org.uk"><svg>Essex WT</svg></a></li></ul></section>`,
    );

    expect(mockedRenderLinkAttributes).toHaveBeenNthCalledWith(1, {
      kind: "external",
      href: "https://www.rspb.org.uk",
      text: "RSPB",
      openInNewTab: true,
      svg: null,
      ariaLabel: "RSPB",
    });

    expect(mockedRenderLinkAttributes).toHaveBeenNthCalledWith(2, {
      kind: "external",
      href: "https://www.essexwt.org.uk",
      text: "Essex Wildlife Trust",
      openInNewTab: true,
      svg: null,
      ariaLabel: "Essex Wildlife Trust",
    });

    expect(mockedRenderSvgReference).toHaveBeenNthCalledWith(
      1,
      affiliations.items[0].logo,
      "l-footer__icon",
    );

    expect(mockedRenderSvgReference).toHaveBeenNthCalledWith(
      2,
      affiliations.items[1].logo,
      "l-footer__icon",
    );
  });

  it("renders empty affiliations list", () => {
    expect(
      renderBodyFooterAffiliations(
        createAffiliations({
          items: [],
        }),
      ),
    ).toBe(
      `<section class="l-footer__conservation" aria-labelledby="footer-conservation-heading"><h3 id="footer-conservation-heading" class="l-footer__heading">Conservation</h3><ul class="l-footer__logos" aria-label="Supported organisations"></ul></section>`,
    );

    expect(mockedRenderLinkAttributes).not.toHaveBeenCalled();
    expect(mockedRenderSvgReference).not.toHaveBeenCalled();
  });
});
