// src/rendering/body-header/body-header.renderer.test.ts

import type { AppRenderContextBodyHeader } from "@app-render-context/types/body-header.app-render-context.types";

import { renderBodyHeader } from "@rendering/body-header/body-header.renderer";

import { renderBodyHeaderBranding } from "@rendering/body-header/branding.body-header.renderer";
import { renderBodyHeaderNavigation } from "@rendering/body-header/navigation.body-header.renderer";
import { renderBodyHeaderBreadcrumbs } from "@rendering/body-header/breadcrumbs.body-header.renderer";

jest.mock("@rendering/body-header/branding.body-header.renderer", () => ({
  renderBodyHeaderBranding: jest.fn(),
}));

jest.mock("@rendering/body-header/navigation.body-header.renderer", () => ({
  renderBodyHeaderNavigation: jest.fn(),
}));

jest.mock("@rendering/body-header/breadcrumbs.body-header.renderer", () => ({
  renderBodyHeaderBreadcrumbs: jest.fn(),
}));

const createBodyHeader = (
  overrides: Partial<AppRenderContextBodyHeader> = {},
): AppRenderContextBodyHeader =>
  ({
    branding: {
      href: "/",
      ariaLabel: "Kevin Ellen home",
      logo: {
        id: "logo-rspb",
        width: 120,
        height: 40,
      },
    },
    navigation: {
      primary: [],
      social: [],
    },
    breadcrumbs: {
      items: [],
      current: "Journal",
    },
    ...overrides,
  }) as AppRenderContextBodyHeader;

describe("renderBodyHeader", () => {
  const mockedRenderBodyHeaderBranding = jest.mocked(renderBodyHeaderBranding);

  const mockedRenderBodyHeaderNavigation = jest.mocked(
    renderBodyHeaderNavigation,
  );

  const mockedRenderBodyHeaderBreadcrumbs = jest.mocked(
    renderBodyHeaderBreadcrumbs,
  );

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderBodyHeaderBranding.mockReturnValue(
      `<a class="l-header__brand">Brand</a>`,
    );

    mockedRenderBodyHeaderNavigation.mockReturnValue(
      `<nav class="l-header__primary">Navigation</nav>`,
    );

    mockedRenderBodyHeaderBreadcrumbs.mockReturnValue(
      `<nav class="l-header__breadcrumb">Breadcrumbs</nav>`,
    );
  });

  it("renders body header", () => {
    const bodyHeader = createBodyHeader();

    expect(renderBodyHeader(bodyHeader)).toBe(
      `<header class="l-header"><div class="l-page__frame"><div class="l-header__top"><a class="l-header__brand">Brand</a><nav class="l-header__primary">Navigation</nav></div><nav class="l-header__breadcrumb">Breadcrumbs</nav></div></header><div class="l-header-sentinel" aria-hidden="true"></div>`,
    );

    expect(mockedRenderBodyHeaderBranding).toHaveBeenCalledWith(
      bodyHeader.branding,
    );

    expect(mockedRenderBodyHeaderNavigation).toHaveBeenCalledWith(
      bodyHeader.navigation,
    );

    expect(mockedRenderBodyHeaderBreadcrumbs).toHaveBeenCalledWith(
      bodyHeader.breadcrumbs,
    );
  });
});
