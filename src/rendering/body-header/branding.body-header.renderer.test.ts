// src/rendering/body-header/branding.body-header.renderer.test.ts

import type { AppRenderContextBodyHeaderBranding } from "@app-render-context/types/body-header.app-render-context.types";

import { renderBodyHeaderBranding } from "@rendering/body-header/branding.body-header.renderer";
import { renderSvgReference } from "@rendering/shared/svg-reference.shared.renderer";

jest.mock("@rendering/shared/svg-reference.shared.renderer", () => ({
  renderSvgReference: jest.fn(),
}));

const createBranding = (
  overrides: Partial<AppRenderContextBodyHeaderBranding> = {},
): AppRenderContextBodyHeaderBranding =>
  ({
    href: "/",
    ariaLabel: "Kevin Ellen home",
    logo: {
      id: "logo-rspb",
      width: 120,
      height: 40,
    },
    ...overrides,
  }) as AppRenderContextBodyHeaderBranding;

describe("renderBodyHeaderBranding", () => {
  const mockedRenderSvgReference = jest.mocked(renderSvgReference);

  beforeEach(() => {
    jest.clearAllMocks();
    mockedRenderSvgReference.mockReturnValue(`<svg>Logo</svg>`);
  });

  it("renders branding link", () => {
    const branding = createBranding();

    expect(renderBodyHeaderBranding(branding)).toBe(
      `<a class="l-header__brand" href="/" aria-label="Kevin Ellen home"><svg>Logo</svg></a>`,
    );

    expect(mockedRenderSvgReference).toHaveBeenCalledWith(
      branding.logo,
      "l-header__brand-logo",
    );
  });

  it("escapes link attributes", () => {
    const result = renderBodyHeaderBranding(
      createBranding({
        href: `/"bad"`,
        ariaLabel: `Home "bad" <site>`,
      }),
    );

    expect(result).toContain(`href="/&quot;bad&quot;"`);
    expect(result).toContain(`aria-label="Home &quot;bad&quot; &lt;site&gt;"`);
  });
});
