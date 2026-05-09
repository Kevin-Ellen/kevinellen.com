// src/request/response/create-html.response.request.test.ts

import { createHtmlResponse } from "@request/response/create-html.response.request";
import { createResponsePolicyHeaders } from "@request/response/policy.response.request";

jest.mock("@request/response/policy.response.request", () => ({
  createResponsePolicyHeaders: jest.fn(),
}));

const createEnv = (): Env => ({ APP_ENV: "prod" }) as Env;

describe("createHtmlResponse", () => {
  const mockedCreateResponsePolicyHeaders = jest.mocked(
    createResponsePolicyHeaders,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates an HTML response with policy headers and response status", async () => {
    const headers = new Headers({
      "x-test": "yes",
    });

    mockedCreateResponsePolicyHeaders.mockReturnValue(headers);

    const appRenderContext = {
      responsePolicy: {
        status: 404,
        nonce: "test-nonce",
        robots: ["noindex"],
      },
    } as never;

    const env = createEnv();

    const response = createHtmlResponse(
      "<h1>Not found</h1>",
      appRenderContext,
      env,
    );

    expect(mockedCreateResponsePolicyHeaders).toHaveBeenCalledWith(
      {
        status: 404,
        nonce: "test-nonce",
        robots: ["noindex"],
      },
      env,
    );

    expect(response.status).toBe(404);
    expect(response.headers.get("x-test")).toBe("yes");
    expect(response.headers.get("content-type")).toBe(
      "text/html; charset=utf-8",
    );
    await expect(response.text()).resolves.toBe("<h1>Not found</h1>");
  });
});
