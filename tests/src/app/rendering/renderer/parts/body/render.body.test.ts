// tests/src/app/rendering/renderer/parts/body/render.body.test.ts

import { renderBody } from "@app/rendering/renderer/parts/body/render.body";
import { createDocumentRenderContext } from "@tests/src/app/rendering/renderer/render.test.fixtures";

describe("renderBody", () => {
  it("renders body output", () => {
    const ctx = createDocumentRenderContext();

    const html = renderBody(ctx);

    expect(typeof html).toBe("string");
  });
});
