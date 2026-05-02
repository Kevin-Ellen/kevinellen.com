// tests/src/rendering/body-header/body-header.renderer.test.ts

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

describe("renderBodyHeader", () => {
  const mockedBranding = jest.mocked(renderBodyHeaderBranding);
  const mockedNavigation = jest.mocked(renderBodyHeaderNavigation);
  const mockedBreadcrumbs = jest.mocked(renderBodyHeaderBreadcrumbs);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders header structure with branding, navigation, and breadcrumbs", () => {
    const bodyHeader = {
      branding: { foo: "branding" },
      navigation: { foo: "navigation" },
      breadcrumbs: { foo: "breadcrumbs" },
    } as never;

    mockedBranding.mockReturnValue("<branding />");
    mockedNavigation.mockReturnValue("<navigation />");
    mockedBreadcrumbs.mockReturnValue("<breadcrumbs />");

    const result = renderBodyHeader(bodyHeader);

    expect(result).toContain(`<header class="l-header">`);
    expect(result).toContain(`<div class="l-page__frame">`);
    expect(result).toContain(`<div class="l-header__top">`);

    expect(result).toContain("<branding />");
    expect(result).toContain("<navigation />");
    expect(result).toContain("<breadcrumbs />");

    expect(result).toContain(`l-header-sentinel`);
  });

  it("calls child renderers with correct inputs", () => {
    mockedBranding.mockReturnValue("");
    mockedNavigation.mockReturnValue("");
    mockedBreadcrumbs.mockReturnValue("");

    const bodyHeader = {
      branding: { a: 1 },
      navigation: { b: 2 },
      breadcrumbs: { c: 3 },
    };

    renderBodyHeader(bodyHeader as never);

    expect(mockedBranding).toHaveBeenCalledWith(bodyHeader.branding);
    expect(mockedNavigation).toHaveBeenCalledWith(bodyHeader.navigation);
    expect(mockedBreadcrumbs).toHaveBeenCalledWith(bodyHeader.breadcrumbs);
  });

  it("renders even when breadcrumbs output is empty", () => {
    const bodyHeader = {
      branding: {},
      navigation: {},
      breadcrumbs: {},
    } as never;

    mockedBranding.mockReturnValue("<branding />");
    mockedNavigation.mockReturnValue("<navigation />");
    mockedBreadcrumbs.mockReturnValue("");

    const result = renderBodyHeader(bodyHeader);

    expect(result).toContain("<branding />");
    expect(result).toContain("<navigation />");

    // breadcrumbs intentionally empty
    expect(result).not.toContain("<breadcrumbs />");
  });
});
