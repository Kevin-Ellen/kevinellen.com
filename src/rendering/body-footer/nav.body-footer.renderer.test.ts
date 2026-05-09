// src/rendering/body-footer/nav.body-footer.renderer.test.ts

import type { AppRenderContextFooterNavigation } from "@shared-types/config/navigation/footer/app-render-context.footer.navigation.types";

import { renderBodyFooterNav } from "@rendering/body-footer/nav.body-footer.renderer";
import { renderTextLink } from "@rendering/shared/link.shared.renderer";

jest.mock("@rendering/shared/link.shared.renderer", () => ({
  renderTextLink: jest.fn(),
}));

const createNav = (
  overrides: Partial<AppRenderContextFooterNavigation> = {},
): AppRenderContextFooterNavigation =>
  ({
    sections: [
      {
        id: "site",
        label: "Site",
        items: [
          {
            kind: "internal",
            href: "/journal",
            text: "Journal",
            openInNewTab: false,
            svg: null,
          },
        ],
      },
    ],
    ...overrides,
  }) as AppRenderContextFooterNavigation;

describe("renderBodyFooterNav", () => {
  const mockedRenderTextLink = jest.mocked(renderTextLink);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderTextLink.mockReturnValue(`<a href="/journal">Journal</a>`);
  });

  it("renders footer navigation", () => {
    const nav = createNav();

    expect(renderBodyFooterNav(nav)).toBe(
      `<div class="l-footer__grid"><section class="l-footer__group l-footer__group--site"><h3 class="l-footer__heading">Site</h3><ul class="l-footer__list"><li><a href="/journal">Journal</a></li></ul></section></div>`,
    );

    expect(mockedRenderTextLink).toHaveBeenCalledWith(nav.sections[0].items[0]);
  });

  it("renders empty navigation", () => {
    expect(
      renderBodyFooterNav(
        createNav({
          sections: [],
        }),
      ),
    ).toBe(`<div class="l-footer__grid"></div>`);

    expect(mockedRenderTextLink).not.toHaveBeenCalled();
  });

  it("escapes section label", () => {
    mockedRenderTextLink.mockReturnValue(`<a href="/bad">Bad</a>`);

    const result = renderBodyFooterNav(
      createNav({
        sections: [
          {
            id: "site",
            label: `Site <bad>`,
            items: [
              {
                kind: "internal",
                href: "/bad",
                text: "Bad",
                openInNewTab: false,
                svg: null,
              },
            ],
          },
        ],
      }),
    );

    expect(result).toContain(`l-footer__group--site`);
    expect(result).toContain(`Site &lt;bad&gt;`);
  });
});
