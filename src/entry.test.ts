// src/entry.test.ts

import { onRequest } from "./entry";
import { requestOrchestrator } from "@request/request";

jest.mock("@request/request", () => ({
  requestOrchestrator: jest.fn(),
}));

describe("entry", () => {
  const mockedRequestOrchestrator = jest.mocked(requestOrchestrator);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("exports onRequest as default fetch handler", async () => {
    const response = new Response("ok");

    mockedRequestOrchestrator.mockResolvedValue(response);

    const req = new Request("https://example.com");
    const env = {} as Env;
    const ctx = {} as ExecutionContext;

    const result = await onRequest(req, env, ctx);

    expect(result).toBe(response);

    expect(mockedRequestOrchestrator).toHaveBeenCalledWith(req, env, ctx);
  });

  it("exports fetch handler through default export", async () => {
    const response = new Response("default");

    mockedRequestOrchestrator.mockResolvedValue(response);

    const req = new Request("https://example.com");
    const env = {} as Env;
    const ctx = {} as ExecutionContext;

    const entryModule = await import("./entry");

    const result = await entryModule.default.fetch(req, env, ctx);

    expect(result).toBe(response);

    expect(mockedRequestOrchestrator).toHaveBeenCalledWith(req, env, ctx);
  });
});
