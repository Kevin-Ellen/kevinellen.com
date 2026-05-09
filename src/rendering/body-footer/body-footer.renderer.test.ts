// src/rendering/body-footer/body-footer.renderer.test.ts

import type { AppRenderContextBodyFooter } from "@app-render-context/types/body-footer.app-render-context.types";

import { renderBodyFooter } from "@rendering/body-footer/body-footer.renderer";
import { renderBodyFooterAffiliations } from "@rendering/body-footer/affiliations.body-footer.renderer";
import { renderBodyFooterColophon } from "@rendering/body-footer/colophon.body-footer.renderer";
import { renderBodyFooterNav } from "@rendering/body-footer/nav.body-footer.renderer";

jest.mock("@rendering/body-footer/affiliations.body-footer.renderer", () => ({
  renderBodyFooterAffiliations: jest.fn(),
}));

jest.mock("@rendering/body-footer/colophon.body-footer.renderer", () => ({
  renderBodyFooterColophon: jest.fn(),
}));

jest.mock("@rendering/body-footer/nav.body-footer.renderer", () => ({
  renderBodyFooterNav: jest.fn(),
}));

const createBodyFooter = (
  overrides: Partial<AppRenderContextBodyFooter> = {},
): AppRenderContextBodyFooter =>
  ({
    nav: {
      sections: [],
    },
    affiliations: {
      items: [],
    },
    colophon: {
      items: [],
    },
    ...overrides,
  }) as AppRenderContextBodyFooter;

describe("renderBodyFooter", () => {
  const mockedRenderBodyFooterNav = jest.mocked(renderBodyFooterNav);
  const mockedRenderBodyFooterAffiliations = jest.mocked(
    renderBodyFooterAffiliations,
  );
  const mockedRenderBodyFooterColophon = jest.mocked(renderBodyFooterColophon);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderBodyFooterNav.mockReturnValue(`<nav>Footer nav</nav>`);
    mockedRenderBodyFooterAffiliations.mockReturnValue(
      `<section>Affiliations</section>`,
    );
    mockedRenderBodyFooterColophon.mockReturnValue(`<div>Colophon</div>`);
  });

  it("renders body footer shell and child sections", () => {
    const bodyFooter = createBodyFooter();

    expect(renderBodyFooter(bodyFooter)).toBe(
      `<footer class="l-footer"><h2 class="u-sr-only">Footer</h2><div class="l-page__frame"><nav>Footer nav</nav><section>Affiliations</section><div>Colophon</div></div></footer>`,
    );

    expect(mockedRenderBodyFooterNav).toHaveBeenCalledWith(bodyFooter.nav);
    expect(mockedRenderBodyFooterAffiliations).toHaveBeenCalledWith(
      bodyFooter.affiliations,
    );
    expect(mockedRenderBodyFooterColophon).toHaveBeenCalledWith(
      bodyFooter.colophon,
    );
  });
});
