// src/app-render-context/create.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";

import { AppRenderContext } from "@app-render-context/class.app-render-context";
import { appRenderContextCreate } from "@app-render-context/create.app-render-context";
import { createNonceAppRenderContext } from "@app-render-context/shared/create-nonce.app-render-context";
import { appRenderContextResolveBodyContent } from "@app-render-context/resolve/body-content/body-content.resolve.app-render-context";
import { appRenderContextResolveBodyFooter } from "@app-render-context/resolve/body-footer/body-footer.resolve.app-render-context";
import { appRenderContextResolveBodyHeader } from "@app-render-context/resolve/body-header/body-header.resolve.app-render-context";
import { appRenderContextResolveDocClose } from "@app-render-context/resolve/doc-close/doc-close.resolve.app-render-context";
import { appRenderContextResolveDocOpen } from "@app-render-context/resolve/doc-open/doc-open.resolve.app-render-context";
import { appRenderContextResolveResponsePolicy } from "@app-render-context/resolve/response-policy/response-policy.resolve.app-render-context";

jest.mock("@app-render-context/shared/create-nonce.app-render-context", () => ({
  createNonceAppRenderContext: jest.fn(),
}));

jest.mock(
  "@app-render-context/resolve/response-policy/response-policy.resolve.app-render-context",
  () => ({
    appRenderContextResolveResponsePolicy: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/doc-open/doc-open.resolve.app-render-context",
  () => ({
    appRenderContextResolveDocOpen: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-header/body-header.resolve.app-render-context",
  () => ({
    appRenderContextResolveBodyHeader: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/body-content.resolve.app-render-context",
  () => ({
    appRenderContextResolveBodyContent: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-footer/body-footer.resolve.app-render-context",
  () => ({
    appRenderContextResolveBodyFooter: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/doc-close/doc-close.resolve.app-render-context",
  () => ({
    appRenderContextResolveDocClose: jest.fn(),
  }),
);

describe("appRenderContextCreate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates an AppRenderContext from resolved ARC sections", () => {
    const appContext = {} as unknown as AppContext;
    const env = {
      APP_HOST: "kevinellen.com",
    } as Env;

    jest.mocked(createNonceAppRenderContext).mockReturnValue("nonce-one");

    jest.mocked(appRenderContextResolveResponsePolicy).mockReturnValue({
      robots: [],
      nonce: "nonce-one",
      status: 200,
    } as never);

    jest.mocked(appRenderContextResolveDocOpen).mockReturnValue({
      nonce: "nonce-one",
    } as never);

    jest.mocked(appRenderContextResolveBodyHeader).mockReturnValue({
      branding: {},
    } as never);

    jest.mocked(appRenderContextResolveBodyContent).mockReturnValue({
      header: null,
      content: [],
      footer: [],
    } as never);

    jest.mocked(appRenderContextResolveBodyFooter).mockReturnValue({
      nav: {},
    } as never);

    jest.mocked(appRenderContextResolveDocClose).mockReturnValue({
      structuredData: [],
    } as never);

    const result = appRenderContextCreate(appContext, env);

    expect(result).toBeInstanceOf(AppRenderContext);

    expect(result.data).toEqual({
      responsePolicy: {
        robots: [],
        nonce: "nonce-one",
        status: 200,
      },
      docOpen: {
        nonce: "nonce-one",
      },
      bodyHeader: {
        branding: {},
      },
      bodyContent: {
        header: null,
        content: [],
        footer: [],
      },
      bodyFooter: {
        nav: {},
      },
      docClose: {
        structuredData: [],
      },
    });

    expect(appRenderContextResolveResponsePolicy).toHaveBeenCalledWith(
      appContext,
      {
        nonce: "nonce-one",
      },
    );

    expect(appRenderContextResolveDocOpen).toHaveBeenCalledWith(appContext, {
      nonce: "nonce-one",
    });

    expect(appRenderContextResolveBodyHeader).toHaveBeenCalledWith(appContext);
    expect(appRenderContextResolveBodyContent).toHaveBeenCalledWith(appContext);
    expect(appRenderContextResolveBodyFooter).toHaveBeenCalledWith(appContext);

    expect(appRenderContextResolveDocClose).toHaveBeenCalledWith(appContext, {
      nonce: "nonce-one",
      origin: "https://kevinellen.com",
    });
  });
});
