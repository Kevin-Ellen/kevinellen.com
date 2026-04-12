// tests/src/request/request.test.ts

import { preRequestOrchestrator } from "@request/pre-request/pre-request.request";
import { requestOrchestrator } from "@request/request";

jest.mock("@request/pre-request/pre-request.request", () => ({
  preRequestOrchestrator: jest.fn(),
}));

const mockedPreRequestOrchestrator = jest.mocked(preRequestOrchestrator);

describe("requestOrchestrator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the pre-request response when one is provided", async () => {
    const req = new Request("https://kevinellen.com/favicon.ico");
    const env = {
      APP_HOST: "kevinellen.com",
    } as unknown as Env;
    const ctx = {} as ExecutionContext;
    const preRequestResponse = new Response("asset");

    mockedPreRequestOrchestrator.mockResolvedValue(preRequestResponse);

    const result = await requestOrchestrator(req, env, ctx);

    expect(mockedPreRequestOrchestrator).toHaveBeenCalledTimes(1);
    expect(mockedPreRequestOrchestrator).toHaveBeenCalledWith(req, env, ctx);
    expect(result).toBe(preRequestResponse);
  });

  it("continues into the application path when pre-request returns null", async () => {
    const req = new Request("https://kevinellen.com/");
    const env = {
      APP_HOST: "kevinellen.com",
    } as unknown as Env;
    const ctx = {} as ExecutionContext;

    mockedPreRequestOrchestrator.mockResolvedValue(null);

    const result = await requestOrchestrator(req, env, ctx);

    expect(mockedPreRequestOrchestrator).toHaveBeenCalledTimes(1);
    expect(mockedPreRequestOrchestrator).toHaveBeenCalledWith(req, env, ctx);
    expect(result).toBeInstanceOf(Response);
  });
});
