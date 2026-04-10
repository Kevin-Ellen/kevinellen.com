// src/entry.test.ts

import { onRequest, default as entryModule } from "../../src/entry";

import { createAppState } from "@app/appState/create.appState";
import { requestHandler } from "@app/handlers/request.handler";

jest.mock("@app/appState/create.appState", () => ({
  createAppState: jest.fn(),
}));

jest.mock("@app/handlers/request.handler", () => ({
  requestHandler: jest.fn(),
}));

describe("entry", () => {
  const mockCreateAppState = createAppState as jest.MockedFunction<
    typeof createAppState
  >;

  const mockRequestHandler = requestHandler as jest.MockedFunction<
    typeof requestHandler
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates app state and passes it to requestHandler", async () => {
    const req = new Request("https://kevinellen.com/");
    const env = {} as Env;
    const ctx = {} as ExecutionContext;

    const appState = { test: "app-state" };
    const response = new Response("ok", { status: 200 });

    mockCreateAppState.mockReturnValue(appState as never);
    mockRequestHandler.mockResolvedValue(response);

    const result = await onRequest(req, env, ctx);

    expect(mockCreateAppState).toHaveBeenCalledTimes(1);
    expect(mockRequestHandler).toHaveBeenCalledTimes(1);
    expect(mockRequestHandler).toHaveBeenCalledWith(req, env, ctx, appState);
    expect(result).toBe(response);
  });

  it("exports fetch as onRequest", () => {
    expect(entryModule.fetch).toBe(onRequest);
  });
});
