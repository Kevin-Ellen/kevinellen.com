// src/rendering/body-header/navigation.body-header.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextBodyHeaderNavigation } from "@app-render-context/types/body-header.app-render-context.types";

import { BodyHeaderNavigationTemplate } from "@rendering/body-header/navigation.body-header.template";

type NavigationLink = AppRenderContextBodyHeaderNavigation["primary"][number];

const internalNavLink = (
  overrides: Partial<NavigationLink> = {},
): NavigationLink =>
  ({
    kind: "internal",
    href: "/journal",
    text: "Journal",
    openInNewTab: false,
    svg: null,
    ariaCurrent: null,
    ...overrides,
  }) as NavigationLink;

const externalNavLink = (
  overrides: Partial<NavigationLink> = {},
): NavigationLink =>
  ({
    kind: "external",
    href: "https://example.com",
    text: "External",
    openInNewTab: true,
    svg: null,
    ariaCurrent: null,
    ...overrides,
  }) as NavigationLink;

const navigation = (
  overrides: Partial<AppRenderContextBodyHeaderNavigation> = {},
): AppRenderContextBodyHeaderNavigation =>
  ({
    primary: [
      internalNavLink(),
      internalNavLink({
        href: "/notes",
        text: "Notes",
      }),
    ],
    social: [
      externalNavLink({
        href: "https://instagram.com/example",
        text: "Instagram",
        svg: {
          id: "icon-instagram",
          width: 24,
          height: 24,
        },
      }),
      externalNavLink({
        href: "https://linkedin.com/example",
        text: "LinkedIn",
      }),
    ],
    ...overrides,
  }) as AppRenderContextBodyHeaderNavigation;

describe("BodyHeaderNavigationTemplate", () => {
  it("renders primary and social navigation", () => {
    expect(
      renderToStaticMarkup(
        <BodyHeaderNavigationTemplate navigation={navigation()} />,
      ),
    ).toBe(
      '<nav class="l-header__primary" aria-label="Primary"><div class="l-header__nav"><ul class="l-header__list"><li class="l-header__item"><a class="l-header__link" href="/journal">Journal</a></li><li class="l-header__item"><a class="l-header__link" href="/notes">Notes</a></li></ul></div><div class="l-header__social"><ul class="l-header__list l-header__list--social"><li class="l-header__item"><a class="l-header__link" href="https://instagram.com/example" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg class="l-header__icon" aria-hidden="true" width="24" height="24"><use href="#icon-instagram"></use></svg></a></li><li class="l-header__item"><a class="l-header__link" href="https://linkedin.com/example" target="_blank" rel="noopener noreferrer">LinkedIn</a></li></ul></div></nav>',
    );
  });

  it("renders empty navigation lists", () => {
    expect(
      renderToStaticMarkup(
        <BodyHeaderNavigationTemplate
          navigation={navigation({
            primary: [],
            social: [],
          })}
        />,
      ),
    ).toBe(
      '<nav class="l-header__primary" aria-label="Primary"><div class="l-header__nav"><ul class="l-header__list"></ul></div><div class="l-header__social"><ul class="l-header__list l-header__list--social"></ul></div></nav>',
    );
  });

  it("renders social links without SVGs as text links", () => {
    const html = renderToStaticMarkup(
      <BodyHeaderNavigationTemplate
        navigation={navigation({
          social: [
            externalNavLink({
              href: "https://github.com/example",
              text: "GitHub",
            }),
          ],
        })}
      />,
    );

    expect(html).toContain(">GitHub</a>");
    expect(html).not.toContain("l-header__icon");
  });
});
