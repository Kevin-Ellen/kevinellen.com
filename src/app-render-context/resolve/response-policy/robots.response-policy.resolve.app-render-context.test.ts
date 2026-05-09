// src/app-render-context/resolve/response-policy/robots.response-policy.resolve.app-render-context.test.ts

import { appRenderContextResolveRobots } from "@app-render-context/resolve/response-policy/robots.response-policy.resolve.app-render-context";

describe("appRenderContextResolveRobots", () => {
  it("returns empty directives when robots is null", () => {
    expect(appRenderContextResolveRobots(null)).toEqual([]);
  });

  it("returns inverted directives when indexing and following are disabled", () => {
    expect(
      appRenderContextResolveRobots({
        allowIndex: false,
        allowFollow: false,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
      }),
    ).toEqual(["noindex", "nofollow"]);
  });

  it("includes direct robot directives when enabled", () => {
    expect(
      appRenderContextResolveRobots({
        allowIndex: true,
        allowFollow: true,
        noarchive: true,
        nosnippet: true,
        noimageindex: true,
      }),
    ).toEqual(["noarchive", "nosnippet", "noimageindex"]);
  });

  it("combines inverted and direct directives", () => {
    expect(
      appRenderContextResolveRobots({
        allowIndex: false,
        allowFollow: true,
        noarchive: true,
        nosnippet: false,
        noimageindex: true,
      }),
    ).toEqual(["noindex", "noarchive", "noimageindex"]);
  });

  it("returns an empty array when all directives are permissive", () => {
    expect(
      appRenderContextResolveRobots({
        allowIndex: true,
        allowFollow: true,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
      }),
    ).toEqual([]);
  });
});
