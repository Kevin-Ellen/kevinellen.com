// tests/src/entry.test.ts

import entryModule, { onRequest } from "@src/entry";

import { createAppState } from "@app/appState/create.appState";
import { handleRequest } from "@app/request/request.handler";

jest.mock("@app/appState/create.appState", () => ({
  createAppState: jest.fn(),
}));

jest.mock("@app/request/request.handler", () => ({
  handleRequest: jest.fn(),
}));

describe("entry", () => {
  const mockedCreateAppState = jest.mocked(createAppState);
  const mockedHandleRequest = jest.mocked(handleRequest);

  const createRequest = (): Request => new Request("https://kevinellen.com/");

  const createEnv = (): Env =>
    ({
      APP_ENV: "dev",
    }) as Env;

  const createExecutionContext = (): ExecutionContext =>
    ({}) as ExecutionContext;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("onRequest", () => {
    it("creates app state once and passes it to handleRequest", async () => {
      const req = createRequest();
      const env = createEnv();
      const ctx = createExecutionContext();

      const appState = { mocked: "state" } as never;
      const response = new Response("ok", { status: 200 });

      mockedCreateAppState.mockReturnValue(appState);
      mockedHandleRequest.mockResolvedValue(response);

      const result = await onRequest(req, env, ctx);

      expect(mockedCreateAppState).toHaveBeenCalledTimes(1);
      expect(mockedHandleRequest).toHaveBeenCalledTimes(1);
      expect(mockedHandleRequest).toHaveBeenCalledWith(req, env, ctx, appState);
      expect(result).toBe(response);
    });

    it("returns the exact response from handleRequest", async () => {
      const req = createRequest();
      const env = createEnv();
      const ctx = createExecutionContext();

      const appState = { mocked: "state" } as never;
      const response = new Response("created", { status: 201 });

      mockedCreateAppState.mockReturnValue(appState);
      mockedHandleRequest.mockResolvedValue(response);

      const result = await onRequest(req, env, ctx);

      expect(result).toBe(response);
    });

    it("does not swallow errors from handleRequest", async () => {
      const req = createRequest();
      const env = createEnv();
      const ctx = createExecutionContext();

      const appState = { mocked: "state" } as never;
      const error = new Error("boom");

      mockedCreateAppState.mockReturnValue(appState);
      mockedHandleRequest.mockRejectedValue(error);

      await expect(onRequest(req, env, ctx)).rejects.toThrow("boom");
    });

    it("does not call handleRequest when createAppState throws", async () => {
      const req = createRequest();
      const env = createEnv();
      const ctx = createExecutionContext();

      const error = new Error("app state failed");

      mockedCreateAppState.mockImplementation(() => {
        throw error;
      });

      await expect(onRequest(req, env, ctx)).rejects.toThrow(
        "app state failed",
      );

      expect(mockedHandleRequest).not.toHaveBeenCalled();
    });
  });

  describe("default export", () => {
    it("maps fetch to onRequest", () => {
      expect(entryModule.fetch).toBe(onRequest);
    });
  });
});
