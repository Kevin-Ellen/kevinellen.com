// src/request/request.test.ts

import { requestOrchestrator } from "@request/request";

import { appStateCreate } from "@app-state/create.app-state";
import { appContextCreate } from "@app-context/create.app-context";
import { appRenderContextCreate } from "@app-render-context/create.app-render-context";

import { preRequestOrchestrator } from "@request/pre-request/pre-request.request";
import { preAppContextOrchestrator } from "@request/pre-app-context/pre-app-context.request";
import { orchestrateRouteResolution } from "@request/routing/orchestrate.route-resolution.request";
import { inspectRequest } from "@request/inspect/inspect.request";
import { createHtmlResponse } from "@request/response/create-html.response.request";

import { render } from "@rendering/renderer";

jest.mock("@app-state/create.app-state", () => ({
  appStateCreate: jest.fn(),
}));

jest.mock("@app-context/create.app-context", () => ({
  appContextCreate: jest.fn(),
}));

jest.mock("@app-render-context/create.app-render-context", () => ({
  appRenderContextCreate: jest.fn(),
}));

jest.mock("@request/pre-request/pre-request.request", () => ({
  preRequestOrchestrator: jest.fn(),
}));

jest.mock("@request/pre-app-context/pre-app-context.request", () => ({
  preAppContextOrchestrator: jest.fn(),
}));

jest.mock("@request/routing/orchestrate.route-resolution.request", () => ({
  orchestrateRouteResolution: jest.fn(),
}));

jest.mock("@request/inspect/inspect.request", () => ({
  inspectRequest: jest.fn(),
}));

jest.mock("@request/response/create-html.response.request", () => ({
  createHtmlResponse: jest.fn(),
}));

jest.mock("@rendering/renderer", () => ({
  render: jest.fn(),
}));

const createRequest = (): Request => new Request("https://example.com/journal");
const createEnv = (): Env => ({ APP_ENV: "prod" }) as Env;
const createCtx = (): ExecutionContext => ({}) as ExecutionContext;

