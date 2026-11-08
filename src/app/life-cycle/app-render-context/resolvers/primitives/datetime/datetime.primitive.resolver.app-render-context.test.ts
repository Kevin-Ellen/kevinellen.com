// src/app/life-cycle/app-render-context/resolvers/primitives/datetime/datetime.primitive.resolver.app-render-context.test.ts

import { resolveDisplayDateAppRenderContext } from "./datetime.primitive.resolver.app-render-context";

describe("Datetime primitive AppRenderContext resolver", () => {
  it.each([
    ["2026-11-06", "6 November 2026"],
    ["2026-01-01", "1 January 2026"],
    ["2026-12-31", "31 December 2026"],
    ["2024-02-29", "29 February 2024"],
    ["2000-01-01", "1 January 2000"],
  ])("formats %s as %s", (iso, expected) => {
    expect(resolveDisplayDateAppRenderContext({ iso })).toEqual({
      iso,
      label: expected,
    });
  });

  it("preserves the complete original ISO value", () => {
    const iso = "2026-10-15T23:45:00.000Z";

    expect(resolveDisplayDateAppRenderContext({ iso })).toEqual({
      iso,
      label: "15 October 2026",
    });
  });

  it("uses the calendar date rather than a timestamp offset", () => {
    const result = resolveDisplayDateAppRenderContext({
      iso: "2026-10-15T23:30:00-05:00",
    });

    expect(result.label).toBe("15 October 2026");
  });

  it("does not depend on the current date", () => {
    const result = resolveDisplayDateAppRenderContext({
      iso: "1995-07-12",
    });

    expect(result.label).toBe("12 July 1995");
  });

  it("returns a new display object", () => {
    const first = resolveDisplayDateAppRenderContext({
      iso: "2026-11-06",
    });

    const second = resolveDisplayDateAppRenderContext({
      iso: "2026-11-06",
    });

    expect(first).toEqual(second);
    expect(first).not.toBe(second);
  });
});
