// tests/src/request/response/create-html.response.request.test.ts

import type { AppRenderContext } from "@app-render-context/class.app-render-context";

import { createHtmlResponse } from "@request/response/create-html.response.request";
import { createResponsePolicyHeaders } from "@request/response/policy.response.request";

jest.mock("@request/response/policy.response.request", () => ({
  createResponsePolicyHeaders: jest.fn(),
}));

describe("createHtmlResponse", () => {
  const mockedCreateResponsePolicyHeaders = jest.mocked(
    createResponsePolicyHeaders,
  );

  const env = {
    APP_ENV: "prod",
  } as Env;

  const buildAppRenderContext = (
    overrides?: Partial<{
      status: number;
      robots: string[];
      nonce: string;
    }>,
  ): AppRenderContext =>
    ({
      responsePolicy: {
        status: overrides?.status ?? 200,
        robots: overrides?.robots ?? [],
        nonce: overrides?.nonce ?? "test-nonce-123",
      },
    }) as unknown as AppRenderContext;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedCreateResponsePolicyHeaders.mockReturnValue(new Headers());
  });

  it("creates an HTML response with the correct status and content-type", async () => {
    const appRenderContext = buildAppRenderContext();

    const response = createHtmlResponse(
      "<!doctype html><html></html>",
      appRenderContext,
      env,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "text/html; charset=utf-8",
    );

    expect(mockedCreateResponsePolicyHeaders).toHaveBeenCalledWith(
      appRenderContext.responsePolicy,
      env,
    );

    await expect(response.text()).resolves.toBe("<!doctype html><html></html>");
  });

  it("uses the response policy status", () => {
    const response = createHtmlResponse(
      "<html><body>Gone</body></html>",
      buildAppRenderContext({
        status: 410,
      }),
      env,
    );

    expect(response.status).toBe(410);
  });

  it("preserves headers created by the response policy resolver", () => {
    const headers = new Headers({
      "x-robots-tag": "noindex, nofollow",
      "content-security-policy": "default-src 'self'",
    });

    mockedCreateResponsePolicyHeaders.mockReturnValue(headers);

    const response = createHtmlResponse(
      "<html></html>",
      buildAppRenderContext(),
      env,
    );

    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(response.headers.get("content-security-policy")).toBe(
      "default-src 'self'",
    );
  });
});
