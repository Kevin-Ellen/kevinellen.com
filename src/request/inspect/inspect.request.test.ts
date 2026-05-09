// src/request/inspect/inspect.request.test.ts

import { inspectRequest } from "@request/inspect/inspect.request";

const createEnv = (APP_ENV: Env["APP_ENV"] = "dev"): Env =>
  ({ APP_ENV }) as Env;

const createRequest = (query = ""): Request =>
  new Request(`https://example.com/${query}`);

const readJson = async (response: Response): Promise<unknown> =>
  response.json();

describe("inspectRequest", () => {
  it("returns null outside dev", () => {
    const response = inspectRequest(
      createRequest("?__inspect"),
      createEnv("prod"),
      {},
    );

    expect(response).toBeNull();
  });

  it("returns null when inspect query param is missing", () => {
    const response = inspectRequest(createRequest(), createEnv(), {});

    expect(response).toBeNull();
  });

  it("returns available targets when inspect param has no value", async () => {
    const response = inspectRequest(
      createRequest("?__inspect"),
      createEnv(),
      {},
    );

    expect(response).not.toBeNull();
    expect(response?.status).toBe(200);
    expect(response?.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );

    await expect(readJson(response as Response)).resolves.toEqual({
      queryParam: "__inspect",
      usage: [
        "?__inspect",
        "?__inspect=available",
        "?__inspect=app-state",
        "?__inspect=routing",
        "?__inspect=app-context",
        "?__inspect=app-render-context",
      ],
      availableTargets: [
        "available",
        "app-state",
        "routing",
        "app-context",
        "app-render-context",
      ],
    });
  });

  it("returns available targets when inspect target is available", async () => {
    const response = inspectRequest(
      createRequest("?__inspect=available"),
      createEnv(),
      {},
    );

    expect(response?.status).toBe(200);

    await expect(readJson(response as Response)).resolves.toMatchObject({
      queryParam: "__inspect",
      availableTargets: [
        "available",
        "app-state",
        "routing",
        "app-context",
        "app-render-context",
      ],
    });
  });

  it("returns unknown target response for unsupported inspect target", async () => {
    const response = inspectRequest(
      createRequest("?__inspect=banana"),
      createEnv(),
      {},
    );

    expect(response?.status).toBe(400);

    await expect(readJson(response as Response)).resolves.toEqual({
      error: "Unknown inspect target 'banana'.",
      availableTargets: [
        "available",
        "app-state",
        "routing",
        "app-context",
        "app-render-context",
      ],
    });
  });

  it("returns app-state inspect output when available", async () => {
    const response = inspectRequest(
      createRequest("?__inspect=app-state"),
      createEnv(),
      {
        appState: {
          inspect: { boundary: "app-state" },
        } as never,
      },
    );

    expect(response?.status).toBe(200);
    await expect(readJson(response as Response)).resolves.toEqual({
      boundary: "app-state",
    });
  });

  it("returns unavailable response when app-state is missing", async () => {
    const response = inspectRequest(
      createRequest("?__inspect=app-state"),
      createEnv(),
      {},
    );

    expect(response?.status).toBe(409);
    await expect(readJson(response as Response)).resolves.toEqual({
      error: "Inspect target 'app-state' is not available at this stage.",
      availableTargets: [
        "available",
        "app-state",
        "routing",
        "app-context",
        "app-render-context",
      ],
    });
  });

  it("returns routing output when available", async () => {
    const routing = {
      kind: "public",
      pathname: "/journal",
    };

    const response = inspectRequest(
      createRequest("?__inspect=routing"),
      createEnv(),
      {
        routing: routing as never,
      },
    );

    expect(response?.status).toBe(200);
    await expect(readJson(response as Response)).resolves.toEqual(routing);
  });

  it("returns unavailable response when routing is missing", async () => {
    const response = inspectRequest(
      createRequest("?__inspect=routing"),
      createEnv(),
      {},
    );

    expect(response?.status).toBe(409);
    await expect(readJson(response as Response)).resolves.toMatchObject({
      error: "Inspect target 'routing' is not available at this stage.",
    });
  });

  it("returns app-context inspect output when available", async () => {
    const response = inspectRequest(
      createRequest("?__inspect=app-context"),
      createEnv(),
      {
        appContext: {
          inspect: { boundary: "app-context" },
        } as never,
      },
    );

    expect(response?.status).toBe(200);
    await expect(readJson(response as Response)).resolves.toEqual({
      boundary: "app-context",
    });
  });

  it("returns unavailable response when app-context is missing", async () => {
    const response = inspectRequest(
      createRequest("?__inspect=app-context"),
      createEnv(),
      {},
    );

    expect(response?.status).toBe(409);
    await expect(readJson(response as Response)).resolves.toMatchObject({
      error: "Inspect target 'app-context' is not available at this stage.",
    });
  });

  it("returns app-render-context inspect output when available", async () => {
    const response = inspectRequest(
      createRequest("?__inspect=app-render-context"),
      createEnv(),
      {
        appRenderContext: {
          inspect: { boundary: "app-render-context" },
        } as never,
      },
    );

    expect(response?.status).toBe(200);
    await expect(readJson(response as Response)).resolves.toEqual({
      boundary: "app-render-context",
    });
  });

  it("returns unavailable response when app-render-context is missing", async () => {
    const response = inspectRequest(
      createRequest("?__inspect=app-render-context"),
      createEnv(),
      {},
    );

    expect(response?.status).toBe(409);
    await expect(readJson(response as Response)).resolves.toMatchObject({
      error:
        "Inspect target 'app-render-context' is not available at this stage.",
    });
  });
});
