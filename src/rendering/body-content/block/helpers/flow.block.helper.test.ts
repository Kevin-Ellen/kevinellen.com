// src/rendering/body-content/block/helpers/flow.block.helper.test.ts

import { getBlockFlowClassName } from "@rendering/body-content/block/helpers/flow.block.helper";

describe("getBlockFlowClassName", () => {
  it("returns the content layout class for content flow", () => {
    expect(getBlockFlowClassName("content")).toBe("l-content");
  });

  it("returns the content layout class when flow is null", () => {
    expect(getBlockFlowClassName(null)).toBe("l-content");
  });

  it("returns the content layout class when flow is undefined", () => {
    expect(getBlockFlowClassName(undefined)).toBe("l-content");
  });

  it("returns the content block modifier class for non-content flow", () => {
    expect(getBlockFlowClassName("breakout")).toBe("m-contentBlock--breakout");
  });
});
