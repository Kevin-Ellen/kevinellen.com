// src/rendering/body-footer/nav.body-footer.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextFooterNavigation } from "@shared-types/config/navigation/footer/app-render-context.footer.navigation.types";

import { BodyFooterNavTemplate } from "@rendering/body-footer/nav.body-footer.template";

const nav = (
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
          },
          {
            kind: "internal",
            href: "/notes",
            text: "Notes",
            openInNewTab: false,
          },
        ],
      },
    ],
    ...overrides,
  }) as AppRenderContextFooterNavigation;

describe("BodyFooterNavTemplate", () => {
  it("renders footer navigation", () => {
    expect(renderToStaticMarkup(<BodyFooterNavTemplate nav={nav()} />)).toBe(
      '<div class="l-footer__grid"><section class="l-footer__group l-footer__group--site"><h3 class="l-footer__heading">Site</h3><ul class="l-footer__list"><li><a href="/journal">Journal</a></li><li><a href="/notes">Notes</a></li></ul></section></div>',
    );
  });

  it("renders empty sections", () => {
    expect(
      renderToStaticMarkup(
        <BodyFooterNavTemplate nav={nav({ sections: [] })} />,
      ),
    ).toBe('<div class="l-footer__grid"></div>');
  });
});
