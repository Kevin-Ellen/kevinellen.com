// src/rendering/body-header/breadcrumbs.body-header.renderer.test.ts

import type { AppRenderContextBreadcrumbs } from "@shared-types/breadcrumbs/app-render-context.breadcrumbs.types";

import { renderBodyHeaderBreadcrumbs } from "@rendering/body-header/breadcrumbs.body-header.renderer";
import { renderTextLink } from "@rendering/shared/link.shared.renderer";

jest.mock("@rendering/shared/link.shared.renderer", () => ({
  renderTextLink: jest.fn(),
}));

const createBreadcrumbs = (
  overrides: Partial<AppRenderContextBreadcrumbs> = {},
): AppRenderContextBreadcrumbs =>
  ({
    items: [
      {
        kind: "internal",
        href: "/",
        text: "Home",
        openInNewTab: false,
        svg: null,
      },
      {
        kind: "internal",
        href: "/journal",
        text: "Journal",
        openInNewTab: false,
        svg: null,
      },
    ],
    current: "Coot notes",
    ...overrides,
  }) as AppRenderContextBreadcrumbs;

describe("renderBodyHeaderBreadcrumbs", () => {
  const mockedRenderTextLink = jest.mocked(renderTextLink);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderTextLink
      .mockReturnValueOnce(
        `<a href="/" class="l-header__breadcrumb-link">Home</a>`,
      )
      .mockReturnValueOnce(
        `<a href="/journal" class="l-header__breadcrumb-link">Journal</a>`,
      );
  });

  it("renders breadcrumbs", () => {
    const breadcrumbs = createBreadcrumbs();

    expect(renderBodyHeaderBreadcrumbs(breadcrumbs)).toBe(
      `<nav class="l-header__breadcrumb" aria-label="Breadcrumb"><ol class="l-header__breadcrumb-list"><li class="l-header__breadcrumb-item"><a href="/" class="l-header__breadcrumb-link">Home</a></li><li class="l-header__breadcrumb-item"><a href="/journal" class="l-header__breadcrumb-link">Journal</a></li><li class="l-header__breadcrumb-item" aria-current="page">Coot notes</li></ol></nav>`,
    );

    expect(mockedRenderTextLink).toHaveBeenNthCalledWith(1, {
      ...breadcrumbs.items[0],
      className: "l-header__breadcrumb-link",
    });

    expect(mockedRenderTextLink).toHaveBeenNthCalledWith(2, {
      ...breadcrumbs.items[1],
      className: "l-header__breadcrumb-link",
    });
  });

  it("renders breadcrumbs without parent items", () => {
    expect(
      renderBodyHeaderBreadcrumbs(
        createBreadcrumbs({
          items: [],
        }),
      ),
    ).toBe(
      `<nav class="l-header__breadcrumb" aria-label="Breadcrumb"><ol class="l-header__breadcrumb-list"><li class="l-header__breadcrumb-item" aria-current="page">Coot notes</li></ol></nav>`,
    );

    expect(mockedRenderTextLink).not.toHaveBeenCalled();
  });

  it("escapes current breadcrumb text", () => {
    const result = renderBodyHeaderBreadcrumbs(
      createBreadcrumbs({
        items: [],
        current: `Coot <script>alert("x")</script>`,
      }),
    );

    expect(result).toContain(
      `Coot &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;`,
    );
  });
});
