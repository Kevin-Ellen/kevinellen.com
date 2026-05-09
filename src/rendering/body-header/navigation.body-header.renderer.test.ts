// src/rendering/body-header/navigation.body-header.renderer.test.ts

import type { AppRenderContextBodyHeaderNavigation } from "@app-render-context/types/body-header.app-render-context.types";

import { renderBodyHeaderNavigation } from "@rendering/body-header/navigation.body-header.renderer";
import {
  renderLinkAttributes,
  renderTextLink,
} from "@rendering/shared/link.shared.renderer";
import { renderSvgReference } from "@rendering/shared/svg-reference.shared.renderer";

jest.mock("@rendering/shared/link.shared.renderer", () => ({
  renderLinkAttributes: jest.fn(),
  renderTextLink: jest.fn(),
}));

jest.mock("@rendering/shared/svg-reference.shared.renderer", () => ({
  renderSvgReference: jest.fn(),
}));

const createNavigation = (
  overrides: Partial<AppRenderContextBodyHeaderNavigation> = {},
): AppRenderContextBodyHeaderNavigation =>
  ({
    primary: [
      {
        kind: "internal",
        href: "/journal",
        text: "Journal",
        openInNewTab: false,
        svg: null,
      },
    ],
    social: [
      {
        kind: "external",
        href: "https://example.com",
        text: "GitHub",
        openInNewTab: true,
        svg: {
          id: "icon-github",
          width: 24,
          height: 24,
        },
      },
      {
        kind: "external",
        href: "https://example.com/rss",
        text: "RSS",
        openInNewTab: true,
        svg: null,
      },
    ],
    ...overrides,
  }) as AppRenderContextBodyHeaderNavigation;

describe("renderBodyHeaderNavigation", () => {
  const mockedRenderTextLink = jest.mocked(renderTextLink);
  const mockedRenderLinkAttributes = jest.mocked(renderLinkAttributes);
  const mockedRenderSvgReference = jest.mocked(renderSvgReference);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderTextLink
      .mockReturnValueOnce(
        `<a href="/journal" class="l-header__link">Journal</a>`,
      )
      .mockReturnValueOnce(
        `<a href="https://example.com/rss" class="l-header__link">RSS</a>`,
      );

    mockedRenderLinkAttributes.mockReturnValue(
      `class="l-header__link" href="https://example.com" aria-label="GitHub"`,
    );

    mockedRenderSvgReference.mockReturnValue(`<svg>GitHub</svg>`);
  });

  it("renders header navigation", () => {
    const navigation = createNavigation();

    expect(renderBodyHeaderNavigation(navigation)).toBe(
      `<nav class="l-header__primary" aria-label="Primary"><div class="l-header__nav"><ul class="l-header__list"><li class="l-header__item"><a href="/journal" class="l-header__link">Journal</a></li></ul></div><div class="l-header__social"><ul class="l-header__list l-header__list--social"><li class="l-header__item"><a class="l-header__link" href="https://example.com" aria-label="GitHub"><svg>GitHub</svg></a></li><li class="l-header__item"><a href="https://example.com/rss" class="l-header__link">RSS</a></li></ul></div></nav>`,
    );

    expect(mockedRenderTextLink).toHaveBeenNthCalledWith(1, {
      ...navigation.primary[0],
      className: "l-header__link",
    });

    expect(mockedRenderLinkAttributes).toHaveBeenCalledWith({
      ...navigation.social[0],
      className: "l-header__link",
      ariaLabel: "GitHub",
    });

    expect(mockedRenderSvgReference).toHaveBeenCalledWith(
      navigation.social[0].svg,
      "l-header__icon",
    );

    expect(mockedRenderTextLink).toHaveBeenNthCalledWith(2, {
      ...navigation.social[1],
      className: "l-header__link",
    });
  });

  it("renders empty navigation lists", () => {
    expect(
      renderBodyHeaderNavigation(
        createNavigation({
          primary: [],
          social: [],
        }),
      ),
    ).toBe(
      `<nav class="l-header__primary" aria-label="Primary"><div class="l-header__nav"><ul class="l-header__list"></ul></div><div class="l-header__social"><ul class="l-header__list l-header__list--social"></ul></div></nav>`,
    );

    expect(mockedRenderTextLink).not.toHaveBeenCalled();
    expect(mockedRenderLinkAttributes).not.toHaveBeenCalled();
    expect(mockedRenderSvgReference).not.toHaveBeenCalled();
  });
});
