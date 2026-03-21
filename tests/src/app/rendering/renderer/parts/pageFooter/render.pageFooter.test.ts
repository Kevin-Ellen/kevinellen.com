// tests/src/app/rendering/renderer/parts/pageFooter/render.pageFooter.test.ts

import { renderPageFooter } from "@app/rendering/renderer/parts/pageFooter/render.pageFooter";
import { createDocumentRenderContext } from "@tests/src/app/rendering/renderer/render.test.fixtures";

describe("renderPageFooter", () => {
  it("renders footer sections and items", () => {
    const ctx = createDocumentRenderContext();

    const html = renderPageFooter(ctx);

    expect(html).toContain("Site");
    expect(html).toContain("Elsewhere");
    expect(html).toContain("Home");
    expect(html).toContain("About");
    expect(html).toContain("GitHub");
  });
});
