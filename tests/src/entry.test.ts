// tests/src/entry.test.ts

import { AppState } from "@app/appState/appState";
import * as entryModule from "@src/entry";
import { handleRequest } from "@app/request/handler.request";

jest.mock("@app/request/handler.request", () => ({
  handleRequest: jest.fn(),
}));

describe("entry request boundary", () => {
  const mockedHandleRequest = jest.mocked(handleRequest);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("builds AppState once at request start and passes the same instance to handleRequest", async () => {
    const expectedResponse = new Response("ok", { status: 200 });
    const appState = {} as AppState;

    const buildAppStateSpy = jest
      .spyOn(entryModule, "buildAppState")
      .mockResolvedValue(appState);

    mockedHandleRequest.mockResolvedValue(expectedResponse);

    const request = new Request("https://example.com/");
    const env = {} as Env;
    const ctx = {} as ExecutionContext;

    const response = await entryModule.onRequest(request, env, ctx);

    expect(buildAppStateSpy).toHaveBeenCalledTimes(1);
    expect(mockedHandleRequest).toHaveBeenCalledTimes(1);
    expect(mockedHandleRequest).toHaveBeenCalledWith(
      request,
      env,
      ctx,
      appState,
    );
    expect(response).toBe(expectedResponse);
  });

  it("propagates buildAppState failures instead of hiding bootstrap errors", async () => {
    const bootstrapError = new Error("Failed to build AppState");

    jest.spyOn(entryModule, "buildAppState").mockRejectedValue(bootstrapError);

    const request = new Request("https://example.com/");
    const env = {} as Env;
    const ctx = {} as ExecutionContext;

    await expect(entryModule.onRequest(request, env, ctx)).rejects.toThrow(
      "Failed to build AppState",
    );

    expect(mockedHandleRequest).not.toHaveBeenCalled();
  });

  it("propagates handleRequest failures instead of masking downstream errors", async () => {
    const requestError = new Error("Request handling failed");
    const appState = {} as AppState;

    jest.spyOn(entryModule, "buildAppState").mockResolvedValue(appState);
    mockedHandleRequest.mockRejectedValue(requestError);

    const request = new Request("https://example.com/");
    const env = {} as Env;
    const ctx = {} as ExecutionContext;

    await expect(entryModule.onRequest(request, env, ctx)).rejects.toThrow(
      "Request handling failed",
    );
  });
});
