// tests/src/app-render-context/create.app-render-context.test.ts

import { appRenderContextCreate } from "@app-render-context/create.app-render-context";
import { AppRenderContext } from "@app-render-context/class.app-render-context";

import { createNonceAppRenderContext } from "@app-render-context/shared/create-nonce.app-render-context";
import { resolveResponsePolicyAppRenderContext } from "@app-render-context/resolve/response-policy/response-policy.resolve.app-render-context";
import { resolveDocOpenAppRenderContext } from "@app-render-context/resolve/doc-open/doc-open.resolve.app-render-context";
import { resolveBodyHeaderAppRenderContext } from "@app-render-context/resolve/body-header/body-header.resolve.app-render-context";
import { resolveBodyContentAppRenderContext } from "@app-render-context/resolve/body-content/body-content.resolve.app-render-context";
import { resolveBodyFooterAppRenderContext } from "@app-render-context/resolve/body-footer/body-footer.resolve.app-render-context";
import { resolveDocCloseAppRenderContext } from "@app-render-context/resolve/doc-close/doc-close.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

jest.mock("@app-render-context/shared/create-nonce.app-render-context", () => ({
  createNonceAppRenderContext: jest.fn(),
}));

jest.mock(
  "@app-render-context/resolve/response-policy/response-policy.resolve.app-render-context",
  () => ({
    resolveResponsePolicyAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/doc-open/doc-open.resolve.app-render-context",
  () => ({
    resolveDocOpenAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-header/body-header.resolve.app-render-context",
  () => ({
    resolveBodyHeaderAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/body-content.resolve.app-render-context",
  () => ({
    resolveBodyContentAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-footer/body-footer.resolve.app-render-context",
  () => ({
    resolveBodyFooterAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/doc-close/doc-close.resolve.app-render-context",
  () => ({
    resolveDocCloseAppRenderContext: jest.fn(),
  }),
);

describe("appRenderContextCreate", () => {
  it("creates an AppRenderContext from resolved render context boundaries", () => {
    const appContext = {} as AppContext;

    const env = {
      APP_HOST: "dev.kevinellen.com",
    } as Env;

    const nonce = "test-nonce";
    const origin = "https://dev.kevinellen.com";

    const responsePolicy = {
      headers: {
        contentSecurityPolicy: "default-src 'self'",
      },
    };

    const docOpen = {
      html: '<!doctype html><html lang="en-GB">',
    };

    const bodyHeader = {
      branding: {
        href: "/",
      },
    };

    const bodyContent = {
      page: {
        id: "home",
      },
    };

    const bodyFooter = {
      colophon: {
        copyright: "© 2026 Kevin Ellen",
      },
    };

    const docClose = {
      scripts: [],
    };

    jest.mocked(createNonceAppRenderContext).mockReturnValue(nonce);

    jest
      .mocked(resolveResponsePolicyAppRenderContext)
      .mockReturnValue(responsePolicy as never);

    jest
      .mocked(resolveDocOpenAppRenderContext)
      .mockReturnValue(docOpen as never);

    jest
      .mocked(resolveBodyHeaderAppRenderContext)
      .mockReturnValue(bodyHeader as never);

    jest
      .mocked(resolveBodyContentAppRenderContext)
      .mockReturnValue(bodyContent as never);

    jest
      .mocked(resolveBodyFooterAppRenderContext)
      .mockReturnValue(bodyFooter as never);

    jest
      .mocked(resolveDocCloseAppRenderContext)
      .mockReturnValue(docClose as never);

    const result = appRenderContextCreate(appContext, env);

    expect(result).toBeInstanceOf(AppRenderContext);

    expect(createNonceAppRenderContext).toHaveBeenCalledTimes(1);

    expect(resolveResponsePolicyAppRenderContext).toHaveBeenCalledWith(
      appContext,
      { nonce },
    );

    expect(resolveDocOpenAppRenderContext).toHaveBeenCalledWith(appContext, {
      nonce,
    });

    expect(resolveBodyHeaderAppRenderContext).toHaveBeenCalledWith(appContext);
    expect(resolveBodyContentAppRenderContext).toHaveBeenCalledWith(appContext);
    expect(resolveBodyFooterAppRenderContext).toHaveBeenCalledWith(appContext);

    expect(resolveDocCloseAppRenderContext).toHaveBeenCalledWith(appContext, {
      nonce,
      origin,
    });

    expect(result.inspect).toEqual({
      responsePolicy,
      docOpen,
      bodyHeader,
      bodyContent,
      bodyFooter,
      docClose,
    });
  });
});
