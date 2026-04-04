// tests/src/app/policies/response/run.response.stage.test.ts

import { runResponseStage } from "@app/policies/response/run.response.stage";
import type {
  ResponsePolicy,
  ResponsePolicyContext,
} from "@app/policies/response/response.policies.types";

const createContext = (): ResponsePolicyContext => ({
  req: new Request("https://example.com/test"),
  env: {
    APP_ENV: "dev",
  } as Env,
  appState: {} as never,
  target: {} as never,
  security: {
    nonce: "testnonce123",
  },
});

describe("runResponseStage", () => {
  it("returns the original response when no policies are provided", async () => {
    const context = createContext();
    const response = new Response("hello", {
      headers: {
        "content-type": "text/plain",
      },
    });

    const result = runResponseStage(context, response, []);

    expect(result).toBe(response);
    await expect(result.text()).resolves.toBe("hello");
  });

  it("applies response policies in deterministic order", () => {
    const context = createContext();
    const response = new Response("hello");

    const calls: string[] = [];

    const firstPolicy: ResponsePolicy = (_context, inputResponse) => {
      calls.push("first");
      const headers = new Headers(inputResponse.headers);
      headers.set("x-first", "applied");

      return new Response(inputResponse.body, {
        status: inputResponse.status,
        statusText: inputResponse.statusText,
        headers,
      });
    };

    const secondPolicy: ResponsePolicy = (_context, inputResponse) => {
      calls.push("second");
      const headers = new Headers(inputResponse.headers);
      headers.set("x-second", "applied");

      return new Response(inputResponse.body, {
        status: inputResponse.status,
        statusText: inputResponse.statusText,
        headers,
      });
    };

    const result = runResponseStage(context, response, [
      firstPolicy,
      secondPolicy,
    ]);

    expect(calls).toEqual(["first", "second"]);
    expect(result.headers.get("x-first")).toBe("applied");
    expect(result.headers.get("x-second")).toBe("applied");
  });

  it("passes the evolving response through each policy", () => {
    const context = createContext();
    const response = new Response("hello");

    const firstPolicy: ResponsePolicy = (_context, inputResponse) => {
      const headers = new Headers(inputResponse.headers);
      headers.set("x-chain", "first");

      return new Response(inputResponse.body, {
        status: inputResponse.status,
        statusText: inputResponse.statusText,
        headers,
      });
    };

    const secondPolicy: ResponsePolicy = (_context, inputResponse) => {
      expect(inputResponse.headers.get("x-chain")).toBe("first");

      const headers = new Headers(inputResponse.headers);
      headers.set("x-chain", "second");

      return new Response(inputResponse.body, {
        status: inputResponse.status,
        statusText: inputResponse.statusText,
        headers,
      });
    };

    const result = runResponseStage(context, response, [
      firstPolicy,
      secondPolicy,
    ]);

    expect(result.headers.get("x-chain")).toBe("second");
  });
});
