// tests/src/rendering/body-content/block/helpers/flow.block.body-content.helper.test.ts

import { getBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.body-content.helper";

describe("getBlockFlowClass", () => {
  it("returns l-content for content flow", () => {
    expect(getBlockFlowClass("content")).toBe("l-content");
  });

  it("defaults to l-content when flow is null", () => {
    expect(getBlockFlowClass(null)).toBe("l-content");
  });

  it("defaults to l-content when flow is undefined", () => {
    expect(getBlockFlowClass(undefined)).toBe("l-content");
  });

  it("returns a content block modifier class for non-content flow", () => {
    expect(getBlockFlowClass("breakout")).toBe("m-contentBlock--breakout");
  });

  it("escapes non-content flow values before rendering the class", () => {
    expect(getBlockFlowClass(`breakout" onclick="alert(1)` as never)).toBe(
      "m-contentBlock--breakout&quot; onclick=&quot;alert(1)",
    );
  });
});
