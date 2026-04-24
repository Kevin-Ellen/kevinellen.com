// tests/src/app-render-context/resolve/response-policy/robots.response-policy.resolve.app-render-context.test.ts

import { resolveRobotsAppRenderContext } from "@app-render-context/resolve/response-policy/robots.response-policy.resolve.app-render-context";

describe("resolveRobotsAppRenderContext", () => {
  it("returns an empty array when robots is null", () => {
    const result = resolveRobotsAppRenderContext(null);

    expect(result).toEqual([]);
  });

  it("adds inverted directives when allow flags are false", () => {
    const result = resolveRobotsAppRenderContext({
      allowIndex: false,
      allowFollow: false,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
    });

    expect(result).toEqual(["noindex", "nofollow"]);
  });

  it("adds direct directives when direct flags are true", () => {
    const result = resolveRobotsAppRenderContext({
      allowIndex: true,
      allowFollow: true,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    });

    expect(result).toEqual(["noarchive", "nosnippet", "noimageindex"]);
  });

  it("combines inverted and direct directives correctly", () => {
    const result = resolveRobotsAppRenderContext({
      allowIndex: false,
      allowFollow: true,
      noarchive: true,
      nosnippet: false,
      noimageindex: true,
    });

    expect(result).toEqual(["noindex", "noarchive", "noimageindex"]);
  });

  it("returns an empty array when everything is fully allowed", () => {
    const result = resolveRobotsAppRenderContext({
      allowIndex: true,
      allowFollow: true,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
    });

    expect(result).toEqual([]);
  });
});
