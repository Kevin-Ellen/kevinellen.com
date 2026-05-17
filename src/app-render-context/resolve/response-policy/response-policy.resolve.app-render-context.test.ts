// src/app-render-context/resolve/response-policy/response-policy.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";

import { appRenderContextResolveResponsePolicy } from "@app-render-context/resolve/response-policy/response-policy.resolve.app-render-context";
import { appRenderContextResolveRobots } from "@app-render-context/resolve/response-policy/robots.response-policy.resolve.app-render-context";

jest.mock(
  "@app-render-context/resolve/response-policy/robots.response-policy.resolve.app-render-context",
  () => ({
    appRenderContextResolveRobots: jest.fn(),
  }),
);

describe("appRenderContextResolveResponsePolicy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves response policy with explicit status", () => {
    const appContext = {
      robots: {
        allowIndex: false,
      },
      page: {
        status: 404,
      },
    } as unknown as AppContext;

    jest.mocked(appRenderContextResolveRobots).mockReturnValue(["noindex"]);

    expect(
      appRenderContextResolveResponsePolicy(appContext, {
        nonce: "nonce-one",
      }),
    ).toEqual({
      robots: ["noindex"],
      nonce: "nonce-one",
      status: 404,
    });

    expect(appRenderContextResolveRobots).toHaveBeenCalledWith(
      appContext.robots,
    );
  });

  it("defaults status to 200 when page status is missing", () => {
    const appContext = {
      robots: null,
      page: {},
    } as unknown as AppContext;

    jest.mocked(appRenderContextResolveRobots).mockReturnValue([]);

    expect(
      appRenderContextResolveResponsePolicy(appContext, {
        nonce: "nonce-two",
      }),
    ).toEqual({
      robots: [],
      nonce: "nonce-two",
      status: 200,
    });
  });
});
