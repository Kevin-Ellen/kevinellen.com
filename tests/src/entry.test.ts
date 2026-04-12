// src/entry.test.ts

import { requestOrchestrator } from "@request/request";
import entryModule, { onRequest } from "../../src/entry";

jest.mock("@request/request", () => ({
  requestOrchestrator: jest.fn(),
}));

const mockedRequestOrchestrator = jest.mocked(requestOrchestrator);

describe("entry", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("passes req, env, and ctx to requestOrchestrator", async () => {
    const req = new Request("https://kevinellen.com/test");
    const env = {} as Env;
    const ctx = {} as ExecutionContext;
    const response = new Response("ok");

    mockedRequestOrchestrator.mockResolvedValue(response);

    const result = await onRequest(req, env, ctx);

    expect(mockedRequestOrchestrator).toHaveBeenCalledTimes(1);
    expect(mockedRequestOrchestrator).toHaveBeenCalledWith(req, env, ctx);
    expect(result).toBe(response);
  });

  it("default export fetch points to onRequest", async () => {
    const req = new Request("https://kevinellen.com/test");
    const env = {} as Env;
    const ctx = {} as ExecutionContext;
    const response = new Response("ok");

    mockedRequestOrchestrator.mockResolvedValue(response);

    const result = await entryModule.fetch(req, env, ctx);

    expect(mockedRequestOrchestrator).toHaveBeenCalledTimes(1);
    expect(mockedRequestOrchestrator).toHaveBeenCalledWith(req, env, ctx);
    expect(result).toBe(response);
  });
});
