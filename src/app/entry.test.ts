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
    DEPLOYMENT_ENVIRONMENT: "production",
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

  const expectSanitized500 = async (
    response: Response,
    noindex = false,
  ): Promise<void> => {
    expect(response.status).toBe(500);
    expect(response.headers.get("Content-Type")).toBe(
      "text/plain; charset=utf-8",
    );
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("X-Robots-Tag")).toBe(
      noindex ? "noindex" : null,
    );
    expect(await response.text()).toBe("Internal Server Error");
  };

  describe("Request routing", () => {
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

    it("preserves expected HTTP error responses", async () => {
      const expected = new Response("Not Found", { status: 404 });

      mockedHandleLifeCycle.mockResolvedValue(expected);

      const response = await worker.fetch(request, env, ctx);

      expect(response).toBe(expected);
      expect(response.status).toBe(404);
      expect(consoleError).not.toHaveBeenCalled();
    });
  });

  describe("Indexing policy", () => {
    it.each(["development", "staging"] as const)(
      "adds noindex to %s lifecycle responses",
      async (environment) => {
        const expected = new Response("OK", {
          headers: {
            "X-Test-Header": "preserved",
          },
        });

        mockedHandleLifeCycle.mockResolvedValue(expected);

        const response = await worker.fetch(
          request,
          {
            ...env,
            DEPLOYMENT_ENVIRONMENT: environment,
          },
          ctx,
        );

        expect(response).not.toBe(expected);
        expect(response.status).toBe(200);
        expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
        expect(response.headers.get("X-Test-Header")).toBe("preserved");
        expect(await response.text()).toBe("OK");
        expect(consoleError).not.toHaveBeenCalled();
      },
    );

    it("does not add noindex in production", async () => {
      const expected = new Response("OK");

      mockedHandleLifeCycle.mockResolvedValue(expected);

      const response = await worker.fetch(request, env, ctx);

      expect(response).toBe(expected);
      expect(response.headers.get("X-Robots-Tag")).toBeNull();
      expect(consoleError).not.toHaveBeenCalled();
    });

    it.each(["development", "staging"] as const)(
      "adds noindex to %s media responses",
      async (environment) => {
        const expected = new Response("Media");

        mockedHandleMediaSystem.mockResolvedValue(expected);

        const response = await worker.fetch(
          request,
          {
            ...env,
            DEPLOYMENT_ENVIRONMENT: environment,
          },
          ctx,
        );

        expect(response).not.toBe(expected);
        expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
        expect(await response.text()).toBe("Media");
        expect(mockedHandleLifeCycle).not.toHaveBeenCalled();
        expect(consoleError).not.toHaveBeenCalled();
      },
    );

    it("preserves null-body responses in staging", async () => {
      const expected = new Response(null, { status: 304 });

      mockedHandleLifeCycle.mockResolvedValue(expected);

      const response = await worker.fetch(
        request,
        {
          ...env,
          DEPLOYMENT_ENVIRONMENT: "staging",
        },
        ctx,
      );

      expect(response.status).toBe(304);
      expect(response.body).toBeNull();
      expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
      expect(consoleError).not.toHaveBeenCalled();
    });

    it("adds noindex to staging HTTP error responses", async () => {
      mockedHandleLifeCycle.mockResolvedValue(
        new Response("Not Found", { status: 404 }),
      );

      const response = await worker.fetch(
        request,
        {
          ...env,
          DEPLOYMENT_ENVIRONMENT: "staging",
        },
        ctx,
      );

      expect(response.status).toBe(404);
      expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
      expect(await response.text()).toBe("Not Found");
      expect(consoleError).not.toHaveBeenCalled();
    });

    it("adds noindex to staging internal errors", async () => {
      mockedHandleLifeCycle.mockRejectedValue(new Error("Internal failure"));

      const response = await worker.fetch(
        request,
        {
          ...env,
          DEPLOYMENT_ENVIRONMENT: "staging",
        },
        ctx,
      );

      await expectSanitized500(response, true);
    });
  });

  describe("Environment validation", () => {
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
      [
        "INSPECT_ENABLED",
        "yes",
        "Invalid or missing variable: INSPECT_ENABLED",
      ],
      ["INSPECT_ENABLED", "", "Invalid or missing variable: INSPECT_ENABLED"],
      [
        "DEPLOYMENT_ENVIRONMENT",
        undefined,
        "Invalid or missing variable: DEPLOYMENT_ENVIRONMENT",
      ],
      [
        "DEPLOYMENT_ENVIRONMENT",
        "",
        "Invalid or missing variable: DEPLOYMENT_ENVIRONMENT",
      ],
      [
        "DEPLOYMENT_ENVIRONMENT",
        "preview",
        "Invalid or missing variable: DEPLOYMENT_ENVIRONMENT",
      ],
      [
        "DEPLOYMENT_ENVIRONMENT",
        "Production",
        "Invalid or missing variable: DEPLOYMENT_ENVIRONMENT",
      ],
    ] as const)(
      "returns a sanitized 500 when %s is invalid (%s)",
      async (variable, value, message) => {
        const invalidEnv = {
          ...env,
          [variable]: value,
        } as WorkerEnv;

        const response = await worker.fetch(request, invalidEnv, ctx);

        await expectSanitized500(
          response,
          variable === "DEPLOYMENT_ENVIRONMENT",
        );

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
  });

  describe("Error handling", () => {
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
  });
});
