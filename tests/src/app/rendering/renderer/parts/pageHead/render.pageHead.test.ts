// tests/src/app/rendering/renderer/parts/pageHead/render.pageHead.test.ts

import { renderPageHead } from "@app/rendering/renderer/parts/pageHead/render.pageHead";

import { renderPrimaryNav } from "@app/rendering/renderer/parts/pageHead/render.primaryNav.pageHead";
import { renderSocialNav } from "@app/rendering/renderer/parts/pageHead/render.socialNav.pageHead";
import { renderBreadcrumbs } from "@app/rendering/renderer/parts/pageHead/render.breadcrumbs.pageHead";

import { createDocumentRenderContext } from "@tests/src/app/rendering/renderer/render.test.fixtures";

jest.mock(
  "@app/rendering/renderer/parts/pageHead/render.primaryNav.pageHead",
  () => ({
    renderPrimaryNav: jest.fn(),
  }),
);

jest.mock(
  "@app/rendering/renderer/parts/pageHead/render.socialNav.pageHead",
  () => ({
    renderSocialNav: jest.fn(),
  }),
);

jest.mock(
  "@app/rendering/renderer/parts/pageHead/render.breadcrumbs.pageHead",
  () => ({
    renderBreadcrumbs: jest.fn(),
  }),
);

describe("renderPageHead", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (renderPrimaryNav as jest.Mock).mockReturnValue("<div>PRIMARY</div>");
    (renderSocialNav as jest.Mock).mockReturnValue("<div>SOCIAL</div>");
    (renderBreadcrumbs as jest.Mock).mockReturnValue("<nav>BREADCRUMBS</nav>");
  });

  it("renders page-head shell and helper output", () => {
    const ctx = createDocumentRenderContext();

    const html = renderPageHead(ctx);

    expect(html).toContain('<header class="l-header">');
    expect(html).toContain("<div>PRIMARY</div>");
    expect(html).toContain("<div>SOCIAL</div>");
    expect(html).toContain("<nav>BREADCRUMBS</nav>");
    expect(html).toContain(
      '<div class="l-header-sentinel" aria-hidden="true"></div>',
    );
  });

  it("passes the same context to all helpers", () => {
    const ctx = createDocumentRenderContext();

    renderPageHead(ctx);

    expect(renderPrimaryNav).toHaveBeenCalledWith(ctx);
    expect(renderSocialNav).toHaveBeenCalledWith(ctx);
    expect(renderBreadcrumbs).toHaveBeenCalledWith(ctx);
  });
});
