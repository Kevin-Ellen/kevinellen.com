// tests/src/request/request.test.ts

import type { AppState } from "@app-state/class.app-state";
import { appStateCreate } from "@app-state/create.app-state";
import { preAppContextOrchestrator } from "@request/pre-app-context/pre-app-context.request";
import { preRequestOrchestrator } from "@request/pre-request/pre-request.request";
import { requestOrchestrator } from "@request/request";

jest.mock("@request/pre-request/pre-request.request", () => ({
  preRequestOrchestrator: jest.fn(),
}));

jest.mock("@request/pre-app-context/pre-app-context.request", () => ({
  preAppContextOrchestrator: jest.fn(),
}));

jest.mock("@app-state/create.app-state", () => ({
  appStateCreate: jest.fn(),
}));

const mockedPreRequestOrchestrator = jest.mocked(preRequestOrchestrator);
const mockedPreAppContextOrchestrator = jest.mocked(preAppContextOrchestrator);
const mockedAppStateCreate = jest.mocked(appStateCreate);

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
    expect(mockedAppStateCreate).not.toHaveBeenCalled();
    expect(mockedPreAppContextOrchestrator).not.toHaveBeenCalled();
    expect(result).toBe(preRequestResponse);
  });

  it("returns the pre-app-context direct response when one is provided", async () => {
    const req = new Request("https://kevinellen.com/robots.txt");
    const env = {
      APP_HOST: "kevinellen.com",
    } as unknown as Env;
    const ctx = {} as ExecutionContext;

    const appState = {
      inspect: { ok: true },
    } as unknown as AppState;

    const preAppContextResponse = new Response("robots", {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    });

    mockedPreRequestOrchestrator.mockResolvedValue(null);
    mockedAppStateCreate.mockReturnValue(appState);
    mockedPreAppContextOrchestrator.mockResolvedValue({
      kind: "direct-response",
      response: preAppContextResponse,
    });

    const result = await requestOrchestrator(req, env, ctx);

    expect(mockedPreRequestOrchestrator).toHaveBeenCalledWith(req, env, ctx);
    expect(mockedAppStateCreate).toHaveBeenCalledWith(env);
    expect(mockedPreAppContextOrchestrator).toHaveBeenCalledWith(
      req,
      env,
      appState,
    );
    expect(result).toBe(preAppContextResponse);
  });

  it("continues into the application path when pre-request returns null and pre-app-context continues", async () => {
    const req = new Request("https://kevinellen.com/");
    const env = {
      APP_HOST: "kevinellen.com",
    } as unknown as Env;
    const ctx = {} as ExecutionContext;

    const appState = {
      inspect: { ok: true },
    } as unknown as AppState;

    mockedPreRequestOrchestrator.mockResolvedValue(null);
    mockedAppStateCreate.mockReturnValue(appState);
    mockedPreAppContextOrchestrator.mockResolvedValue({
      kind: "continue",
    });

    const result = await requestOrchestrator(req, env, ctx);

    expect(mockedPreRequestOrchestrator).toHaveBeenCalledWith(req, env, ctx);
    expect(mockedAppStateCreate).toHaveBeenCalledWith(env);
    expect(mockedPreAppContextOrchestrator).toHaveBeenCalledWith(
      req,
      env,
      appState,
    );
    expect(result).toBeInstanceOf(Response);
    await expect(result.text()).resolves.toBe(
      JSON.stringify(appState.inspect, null, 2),
    );
  });

  it("returns a 410 response when pre-app-context resolves an error with status 410", async () => {
    const req = new Request("https://kevinellen.com/old-page");
    const env = {
      APP_HOST: "kevinellen.com",
    } as unknown as Env;
    const ctx = {} as ExecutionContext;

    const appState = {
      inspect: { ok: true },
    } as unknown as AppState;

    mockedPreRequestOrchestrator.mockResolvedValue(null);
    mockedAppStateCreate.mockReturnValue(appState);
    mockedPreAppContextOrchestrator.mockResolvedValue({
      kind: "error",
      status: 410,
    });

    const result = await requestOrchestrator(req, env, ctx);

    expect(result.status).toBe(410);
    await expect(result.text()).resolves.toBe("gone");
  });
});
