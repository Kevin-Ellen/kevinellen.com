// tests/src/app-render-context/resolve/response-policy.resolve.app-render-context.test.ts

import { resolveResponsePolicyAppRenderContext } from "@app-render-context/resolve/response-policy/response-policy.resolve.app-render-context";
import { resolveRobotsAppRenderContext } from "@app-render-context/resolve/response-policy/robots.response-policy.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

jest.mock(
  "@app-render-context/resolve/response-policy/robots.response-policy.resolve.app-render-context",
  () => ({
    resolveRobotsAppRenderContext: jest.fn(),
  }),
);

describe("resolveResponsePolicyAppRenderContext", () => {
  it("resolves response policy with explicit page status", () => {
    const appContext = {
      robots: {
        allowIndex: true,
        allowFollow: true,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
      },
      page: {
        status: 404,
      },
    } as unknown as AppContext;

    const nonce = "test-nonce";
    const directives = ["noindex", "nofollow"];

    jest
      .mocked(resolveRobotsAppRenderContext)
      .mockReturnValue(directives as never);

    const result = resolveResponsePolicyAppRenderContext(appContext, {
      nonce,
    });

    expect(resolveRobotsAppRenderContext).toHaveBeenCalledWith(
      appContext.robots,
    );

    expect(result).toEqual({
      robots: directives,
      nonce,
      status: 404,
    });
  });

  it("defaults status to 200 when page status is null", () => {
    const appContext = {
      robots: null,
      page: {
        status: null,
      },
    } as unknown as AppContext;

    const nonce = "test-nonce";

    jest.mocked(resolveRobotsAppRenderContext).mockReturnValue([]);

    const result = resolveResponsePolicyAppRenderContext(appContext, {
      nonce,
    });

    expect(result).toEqual({
      robots: [],
      nonce,
      status: 200,
    });
  });
});
