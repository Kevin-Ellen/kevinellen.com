// src/app/life-cycle/response/response.test.ts

import type {
  ResponseInput,
  ResponseOutput,
} from "../../types/response/response.shared.type";

import { handleResponse } from "./response";
import { handleRejectionResponse } from "./rejection/rejection.response";
import { handleRedirectResponse } from "./redirect/redirect.response";
import { handleJsonResponse } from "./json/json.response";
import { handleTextResponse } from "./text/text.response";
import { handleHtmlResponse } from "./html/html.response";
import { handleXmlResponse } from "./xml/xml.response";

jest.mock("./rejection/rejection.response", () => ({
  handleRejectionResponse: jest.fn(),
}));

jest.mock("./redirect/redirect.response", () => ({
  handleRedirectResponse: jest.fn(),
}));

jest.mock("./json/json.response", () => ({
  handleJsonResponse: jest.fn(),
}));

jest.mock("./text/text.response", () => ({
  handleTextResponse: jest.fn(),
}));

jest.mock("./html/html.response", () => ({
  handleHtmlResponse: jest.fn(),
}));

jest.mock("./xml/xml.response", () => ({
  handleXmlResponse: jest.fn(),
}));

const mockedRejection = jest.mocked(handleRejectionResponse);
const mockedRedirect = jest.mocked(handleRedirectResponse);
const mockedJson = jest.mocked(handleJsonResponse);
const mockedText = jest.mocked(handleTextResponse);
const mockedHtml = jest.mocked(handleHtmlResponse);
const mockedXml = jest.mocked(handleXmlResponse);

describe("Response dispatcher", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it.each([
    ["json", mockedJson],
    ["txt", mockedText],
    ["html", mockedHtml],
    ["xml", mockedXml],
    ["redirect", mockedRedirect],
  ] as const)("dispatches %s responses", (kind, handler) => {
    const document = {
      kind,
      status: kind === "redirect" ? 301 : 200,
      body: "test-body",
      nonce: "test-nonce",
      location: "https://kevinellen.com/",
    } as ResponseOutput;

    const expected = new Response(null, { status: 200 });

    handler.mockReturnValue(expected);

    const response = handleResponse({
      result: document,
    });

    expect(handler).toHaveBeenCalledWith({
      document,
    });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(response).toBe(expected);
  });

  it("dispatches request rejections", () => {
    const rejection = {
      ok: false,
      reason: "METHOD_NOT_ALLOWED",
    } as Extract<ResponseInput, { ok: false }>;

    const expected = new Response("Method Not Allowed", {
      status: 405,
    });

    mockedRejection.mockReturnValue(expected);

    const response = handleResponse({
      result: rejection,
    });

    expect(mockedRejection).toHaveBeenCalledWith({
      result: rejection,
    });
    expect(mockedRejection).toHaveBeenCalledTimes(1);
    expect(response).toBe(expected);

    expect(mockedJson).not.toHaveBeenCalled();
    expect(mockedText).not.toHaveBeenCalled();
    expect(mockedHtml).not.toHaveBeenCalled();
    expect(mockedXml).not.toHaveBeenCalled();
    expect(mockedRedirect).not.toHaveBeenCalled();
  });

  it("rejects unsupported response kinds", () => {
    const unsupported = {
      kind: "unsupported",
      status: 200,
      body: "test",
    } as unknown as ResponseOutput;

    expect(() =>
      handleResponse({
        result: unsupported,
      }),
    ).toThrow("Unsupported response kind: unsupported");

    expect(mockedRejection).not.toHaveBeenCalled();
    expect(mockedJson).not.toHaveBeenCalled();
    expect(mockedText).not.toHaveBeenCalled();
    expect(mockedHtml).not.toHaveBeenCalled();
    expect(mockedXml).not.toHaveBeenCalled();
    expect(mockedRedirect).not.toHaveBeenCalled();
  });
});