describe("requestOrchestrator", () => {
  const mockedPreRequestOrchestrator = jest.mocked(preRequestOrchestrator);
  const mockedAppStateCreate = jest.mocked(appStateCreate);
  const mockedPreAppContextOrchestrator = jest.mocked(
    preAppContextOrchestrator,
  );
  const mockedOrchestrateRouteResolution = jest.mocked(
    orchestrateRouteResolution,
  );
  const mockedAppContextCreate = jest.mocked(appContextCreate);
  const mockedAppRenderContextCreate = jest.mocked(appRenderContextCreate);
  const mockedInspectRequest = jest.mocked(inspectRequest);
  const mockedRender = jest.mocked(render);
  const mockedCreateHtmlResponse = jest.mocked(createHtmlResponse);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns pre-request response immediately", async () => {
    const req = createRequest();
    const env = createEnv();
    const ctx = createCtx();
    const response = new Response("pre-request");

    mockedPreRequestOrchestrator.mockResolvedValue(response);

    await expect(requestOrchestrator(req, env, ctx)).resolves.toBe(response);

    expect(mockedPreRequestOrchestrator).toHaveBeenCalledWith(req, env, ctx);
    expect(mockedAppStateCreate).not.toHaveBeenCalled();
  });

  it("returns pre-app-context direct response immediately", async () => {
    const req = createRequest();
    const env = createEnv();
    const ctx = createCtx();
    const appState = { inspect: { boundary: "app-state" } };
    const response = new Response("direct");

    mockedPreRequestOrchestrator.mockResolvedValue(null);
    mockedAppStateCreate.mockResolvedValue(appState as never);
    mockedPreAppContextOrchestrator.mockResolvedValue({
      kind: "direct-response",
      response,
    });

    await expect(requestOrchestrator(req, env, ctx)).resolves.toBe(response);

    expect(mockedAppStateCreate).toHaveBeenCalledWith(env);
    expect(mockedPreAppContextOrchestrator).toHaveBeenCalledWith(
      req,
      env,
      appState,
    );
    expect(mockedOrchestrateRouteResolution).not.toHaveBeenCalled();
  });

  it("returns inspect response after app render context has been created", async () => {
    const req = createRequest();
    const env = createEnv();
    const ctx = createCtx();

    const appState = { inspect: { boundary: "app-state" } };
    const preAppContext = { kind: "continue" } as const;
    const routing = {
      kind: "found",
      publicPageId: "journal",
      pagination: null,
    };
    const appContext = { inspect: { boundary: "app-context" } };
    const appRenderContext = {
      inspect: { boundary: "app-render-context" },
      responsePolicy: {
        status: 200,
        nonce: "nonce",
        robots: [],
      },
    };
    const inspectResponse = new Response("inspect");

    mockedPreRequestOrchestrator.mockResolvedValue(null);
    mockedAppStateCreate.mockResolvedValue(appState as never);
    mockedPreAppContextOrchestrator.mockResolvedValue(preAppContext);
    mockedOrchestrateRouteResolution.mockReturnValue(routing as never);
    mockedAppContextCreate.mockResolvedValue(appContext as never);
    mockedAppRenderContextCreate.mockReturnValue(appRenderContext as never);
    mockedInspectRequest.mockReturnValue(inspectResponse);

    await expect(requestOrchestrator(req, env, ctx)).resolves.toBe(
      inspectResponse,
    );

    expect(mockedInspectRequest).toHaveBeenCalledWith(req, env, {
      appState,
      routing,
      appContext,
      appRenderContext,
    });

    expect(mockedRender).not.toHaveBeenCalled();
    expect(mockedCreateHtmlResponse).not.toHaveBeenCalled();
  });

  it("renders and returns HTML response", async () => {
    const req = createRequest();
    const env = createEnv();
    const ctx = createCtx();

    const appState = { inspect: { boundary: "app-state" } };
    const preAppContext = { kind: "continue" } as const;
    const routing = {
      kind: "found",
      publicPageId: "journal",
      pagination: null,
    };
    const appContext = { inspect: { boundary: "app-context" } };
    const appRenderContext = {
      inspect: { boundary: "app-render-context" },
      responsePolicy: {
        status: 200,
        nonce: "nonce",
        robots: [],
      },
    };
    const document = "<!doctype html>";
    const htmlResponse = new Response(document);

    mockedPreRequestOrchestrator.mockResolvedValue(null);
    mockedAppStateCreate.mockResolvedValue(appState as never);
    mockedPreAppContextOrchestrator.mockResolvedValue(preAppContext);
    mockedOrchestrateRouteResolution.mockReturnValue(routing as never);
    mockedAppContextCreate.mockResolvedValue(appContext as never);
    mockedAppRenderContextCreate.mockReturnValue(appRenderContext as never);
    mockedInspectRequest.mockReturnValue(null);
    mockedRender.mockReturnValue(document);
    mockedCreateHtmlResponse.mockReturnValue(htmlResponse);

    await expect(requestOrchestrator(req, env, ctx)).resolves.toBe(
      htmlResponse,
    );

    expect(mockedOrchestrateRouteResolution).toHaveBeenCalledWith(
      req,
      appState,
      preAppContext,
    );
    expect(mockedAppContextCreate).toHaveBeenCalledWith(appState, routing, env);
    expect(mockedAppRenderContextCreate).toHaveBeenCalledWith(appContext, env);
    expect(mockedRender).toHaveBeenCalledWith(appRenderContext);
    expect(mockedCreateHtmlResponse).toHaveBeenCalledWith(
      document,
      appRenderContext,
      env,
    );
  });

  it("passes pre-app-context error through route resolution", async () => {
    const req = createRequest();
    const env = createEnv();
    const ctx = createCtx();

    const appState = {};
    const preAppContext = { kind: "error", status: 410 } as const;
    const routing = { kind: "error", status: 410 };
    const appContext = { inspect: { boundary: "app-context" } };
    const appRenderContext = {
      inspect: { boundary: "app-render-context" },
      responsePolicy: {
        status: 410,
        nonce: "nonce",
        robots: ["noindex"],
      },
    };
    const document = "<h1>Gone</h1>";
    const htmlResponse = new Response(document, { status: 410 });

    mockedPreRequestOrchestrator.mockResolvedValue(null);
    mockedAppStateCreate.mockResolvedValue(appState as never);
    mockedPreAppContextOrchestrator.mockResolvedValue(preAppContext);
    mockedOrchestrateRouteResolution.mockReturnValue(routing as never);
    mockedAppContextCreate.mockResolvedValue(appContext as never);
    mockedAppRenderContextCreate.mockReturnValue(appRenderContext as never);
    mockedInspectRequest.mockReturnValue(null);
    mockedRender.mockReturnValue(document);
    mockedCreateHtmlResponse.mockReturnValue(htmlResponse);

    await expect(requestOrchestrator(req, env, ctx)).resolves.toBe(
      htmlResponse,
    );

    expect(mockedOrchestrateRouteResolution).toHaveBeenCalledWith(
      req,
      appState,
      preAppContext,
    );
  });
});
