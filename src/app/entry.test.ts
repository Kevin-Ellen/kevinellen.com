// src/app/entry.test.ts

import type { WorkerEnv } from "./entry.type";

import worker from "./entry";

import { handleLifeCycle } from "./life-cycle/life-cycle";
import { handleMediaSystem } from "./life-cycle/system/media/media.system";

jest.mock("./life-cycle/life-cycle", () => ({
  handleLifeCycle: jest.fn(),
}));

jest.mock("./life-cycle/system/media/media.system", () => ({
  handleMediaSystem: jest.fn(),
}));

const mockedHandleLifeCycle = jest.mocked(handleLifeCycle);
const mockedHandleMediaSystem = jest.mocked(handleMediaSystem);

describe("Worker entry", () => {
  const request = new Request("https://kevinellen.com/");

  const env = {
    CONTENT_KV: {} as KVNamespace,
    PHOTO_KV: {} as KVNamespace,
    IMAGES_ACCOUNT_HASH: "test-account-hash",
    ASSETS: {} as Fetcher,
    DOMAIN: "https://kevinellen.com",
    INSPECT_ENABLED: "false",
  } satisfies WorkerEnv;

  const ctx = {} as ExecutionContext;

  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();

    consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    mockedHandleMediaSystem.mockResolvedValue(null);
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  const expectSanitized500 = async (response: Response): Promise<void> => {
    expect(response.status).toBe(500);
    expect(response.headers.get("Content-Type")).toBe(
      "text/plain; charset=utf-8",
    );
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.text()).toBe("Internal Server Error");
  };

  it("delegates non-media requests to the lifecycle", async () => {
    const expected = new Response("OK");

    mockedHandleLifeCycle.mockResolvedValue(expected);

    const response = await worker.fetch(request, env, ctx);

    expect(mockedHandleMediaSystem).toHaveBeenCalledWith({
      request,
      imagesAccountHash: env.IMAGES_ACCOUNT_HASH,
      ctx,
    });

    expect(mockedHandleLifeCycle).toHaveBeenCalledWith({
      request,
      env,
    });

    expect(response).toBe(expected);
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("returns media responses without invoking the lifecycle", async () => {
    const expected = new Response("Media", { status: 200 });

    mockedHandleMediaSystem.mockResolvedValue(expected);

    const response = await worker.fetch(request, env, ctx);

    expect(response).toBe(expected);
    expect(mockedHandleLifeCycle).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
  });

  it.each(["CONTENT_KV", "PHOTO_KV", "ASSETS"] as const)(
    "returns a sanitized 500 when %s is missing",
    async (binding) => {
      const invalidEnv = {
        ...env,
        [binding]: undefined,
      } as WorkerEnv;

      const response = await worker.fetch(request, invalidEnv, ctx);

      await expectSanitized500(response);

      expect(mockedHandleMediaSystem).not.toHaveBeenCalled();
      expect(mockedHandleLifeCycle).not.toHaveBeenCalled();

      expect(consoleError).toHaveBeenCalledWith("Worker request failed", {
        error: {
          name: "Error",
          message: `Missing required binding: ${binding}`,
        },
      });
    },
  );

  it.each([
    ["DOMAIN", undefined, "Missing required variable: DOMAIN"],
    ["DOMAIN", "   ", "Missing required variable: DOMAIN"],
    [
      "IMAGES_ACCOUNT_HASH",
      undefined,
      "Missing required variable: IMAGES_ACCOUNT_HASH",
    ],
    [
      "IMAGES_ACCOUNT_HASH",
      "   ",
      "Missing required variable: IMAGES_ACCOUNT_HASH",
    ],
    [
      "INSPECT_ENABLED",
      undefined,
      "Invalid or missing variable: INSPECT_ENABLED",
    ],
    ["INSPECT_ENABLED", "yes", "Invalid or missing variable: INSPECT_ENABLED"],
    ["INSPECT_ENABLED", "", "Invalid or missing variable: INSPECT_ENABLED"],
  ] as const)(
    "returns a sanitized 500 when %s is invalid",
    async (variable, value, message) => {
      const invalidEnv = {
        ...env,
        [variable]: value,
      } as WorkerEnv;

      const response = await worker.fetch(request, invalidEnv, ctx);

      await expectSanitized500(response);

      expect(mockedHandleMediaSystem).not.toHaveBeenCalled();
      expect(mockedHandleLifeCycle).not.toHaveBeenCalled();

      expect(consoleError).toHaveBeenCalledWith("Worker request failed", {
        error: {
          name: "Error",
          message,
        },
      });
    },
  );

  it("returns a sanitized 500 when DOMAIN is not a valid URL", async () => {
    const invalidEnv = {
      ...env,
      DOMAIN: "not-a-valid-url",
    } as WorkerEnv;

    const response = await worker.fetch(request, invalidEnv, ctx);

    await expectSanitized500(response);

    expect(mockedHandleMediaSystem).not.toHaveBeenCalled();
    expect(mockedHandleLifeCycle).not.toHaveBeenCalled();

    expect(consoleError).toHaveBeenCalledWith("Worker request failed", {
      error: {
        name: "Error",
        message: "Invalid variable: DOMAIN must be a valid URL",
      },
    });
  });

  it("returns a sanitized 500 when media handling fails", async () => {
    mockedHandleMediaSystem.mockRejectedValue(
      new Error("Private media upstream failure"),
    );

    const response = await worker.fetch(request, env, ctx);

    await expectSanitized500(response);

    expect(mockedHandleLifeCycle).not.toHaveBeenCalled();

    expect(consoleError).toHaveBeenCalledWith("Worker request failed", {
      error: {
        name: "Error",
        message: "Private media upstream failure",
      },
    });
  });

  it("returns a sanitized 500 when the lifecycle fails", async () => {
    mockedHandleLifeCycle.mockRejectedValue(
      new Error("Invalid published content in KV: private-key"),
    );

    const response = await worker.fetch(request, env, ctx);

    await expectSanitized500(response);

    expect(mockedHandleLifeCycle).toHaveBeenCalledWith({
      request,
      env,
    });

    expect(consoleError).toHaveBeenCalledWith("Worker request failed", {
      error: {
        name: "Error",
        message: "Invalid published content in KV: private-key",
      },
    });
  });

  it("handles non-Error failures without exposing their values", async () => {
    mockedHandleLifeCycle.mockRejectedValue({
      token: "secret-value",
    });

    const response = await worker.fetch(request, env, ctx);

    await expectSanitized500(response);

    expect(consoleError).toHaveBeenCalledWith("Worker request failed", {
      error: {
        name: "UnknownError",
      },
    });
  });

  it("preserves expected HTTP error responses", async () => {
    const expected = new Response("Not Found", { status: 404 });

    mockedHandleLifeCycle.mockResolvedValue(expected);

    const response = await worker.fetch(request, env, ctx);

    expect(response).toBe(expected);
    expect(response.status).toBe(404);
    expect(consoleError).not.toHaveBeenCalled();
  });
});
