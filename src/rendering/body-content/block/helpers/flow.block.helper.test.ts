// src/rendering/body-content/block/helpers/flow.block.helper.test.ts

import { renderBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.helper";

describe("renderBlockFlowClass", () => {
  it("returns the content layout class for content flow", () => {
    expect(renderBlockFlowClass("content")).toBe("l-content");
  });

  it("returns the content layout class when flow is null", () => {
    expect(renderBlockFlowClass(null)).toBe("l-content");
  });

  it("returns the content layout class when flow is undefined", () => {
    expect(renderBlockFlowClass(undefined)).toBe("l-content");
  });

  it("returns the content block modifier class for non-content flow", () => {
    expect(renderBlockFlowClass("breakout")).toBe("m-contentBlock--breakout");
  });
});
